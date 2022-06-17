import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import TodoList from "../../artifacts/contracts/TodoList.sol/TodoList.json";
import Task from "../../components/Task";
import TextInput from "../../components/TextInput";
import {
  StyledCard,
  StyledForm,
  StyledActions,
  StyledButton,
} from "../../Primitives";
import { violet, mauve } from "@radix-ui/colors";
import { styled } from "@stitches/react";
import * as Tabs from "@radix-ui/react-tabs";
import Web3Modal from "web3modal";
import { providerOptions } from "../../providerOptions";

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

  useEffect(() => {
    const initialContractLoad = async () => {
      const web3modal = new Web3Modal({
        network: "localhost",
        cacheProvider: true,
        providerOptions,
      });
      const library = await web3modal.connectTo(
        window.sessionStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(library);
      const contract = new ethers.Contract(data, TodoList.abi, provider);
      const contractData = await contract.getData();
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

      const hasAccess = await contract.getWriteStatus({
        from: window.sessionStorage.getItem("userAddress"),
      });
      const isOwner = await contract.getOwnershipStatus({
        from: window.sessionStorage.getItem("userAddress"),
      });
      updatePermissions({ writeAccess: hasAccess, ownerStatus: isOwner });
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
        window.sessionStorage.getItem("network")
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

  const modifyWriteAccess = async (address) => {
    if (typeof window.ethereum == "undefined") return;
    const web3modal = new Web3Modal({
      network: "localhost",
      cacheProvider: true,
      providerOptions,
    });
    const library = await web3modal.connectTo(
      window.sessionStorage.getItem("network")
    );
    const provider = new ethers.providers.Web3Provider(library);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(data, TodoList.abi, signer);
    await contract.grantWriteAccess(address, {
      from: window.sessionStorage.getItem("userAddress"),
    });
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
      window.sessionStorage.getItem("network")
    );
    const provider = new ethers.providers.Web3Provider(library);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(data, TodoList.abi, signer);
    await contract.saveChanges(changedIds, changedContents, changedStatuses, {
      from: window.sessionStorage.getItem("userAddress"),
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
    copy[index].completed = !copy[index].completed;
    copy[index].changed = false;

    if (copy[index].new == true) {
      copy.splice(index, 1);
    }

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
      window.sessionStorage.getItem("network")
    );
    const provider = new ethers.providers.Web3Provider(library);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Main.abi, signer);
    await contract.addList(data, {
      from: window.sessionStorage.getItem("userAddress"),
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
    <StyledCard writeAccess={permissions.writeAccess}>
      <StyledForm>
        <TextInput submit={addTask} maxLength={32}>
          New Task
        </TextInput>
        {permissions.ownerStatus == true && (
          <TextInput submit={modifyWriteAccess} maxLength={50}>
            Address to Grant Write Access
          </TextInput>
        )}
      </StyledForm>
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
      {changesMade == true && (
        <StyledActions>
          <StyledButton type={"save"} onClick={saveChanges}>
            Save Changes
          </StyledButton>
          <StyledButton type={"cancel"} onClick={cancelChanges}>
            Cancel
          </StyledButton>
        </StyledActions>
      )}
      {permissions.writeAccess === false && (
        <StyledActions>
          <StyledButton type={"save"} ignoreBlock={true} onClick={addList}>
            Save this list
          </StyledButton>
        </StyledActions>
      )}
      <p className="address">Address: {data}</p>
      <p className="address">Max Transaction Fee: {costEstimate} Ether</p>
    </StyledCard>
  );
}

const StyledTabs = styled(Tabs.Root, {
  display: "flex",
  flexDirection: "column",
  width: "auto",
  marginBottom: 10,
});

const StyledList = styled(Tabs.List, {
  flexShrink: 0,
  display: "flex",
  borderBottom: `1px solid #393939`,
});

const StyledTrigger = styled(Tabs.Trigger, {
  all: "unset",
  fontFamily: "inherit",
  backgroundColor: "#191919",
  padding: "0 20px",
  height: 45,
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 15,
  lineHeight: 1,
  color: mauve.mauve11,
  userSelect: "none",
  "&:first-child": { borderTopLeftRadius: 6 },
  "&:last-child": { borderTopRightRadius: 6 },
  "&:hover": { color: violet.violet11 },
  variants: {
    id: {
      all: {
        "&:hover": { color: violet.violet11 },
        '&[data-state="active"]': {
          color: violet.violet11,
          boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
        },
      },
      active: {
        "&:hover": { color: "#F71919" },
        '&[data-state="active"]': {
          color: "#F71919",
          boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
        },
      },
      completed: {
        "&:hover": { color: "#0075FF" },
        '&[data-state="active"]': {
          color: "#0075FF",
          boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
        },
      },
    },
  },
});

const StyledTabsContent = styled(Tabs.Content, {
  listStyle: "none",
  flexGrow: 1,
  padding: 20,
  backgroundColor: "#191919",
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  outline: "none",
});
