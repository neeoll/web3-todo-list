import {useState, useEffect} from "react";
import {
  StyledCard_List,
  StyledForm,
  StyledActions,
  StyledButton,
  StyledDiv,
  StyledText,
  LoadingPlaceholder,
} from "../../components/Primitives";
import {contractAddress} from "../../config";
import Main from "../../artifacts/contracts/Main.sol/Main.json";
import TodoList from "../../artifacts/contracts/TodoList.sol/TodoList.json";
import TextInput from "../../components/TextInput";
import Tooltip from "../../components/Tooltip";
import Tabs from "../../components/Tabs";
import {
  connectToNetwork,
  getProvider,
  getContract,
  parseBytes32String,
  formatBytes32String,
  formatUnits,
} from "../../utils";
import Loading from "../../components/Loading";
import { keyframes, styled } from "@stitches/react";

export default function Todo() {
  const [tasks, updateTasks] = useState([]);
  const [permissions, updatePermissions] = useState({});
  const [changesMade, toggleChangesMade] = useState(false);
  const [costEstimate, updateEstimate] = useState();
  const [listSaved, setSaved] = useState();
  const [loading, setLoading] = useState(true);
  const [processingTransaction, setProcessing] = useState(false);

  const [listAddress, setListAddress] = useState();
  const [network, setNetwork] = useState();
  const [userAddress, setUserAddress] = useState();

  useEffect(() => {
    const initialContractLoad = async () => {
      const connection = await connectToNetwork(
        window.localStorage.getItem("network")
      );
      const provider = await getProvider(connection);
      const listContract = await getContract(
        window.localStorage.getItem("contractAddress"),
        TodoList.abi,
        provider
      );
      const contractData = await listContract.getData();
      const _tasks = [];

      for (let i = 0; i < contractData[0].length; i++) {
        _tasks.push({
          id: i,
          content: await parseBytes32String(contractData[0][i]),
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

      const mainContract = await getContract(
        contractAddress,
        Main.abi,
        provider
      );
      const saved = await mainContract.hasListSaved(
        window.localStorage.getItem("contractAddress"),
        {
          from: window.localStorage.getItem("userAddress"),
        }
      );

      setListAddress(window.localStorage.getItem("contractAddress"));
      setNetwork(window.localStorage.getItem("network"));
      setUserAddress(window.localStorage.getItem("userAddress"));
      setSaved(saved);
      setLoading(false);
    };
    initialContractLoad();
  }, []);

  useEffect(() => {
    const estimateGas = async () => {
      const connection = await connectToNetwork(
        window.localStorage.getItem("network")
      );
      const provider = await getProvider(connection);
      const feeData = await provider.getFeeData();
      const costEstimate = feeData.maxFeePerGas * 204838;
      const cost = await formatUnits(costEstimate, "ether");

      updateEstimate(cost);
    };
    estimateGas();
  }, []);

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
    try {
      const connection = await connectToNetwork(
        window.localStorage.getItem("network")
      );
      const signer = (await getProvider(connection)).getSigner();
      const contract = await getContract(listAddress, TodoList.abi, signer);
      await contract.grantWriteAccess(address, {
        from: userAddress,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const saveChanges = async () => {
    const changedIds = [];
    const changedContents = [];
    const changedStatuses = [];

    tasks.forEach((item) => {
      if (item.changed == true) {
        changedIds.push(item.id);
        changedContents.push(formatBytes32String(item.content));
        changedStatuses.push(item.completed);
      }
    });

    const connection = await connectToNetwork(
      window.localStorage.getItem("network")
    );
    const signer = (await getProvider(connection)).getSigner();
    const contract = await getContract(listAddress, TodoList.abi, signer);
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
    const connection = await connectToNetwork(
      window.localStorage.getItem("network")
    );
    const signer = (await getProvider(connection)).getSigner();
    const contract = new ethers.Contract(contractAddress, Main.abi, signer);
    await contract.addList(listAddress, {
      from: userAddress,
    });

    setProcessing(true);

    contract.once("Add", async (event) => {
      setProcessing(false);
      window.location.reload();
    });
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
      {processingTransaction == true && (
        <Loading />
      )}
      <StyledForm className={"form"}>
        <TextInput submit={addTask} maxLength={32} page={"list"}>
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
          <LoadingPlaceholder />
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
        <p className="address">Max Transaction Fee: {costEstimate} Ether</p>
      </StyledText>
    </StyledCard_List>
  );
}

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(0%, -50%) scaleY(.96)" },
  "100%": { opacity: 1, transform: "translate(0%, 0%) scaleY(1)" },
});

const Actions = styled(StyledActions, {
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})
