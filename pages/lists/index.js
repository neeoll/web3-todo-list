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
} from "../../Primitives";
import Web3Modal from "web3modal";
import { providerOptions } from "../../providerOptions";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import { slateDark } from "@radix-ui/colors";
import * as Select from "@radix-ui/react-select";
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
        window.sessionStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(library);
      const contract = new ethers.Contract(contractAddress, Main.abi, provider);
      const contractData = await contract.getLists({
        from: window.sessionStorage.getItem("userAddress"),
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
        from: window.sessionStorage.getItem("userAddress"),
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
      from: window.sessionStorage.getItem("userAddress"),
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
        window.sessionStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(library);
      const accounts = await provider.listAccounts();

      if (accounts) {
        const params = [
          {
            from: window.sessionStorage.getItem("userAddress"),
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
      </StyledDiv>
    </StyledCard>
  );
}

const StyledTrigger = styled(Select.Trigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 5,
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 10,
  paddingBottom: 10,
  gap: 5,
  height: "fit-content",
  backgroundColor: slateDark.slate2,
  color: "#fff",
  "&:hover": { backgroundColor: slateDark.slate1 },
});

const StyledContent = styled(Select.Content, {
  overflow: "hidden",
  backgroundColor: slateDark.slate1,
  borderRadius: 5,
});

const StyledViewport = styled(Select.Viewport, {
  padding: 5,
});

const StyledItem = styled(Select.Item, {
  all: "unset",
  color: "#fff",
  borderRadius: 5,
  display: "flex",
  alignItems: "center",
  height: "auto",
  paddingLeft: 30,
  paddingRight: 30,
  position: "relative",
  userSelect: "none",

  "&:focus": {
    backgroundColor: slateDark.slate2,
    color: "#fff",
  },
});

const StyledItemIndicator = styled(Select.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});
