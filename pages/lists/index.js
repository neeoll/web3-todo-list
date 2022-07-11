import {useRouter} from "next/router";
import {useState, useEffect} from "react";
import {contractAddress} from "../../config";
import {
  StyledCard_Lists,
  StyledActions,
  StyledCardList,
  StyledButton,
  StyledForm,
  StyledText,
  StyledDiv,
  LoadingPlaceholder,
} from "../../components/Primitives";
import {
  connectToNetwork,
  getProvider,
  getContract,
  parseBytes32String,
  formatBytes32String,
} from "../../utils";
import List from "../../components/List";
import ListContents from "../../components/ListContents";
import Main from "../../artifacts/contracts/Main.sol/Main.json";
import TodoList from "../../artifacts/contracts/TodoList.sol/TodoList.json";
import TextInput from "../../components/TextInput";
import Toggle from "../../components/Toggle";
import AlertDialog from "../../components/AlertDialog";
import Loading from "../../components/Loading";
import { styled, keyframes } from "@stitches/react";

export default function Lists() {
  const [lists, updateLists] = useState([]);
  const [activeList, updateActive] = useState("");
  const [creatingList, toggleCreating] = useState(false);
  const [addingList, toggleAdding] = useState(false);
  const [isPrivate, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingTransaction, setProcessing] = useState(false);

  const [network, setNetwork] = useState();
  const [userAddress, setAddress] = useState();

  const router = useRouter();

  useEffect(() => {
    const getLists = async () => {
      const connection = await connectToNetwork(
        window.localStorage.getItem("network")
      );
      const provider = await getProvider(connection);
      const contract = await getContract(contractAddress, Main.abi, provider);
      const contractData = await contract.getLists({
        from: window.localStorage.getItem("userAddress"),
      });

      switch (contractData.length == 0) {
        case true:
          setLoading(false);
          return;
        case false: {
          const _lists = [];
          for (let i = 0; i < contractData.length; i++) {
            _lists.push({id: i, address: contractData[i]});
          }

          updateLists(_lists);
        }
      }

      setNetwork(window.localStorage.getItem("network"));
      setAddress(window.localStorage.getItem("userAddress"));
      setLoading(false);
    };
    getLists();
  }, []);

  const contractCreate = async (e, name) => {
    e.preventDefault();
    const connection = await connectToNetwork(
      window.localStorage.getItem("network")
    );
    const signer = (await getProvider(connection)).getSigner();
    const contract = await getContract(contractAddress, Main.abi, signer);

    await contract.createList(formatBytes32String(name), isPrivate, {
      from: userAddress,
    });

    setProcessing(true);

    contract.once("Create", async (contractAddr, event) => {
      setProcessing(false);
      window.localStorage.setItem("contractAddress", contractAddr);
      const slug = name.replace(/\s/g, "-");
      router.push(`lists/${slug}`);
    });
  };

  const routeToList = async (e, _address) => {
    e.preventDefault();
    const connection = await connectToNetwork(network);
    const provider = await getProvider(connection);
    const contract = await getContract(_address, TodoList.abi, provider);

    const isPrivate = await contract.getPrivacyStatus();
    const writeAccess = await contract.getWriteStatus({
      from: userAddress,
    });

    if (isPrivate == true && writeAccess == false) {
      alert("This list is private");
      return;
    }

    window.localStorage.setItem("contractAddress", _address);
    const title = await parseBytes32String(await contract.getTitle());
    const slug = title.replace(/\s/g, "-");
    router.push(`lists/${slug}`);
  };

  const changeActiveList = (_address) => {
    if (_address == activeList) { 
      updateActive("") 
    } else {
      updateActive(_address);
    }
  };

  const donate = async (e, amount) => {
    try {
      const connection = await connectToNetwork(network);
      const provider = await getProvider(connection);
      const accounts = await provider.listAccounts();

      if (accounts) {
        const ethers = await import("ethers");
        const params = [
          {
            from: userAddress,
            to: "0xca438cFfb2B65ca5ffC6EeA5319728da73000a29",
            value: ethers.utils.parseUnits(amount, "ether").toHexString(),
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
    <StyledCard_Lists loading={loading}>
      {processingTransaction == true && <Loading />}
      <StyledActions className={"header"}>
        <StyledButton
          type={"save"}
          onClick={() => {
            toggleCreating(true), toggleAdding(false);
          }}>
          Create New List
        </StyledButton>
        <StyledButton
          type={"save"}
          onClick={() => {
            toggleAdding(true), toggleCreating(false);
          }}>
          Add List By Address
        </StyledButton>
        {(creatingList || addingList) && (
          <Button
            type={"cancel"}
            onClick={() => {
              toggleAdding(false), toggleCreating(false);
            }}>
            Cancel
          </Button>
        )}
      </StyledActions>
      {creatingList == true && (
        <Form className={"form"}>
          <TextInput submit={contractCreate} maxLength={32}>
            Name
          </TextInput>
          <Toggle toggle={togglePrivacy} />
        </Form>
      )}
      {addingList == true && (
        <Form className={"form"}>
          <TextInput submit={routeToList}>Address</TextInput>
        </Form>
      )}
      {loading == false ? (
        lists.length == 0 ? (
          <StyledCardList className={"lists"} type={"list"}>
            {lists.length == 0 && (
              <span>{"You don't have any lists, time to make one!"}</span>
            )}
          </StyledCardList>
        ) : (
          <>
            <CardList className={"lists"} type={"list"}>
              {lists.map((item) => (
                <li key={item.id}>
                  <List address={item.address} setActive={changeActiveList} />
                </li>
              ))}
            </CardList>
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
          </>
        )
      ) : (
        <StyledDiv className={"loading"}>
          <LoadingPlaceholder />
        </StyledDiv>
      )}
      <StyledDiv className={"footer"}>
        <StyledText>Any and all donations appreciated</StyledText>
        <TextInput submit={donate} maxLength={30} page={"list"}>
          Amount (In Ether)
        </TextInput>
        <AlertDialog
          title={"Are you sure you want to sign out?"}
          description={
            "You will need to reauthenticate if you choose to do so."
          }
          confirm={signout}
        />
      </StyledDiv>
    </StyledCard_Lists>
  );
}

const listsShow = keyframes({
  "0%": { opacity: 0, transform: "translate(0%, -50%) scaleY(.96)" },
  "100%": { opacity: 1, transform: "translate(0%, 0%) scaleY(1)" },
});

const CardList = styled(StyledCardList, {
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${listsShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const formShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, 0%) scaleX(.96)" },
  "100%": { opacity: 1, transform: "translate(0%, 0%) scaleX(1)" },
});

const Button = styled(StyledButton, {
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${formShow} 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const Form = styled(StyledForm, {
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${formShow} 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})
