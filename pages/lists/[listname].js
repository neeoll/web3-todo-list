import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import Main from "../../artifacts/contracts/Main.sol/Main.json";
import TodoList from "../../artifacts/contracts/TodoList.sol/TodoList.json";
import Task from "../../components/Task";
import TextInput from "../../components/TextInput";
import Tooltip from "../../components/Tooltip";
import {
  StyledCard,
  StyledForm,
  StyledActions,
  StyledButton,
  StyledDiv,
  StyledText,
} from "../../components/primitives/Primitives";
import { StyledTabs, StyledList, StyledTrigger, StyledTabsContent } from "../../components/primitives/List";
import Web3Modal from "web3modal";
import { providerOptions } from "../../providerOptions";
import { contractAddress } from "../../config";

export function getServerSideProps(context) {
  return {
    props: {
      data: context.query.address,
    },
  };
}

export default function Todo({ data }) {
  const [tasks, updateTasks] = useState([]);
  const [permissions, updatePermissions] = useState({});
  const [changesMade, toggleChangesMade] = useState(false);
  const [costEstimate, updateEstimate] = useState();
  const [listSaved, setSaved] = useState();

  useEffect(() => {
    const initialContractLoad = async () => {
      window.sessionStorage.setItem('contractAddress', data)
      const web3modal = new Web3Modal({
        network: "localhost",
        cacheProvider: true,
        providerOptions,
      });
      const library = await web3modal.connectTo(
        window.localStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(library);
      const listContract = new ethers.Contract(data, TodoList.abi, provider);
      const contractData = await listContract.getData();
      const _tasks = [];

      for (let i = 0; i < contractData[0].length; i++) {
        _tasks.push({
          id: i,
          content: ethers.utils.parseBytes32String(contractData[0][i]),
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
      updatePermissions({ writeAccess: hasAccess, ownerStatus: isOwner });

      const mainContract = new ethers.Contract(
        contractAddress,
        Main.abi,
        provider
      );
      const saved = await mainContract.hasListSaved(data, {
        from: window.localStorage.getItem("userAddress"),
      });

      setSaved(saved);
    };
    initialContractLoad();
  }, [data]);

  useEffect(() => {
    const estimateGas = async () => {
      const web3modal = new Web3Modal({
        network: "localhost",
        cacheProvider: true,
        providerOptions,
      });
      const library = await web3modal.connectTo(
        window.localStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(library);
      const feeData = await provider.getFeeData();
      const costEstimate = feeData.maxFeePerGas * 204838;
      const cost = utils.formatUnits(costEstimate, "ether");

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
    console.log(address);
    if (typeof window.ethereum == "undefined") return;
    try {
      const web3modal = new Web3Modal({
        network: "localhost",
        cacheProvider: true,
        providerOptions,
      });
      const library = await web3modal.connectTo(
        window.localStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(library);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(data, TodoList.abi, signer);
      await contract.grantWriteAccess(address, {
        from: window.localStorage.getItem("userAddress"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const saveChanges = async () => {
    if (typeof window.ethereum == "undefined") return;
    const changedIds = [];
    const changedContents = [];
    const changedStatuses = [];

    tasks.forEach((item) => {
      if (item.changed == true) {
        changedIds.push(item.id);
        changedContents.push(ethers.utils.formatBytes32String(item.content));
        changedStatuses.push(item.completed);
      }
    });

    const web3modal = new Web3Modal({
      network: "localhost",
      cacheProvider: true,
      providerOptions,
    });
    const library = await web3modal.connectTo(
      window.localStorage.getItem("network")
    );
    const provider = new ethers.providers.Web3Provider(library);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(data, TodoList.abi, signer);
    await contract.saveChanges(changedIds, changedContents, changedStatuses, {
      from: window.localStorage.getItem("userAddress"),
    });

    contract.once("ChangesSaved", async (event) => {
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
    if (typeof window.ethereum == "undefined") return;
    const web3modal = new Web3Modal({
      network: "localhost",
      cacheProvider: true,
      providerOptions,
    });
    const library = await web3modal.connectTo(
      window.localStorage.getItem("network")
    );
    const provider = new ethers.providers.Web3Provider(library);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Main.abi, signer);
    await contract.addList(data, {
      from: window.localStorage.getItem("userAddress"),
    });

    contract.once("Add", async (event) => {
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
    <StyledCard writeAccess={permissions.writeAccess} page={"list"}>
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
      <StyledDiv className={"contents"}>
        <StyledTabs defaultValue="all">
          <StyledList>
            <StyledTrigger value="all" id={"all"}>
              All
            </StyledTrigger>
            <StyledTrigger value="active" id={"active"}>
              Active
            </StyledTrigger>
            <StyledTrigger value="completed" id={"completed"}>
              Completed
            </StyledTrigger>
          </StyledList>
          <StyledTabsContent value="all">
            {tasks.map((item) => (
              <li key={item.id}>
                <Task data={item} toggle={toggle} revert={revert} />
              </li>
            ))}
          </StyledTabsContent>
          <StyledTabsContent value="active">
            {tasks
              .filter((item) => item.completed == false)
              .map((item) => (
                <li key={item.id}>
                  <Task data={item} toggle={toggle} revert={revert} />
                </li>
              ))}
          </StyledTabsContent>
          <StyledTabsContent value="completed">
            {tasks
              .filter((item) => item.completed == true)
              .map((item) => (
                <li key={item.id}>
                  <Task data={item} toggle={toggle} revert={revert} />
                </li>
              ))}
          </StyledTabsContent>
        </StyledTabs>
      </StyledDiv>
      {changesMade == true && (
        <StyledActions className={"actions"}>
          <StyledButton type={"save"} onClick={saveChanges}>
            Save Changes
          </StyledButton>
          <StyledButton type={"cancel"} onClick={cancelChanges}>
            Cancel
          </StyledButton>
        </StyledActions>
      )}
      {listSaved === false && (
        <StyledActions className={"actions"}>
          <StyledButton type={"save"} ignoreBlock={true} onClick={addList}>
            Save this list
          </StyledButton>
        </StyledActions>
      )}
      <StyledText className={"footer"}>
        <p className="address">Address: {data}</p>
        <p className="address">Max Transaction Fee: {costEstimate} Ether</p>
      </StyledText>
    </StyledCard>
  );
}
