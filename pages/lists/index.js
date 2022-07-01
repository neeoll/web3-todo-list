import { useRouter } from "next/router";
import List from "../../components/List";
import ListContents from "../../components/ListContents";
import { useState, useEffect } from "react";
import Main from "../../artifacts/contracts/Main.sol/Main.json";
import TodoList from "../../artifacts/contracts/TodoList.sol/TodoList.json";
import { ethers } from "ethers";
import { contractAddress } from "../../config";
import TextInput from "../../components/TextInput";
import {
  StyledCard,
  StyledActions,
  StyledCardList,
  StyledButton,
  StyledForm,
  StyledText,
  StyledDiv,
} from "../../components/primitives/Primitives";
import {
  StyledTrigger,
  StyledContent,
  StyledViewport,
  StyledItem,
  StyledItemIndicator,
  StyledAlertOverlay,
  StyledAlertContent,
  StyledTitle,
  StyledDescription,
} from "../../components/primitives/Lists";
import Web3Modal from "web3modal";
import { providerOptions } from "../../providerOptions";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Toggle from "../../components/Toggle";

export default function Lists() {
  const [activeList, updateActive] = useState("");
  const [lists, updateLists] = useState([]);
  const [creatingList, toggleCreating] = useState(false);
  const [addingList, toggleAdding] = useState(false);
  const [denomination, setDenomination] = useState("Ether");
  const [isPrivate, setPrivacy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getLists = async () => {
      const web3modal = new Web3Modal({
        network: "localhost",
        cacheProvider: true,
        providerOptions,
      });
      const library = await web3modal.connectTo(
        window.localStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(library);
      const contract = new ethers.Contract(contractAddress, Main.abi, provider);
      const contractData = await contract.getLists({
        from: window.localStorage.getItem("userAddress"),
      });

      switch (contractData.length == 0) {
        case true:
          return;
        case false: {
          const _lists = [];
          for (let i = 0; i < contractData.length; i++) {
            _lists.push({ id: i, address: contractData[i] });
          }

          updateLists(_lists);
        }
      }
    };
    getLists();
  }, []);

  const contractCreate = async (e, name) => {
    e.preventDefault();
    if (typeof window.ethereum == "undefined") return;
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const contract = new ethers.Contract(contractAddress, Main.abi, signer);
    await contract.createList(
      ethers.utils.formatBytes32String(name),
      isPrivate,
      {
        from: window.localStorage.getItem("userAddress"),
      }
    );

    contract.once("Create", async (contractAddr, event) => {
      const slug = name.replace(/\s/g, "-");
      router.push(
        {
          pathname: `lists/${slug}`,
          query: { address: contractAddr },
        },
        `lists/${slug}`
      );
    });
  };

  const routeToList = async (e, _address) => {
    e.preventDefault();
    if (typeof window.ethereum == "undefined") return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(_address, TodoList.abi, provider);
    const isPrivate = await contract.getPrivacyStatus();
    const writeAccess = await contract.getWriteStatus({
      from: window.localStorage.getItem("userAddress"),
    });

    if (isPrivate == true && writeAccess == false) {
      alert("This list is private");
      return;
    }

    const title = ethers.utils.parseBytes32String(await contract.getTitle());
    const slug = title.replace(/\s/g, "-");
    router.push(
      {
        pathname: `lists/${slug}`,
        query: { address: _address },
      },
      `lists/${slug}`
    );
  };

  const changeActiveTask = (_address) => {
    updateActive(_address);
  };

  const donate = async (e, amount) => {
    try {
      const web3modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      });
      const library = await web3modal.connectTo(
        window.localStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(library);
      const accounts = await provider.listAccounts();

      if (accounts) {
        const params = [
          {
            from: window.localStorage.getItem("userAddress"),
            to: "0xca438cFfb2B65ca5ffC6EeA5319728da73000a29",
            value: ethers.utils
              .parseUnits(amount, denomination.toLowerCase())
              .toHexString(),
          },
        ];

        await provider.send("eth_sendTransaction", params);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signout = () => {
    window.localStorage.clear();
    router.push("/");
  };

  const togglePrivacy = () => {
    const privacy = !isPrivate;
    setPrivacy(privacy);
  };

  return (
    <StyledCard page={"lists"}>
      <StyledActions className={"header"}>
        <StyledButton
          type={"save"}
          onClick={() => {
            toggleCreating(true), toggleAdding(false);
          }}
        >
          Create New List
        </StyledButton>
        <StyledButton
          type={"save"}
          onClick={() => {
            toggleAdding(true), toggleCreating(false);
          }}
        >
          Add List By Address
        </StyledButton>
        {(creatingList || addingList) && (
          <StyledButton
            type={"cancel"}
            onClick={() => {
              toggleAdding(false), toggleCreating(false);
            }}
          >
            Cancel
          </StyledButton>
        )}
      </StyledActions>
      {creatingList == true && (
        <StyledForm className={"form"}>
          <TextInput submit={contractCreate} maxLength={32}>
            Name
          </TextInput>
          <Toggle toggle={togglePrivacy} />
        </StyledForm>
      )}
      {addingList == true && (
        <StyledForm className={"form"}>
          <TextInput submit={routeToList}>Address</TextInput>
        </StyledForm>
      )}
      <StyledCardList className={"lists"} type={"list"}>
        {lists.length == 0 && (
          <span>{"You don't have any lists, time to make one!"}</span>
        )}
        {lists.map((item) => (
          <li key={item.id}>
            <List address={item.address} setActive={changeActiveTask} />
          </li>
        ))}
      </StyledCardList>
      {activeList != "" && (
        <StyledCardList className={"contents"}>
          <ListContents
            address={activeList}
            activeList={activeList}
            className={"contents"}
            route={routeToList}
          />
        </StyledCardList>
      )}
      <StyledDiv className={"footer"}>
        <StyledText>Any and all donations appreciated</StyledText>
        <StyledActions>
          <TextInput submit={donate} maxLength={30}>
            Amount to Donate
          </TextInput>
          <Select.Root defaultValue="Ether" onValueChange={setDenomination}>
            <StyledTrigger>
              <Select.Value>{denomination}</Select.Value>
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </StyledTrigger>
            <StyledContent>
              <StyledViewport>
                <StyledItem value="Ether">
                  <Select.ItemText>Ether</Select.ItemText>
                  <StyledItemIndicator>
                    <CheckIcon />
                  </StyledItemIndicator>
                </StyledItem>
                <StyledItem value="Gwei">
                  <Select.ItemText>Gwei</Select.ItemText>
                  <StyledItemIndicator>
                    <CheckIcon />
                  </StyledItemIndicator>
                </StyledItem>
                <StyledItem value="Wei">
                  <Select.ItemText>Wei</Select.ItemText>
                  <StyledItemIndicator>
                    <CheckIcon />
                  </StyledItemIndicator>
                </StyledItem>
              </StyledViewport>
            </StyledContent>
          </Select.Root>
        </StyledActions>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <StyledButton type={"cancel"}>Sign out</StyledButton>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <StyledAlertOverlay />
            <StyledAlertContent>
              <StyledTitle>Are you sure you want to sign out?</StyledTitle>
              <StyledDescription>
                You will need to reauthenticate if you choose to do so.
              </StyledDescription>
              <StyledActions>
                <AlertDialog.Cancel asChild>
                  <StyledButton type={"cancel"}>Cancel</StyledButton>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <StyledButton type={"save"} onClick={signout}>
                    Confirm
                  </StyledButton>
                </AlertDialog.Action>
              </StyledActions>
            </StyledAlertContent>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </StyledDiv>
    </StyledCard>
  );
}
