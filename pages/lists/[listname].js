import {useState, useEffect} from "react";
import {
  StyledCard_List,
  StyledForm,
  StyledActions,
  StyledButton,
  StyledDiv,
  StyledText,
} from "../../components/Primitives";
import TodoList from "../../artifacts/contracts/TodoList.sol/TodoList.json";
import TextInput from "../../components/TextInput";
import Tooltip from "../../components/Tooltip";
import Tabs from "../../components/Tabs";
import Loading from "../../components/Loading";
import {keyframes, styled} from "@stitches/react";
import * as Realm from "realm-web";
import * as Utils from "../../utils"

export default function Todo() {
  const [tasks, updateTasks] = useState([]);
  const [permissions, updatePermissions] = useState({});
  const [changesMade, toggleChangesMade] = useState(false);
  const [costEstimate, updateEstimate] = useState({});
  const [listSaved, setSaved] = useState();
  const [loading, setLoading] = useState(true);
  const [processingTransaction, setProcessing] = useState(false);

  const [listAddress, setListAddress] = useState();
  const [network, setNetwork] = useState();
  const [userAddress, setUserAddress] = useState();

  useEffect(() => {
    const initialContractLoad = async () => {

      const connection = await Utils.connectToNetwork(
        window.localStorage.getItem("network")
      );
      const provider = await Utils.getProvider(connection);
      const listContract = await Utils.getContract(
        window.localStorage.getItem("contractAddress"),
        TodoList.abi,
        provider
      );
      const contractData = await listContract.getData();
      const _tasks = [];

      for (let i = 0; i < contractData[0].length; i++) {
        _tasks.push({
          id: i,
          content: await Utils.parseBytes32String(contractData[0][i]),
          completed: contractData[1][i],
          new: false,
          changed: false,
        });
      }

      updateTasks(_tasks);

      const hasAccess = await listContract.getWriteStatus({
        from: window.localStorage.getItem("userAddress"),
      });
      const isOwner = await listContract.getOwnershipStatus({
        from: window.localStorage.getItem("userAddress"),
      });
      updatePermissions({writeAccess: hasAccess, ownerStatus: isOwner});

      const app = new Realm.App({id: "application-0-heuqo"});
      const credentials = Realm.Credentials.anonymous();
      const logIn = await app.logIn(credentials);

      const client = app.currentUser.mongoClient("mongodb-atlas");
      const collection = client
        .db(window.localStorage.getItem("network"))
        .collection("users");
      const contracts = (
        await collection.findOne({
          address: window.localStorage.getItem("userAddress"),
        })
      ).contracts;
      
      setListAddress(window.localStorage.getItem("contractAddress"));
      setNetwork(window.localStorage.getItem("network"));
      setUserAddress(window.localStorage.getItem("userAddress"));
      setSaved(contracts.includes(window.localStorage.getItem("contractAddress")));
      setLoading(false);
    };
    initialContractLoad();
  }, []);

  useEffect(() => {
    const estimateGas = async () => {
      const connection = await Utils.connectToNetwork(
        window.localStorage.getItem("network")
      );
      const provider = await Utils.getProvider(connection);
      const signer = provider.getSigner();

      const changedIds = [];
      const changedContents = [];
      const changedStatuses = [];

      tasks.forEach((item) => {
        if (item.changed == true) {
          changedIds.push(item.id);
          changedContents.push(Utils.formatBytes32String(item.content));
          changedStatuses.push(item.completed);
        }
      });

      const gasPrice = await Utils.formatUnits(await provider.getGasPrice(), "ether");
      const gasUnits = parseInt(
        (
          await (
            await Utils.getContract(
              window.localStorage.getItem("contractAddress"),
              TodoList.abi,
              signer
            )
          ).estimateGas.saveChanges(
            changedIds,
            changedContents,
            changedStatuses
          )
        )._hex,
        16
      );

      const transactionCostETH = parseFloat(gasPrice) * gasUnits;
      const ETHValue = 1240.23; // Update later
      const transactionCostUSD = transactionCostETH * ETHValue;
      updateEstimate({eth: transactionCostETH, usd: transactionCostUSD});
    };
    estimateGas();
  }, [tasks]);

  const checkChanges = (list) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].changed == true) {
        return true;
      }
    }
    return false;
  };

  const addTask = (e, name) => {
    e.preventDefault();
    updateTasks([
      ...tasks,
      {
        id: tasks.length,
        content: name,
        completed: false,
        new: true,
        changed: true,
      },
    ]);

    if (!changesMade) toggleChangesMade(true);
  };

  const modifyWriteAccess = async (e, address) => {
    if (typeof window.ethereum == "undefined") return;

    const connection = await Utils.connectToNetwork(
      window.localStorage.getItem("network")
    );
    const signer = (await Utils.getProvider(connection)).getSigner();
    const contract = await Utils.getContract(listAddress, TodoList.abi, signer);
    await contract.grantWriteAccess(address, {
      from: userAddress,
    });
  };

  const saveChanges = async () => {
    const changedIds = [];
    const changedContents = [];
    const changedStatuses = [];

    tasks.forEach((item) => {
      if (item.changed == true) {
        changedIds.push(item.id);
        changedContents.push(Utils.formatBytes32String(item.content));
        changedStatuses.push(item.completed);
      }
    });

    const connection = await Utils.connectToNetwork(
      window.localStorage.getItem("network")
    );
    const signer = (await Utils.getProvider(connection)).getSigner();
    const contract = await Utils.getContract(listAddress, TodoList.abi, signer);
    await contract.saveChanges(changedIds, changedContents, changedStatuses, {
      from: userAddress,
    });

    setProcessing(true);

    contract.once("ChangesSaved", async (event) => {
      setProcessing(false);
      toggleChangesMade(false);

      const copy = [...tasks];
      copy.forEach((item) => {
        if (item.new) item.new = false;
        if (item.changed) item.changed = false;
      });

      updateTasks(copy);
    });
  };

  const cancelChanges = () => {
    const filteredTasks = tasks.filter((each) => !each.new);
    filteredTasks.forEach((item) => {
      if (item.changed) {
        item.completed = !item.completed;
        item.changed = false;
      }
    });
    updateTasks(filteredTasks);
    toggleChangesMade(false);
  };

  const revert = (taskId) => {
    const index = tasks.findIndex((item) => {
      return item.id == taskId;
    });

    const copy = [...tasks];
    copy.splice(index, 1);

    updateTasks(copy);
    toggleChangesMade(checkChanges(copy));
  };

  const addList = async () => {
    const app = new Realm.App({id: "application-0-heuqo"});
    const credentials = Realm.Credentials.anonymous();
    const logIn = await app.logIn(credentials);

    const client = app.currentUser.mongoClient("mongodb-atlas");
    const collection = client
      .db(window.localStorage.getItem("network"))
      .collection("users");
    const query = {address: window.localStorage.getItem("userAddress")};
    const updateDoc = {
      $push: {
        contracts: window.localStorage.getItem("contractAddress"),
      },
    };
    const result = await collection.updateOne(query, updateDoc);
    window.location.reload()
  };

  const toggle = (taskId, completed) => {
    const copy = [...tasks];
    const index = copy.findIndex((item) => {
      return item.id == taskId;
    });
    copy[index].completed = completed;

    if (copy[index].new == false) {
      copy[index].changed = !copy[index].changed;
    }

    updateTasks(copy);
    toggleChangesMade(checkChanges(copy));
  };

  return (
    <StyledCard_List loading={loading} writeAccess={permissions.writeAccess}>
      {processingTransaction == true && <Loading fullscreen={true} />}
      <StyledForm className={"form"}>
        <TextInput submit={addTask} maxLength={31} page={"list"}>
          New Task
        </TextInput>
        {permissions.ownerStatus == true && (
          <>
            <TextInput submit={modifyWriteAccess} maxLength={50} page={"list"}>
              Address to Grant Write Access
            </TextInput>
            <Tooltip
              text={
                "Granting someone write access will allow them to modify this list, proceed with caution."
              }
            />
          </>
        )}
      </StyledForm>
      {loading == false ? (
        tasks.length == 0 ? (
          <StyledDiv className={"contents"}>
            <span>{"Add some todos to get started!"}</span>
          </StyledDiv>
        ) : (
          <StyledDiv className={"contents"}>
            <Tabs tasks={tasks} toggle={toggle} revert={revert} />
          </StyledDiv>
        )
      ) : (
        <StyledDiv className={"loading"}>
          <Loading fullscreen={false} />
        </StyledDiv>
      )}
      {changesMade == true && (
        <Actions className={"actions"}>
          <StyledButton type={"save"} onClick={saveChanges}>
            Save Changes
          </StyledButton>
          <StyledButton type={"cancel"} onClick={cancelChanges}>
            Cancel
          </StyledButton>
        </Actions>
      )}
      {listSaved === false && (
        <StyledActions className={"actions"}>
          <StyledButton type={"save"} ignoreBlock={true} onClick={addList}>
            Save this list
          </StyledButton>
        </StyledActions>
      )}
      <StyledText className={"footer"}>
        <p className="address">Address: {listAddress}</p>
        <p className="address">
          Approximate Transaction Fee: {Number(costEstimate.eth).toFixed(6)} ETH /{" "}
          {Number(costEstimate.usd).toFixed(2)} USD
        </p>
      </StyledText>
    </StyledCard_List>
  );
}

const contentShow = keyframes({
  "0%": {opacity: 0, transform: "translate(0%, -50%) scaleY(.96)"},
  "100%": {opacity: 1, transform: "translate(0%, 0%) scaleY(1)"},
});

const Actions = styled(StyledActions, {
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});
