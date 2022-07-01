import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoList from "../artifacts/contracts/TodoList.sol/TodoList.json";
import Web3Modal from "web3modal";
import { providerOptions } from "../providerOptions";
import { StyledButton, StyledCardItem, StyledText } from "./primitives/Primitives";
import { Pencil2Icon, LockClosedIcon } from "@radix-ui/react-icons";

const List = (props) => {
  const [listTitle, setTitle] = useState();
  const [privacy, setPrivacy] = useState();

  useEffect(() => {
    const getData = async () => {
      const web3modal = new Web3Modal({
        network: "localhost",
        cacheProvider: true,
        providerOptions,
      });
      const connection = await web3modal.connectTo(
        window.localStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(connection);
      const contract = new ethers.Contract(
        props.address,
        TodoList.abi,
        provider
      );
      const title = ethers.utils.parseBytes32String(await contract.getTitle());
      const isPrivate = await contract.getPrivacyStatus();

      setTitle(title);
      setPrivacy(isPrivate);
    };
    getData();
  }, [props]);

  const setActive = () => {
    props.setActive(props.address);
  };

  return (
    <StyledCardItem type={"list"} onClick={setActive}>
      {privacy == true && <LockClosedIcon width={20} height={20} />}
      <StyledText>{listTitle}</StyledText>
    </StyledCardItem>
  );
};

export default List;
