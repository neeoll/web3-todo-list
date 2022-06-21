import { useRouter } from "next/router";
import List from "../../components/List";
import ListContents from "../../components/ListContents";
import TextInput from "../../components/TextInput";
import { useState, useEffect } from "react";
import Main from "../../artifacts/contracts/Main.sol/Main.json";
import TodoList from "../../artifacts/contracts/TodoList.sol/TodoList.json";
import { ethers } from "ethers";
import { contractAddress } from "../../config";
import {
  StyledCard,
  StyledActions,
  StyledCardList,
  StyledButton,
  StyledForm,
} from "../../Primitives";
import Web3Modal from "web3modal";
import { providerOptions } from "../../providerOptions";

export default function Lists() {
  const [activeList, updateActive] = useState("");
  const [lists, updateLists] = useState([]);
  const [creatingList, toggleCreating] = useState(false);
  const [addingList, toggleAdding] = useState(false);
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

  const listRoute = (listName, listAddr) => {
    const slug = listName.replace(/\s/g, "-");
    router.push(
      {
        pathname: `lists/${slug}`,
        query: { address: listAddr },
      },
      `lists/${slug}`
    );
  };

  const contractCreate = async (e, name) => {
    e.preventDefault();
    if (typeof window.ethereum == "undefined") return;
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const contract = new ethers.Contract(contractAddress, Main.abi, signer);
    await contract.createList(ethers.utils.formatBytes32String(name), {
      from: window.sessionStorage.getItem("userAddress"),
    });

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
    const title = await contract.getTitle();
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
        </StyledForm>
      )}
      {addingList == true && (
        <StyledForm className={"form"}>
          <TextInput submit={routeToList}>Address</TextInput>
        </StyledForm>
      )}
      {lists.length == 0 ? (
        "You don't have any lists, time to make one!"
      ) : (
        <>
          <StyledCardList className={"lists"}>
            {lists.length == 0 && (
              <h4>{"You don't have any lists, time to make one!"}</h4>
            )}
            {lists.map((item) => (
              <li key={item.id}>
                <List
                  address={item.address}
                  route={listRoute}
                  setActive={changeActiveTask}
                />
              </li>
            ))}
          </StyledCardList>
          {activeList == "" ? null : (
            <StyledCardList className={"contents"}>
              <ListContents address={activeList} />
            </StyledCardList>
          )}
        </>
      )}
    </StyledCard>
  );
}
