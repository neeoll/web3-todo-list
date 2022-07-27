import { useEffect, useState } from "react";
import TodoList from "../artifacts/contracts/TodoList.sol/TodoList.json";
import { StyledCardItem, StyledText } from "./Primitives";
import { LockClosedIcon } from "@radix-ui/react-icons";
import * as Utils from "../utils"

const List = (props) => {
  const [listTitle, setTitle] = useState();
  const [privacy, setPrivacy] = useState();

  useEffect(() => {
    const getData = async () => {
      const connection = await Utils.connectToNetwork(
        window.localStorage.getItem("network")
      );
      const provider = await Utils.getProvider(connection)
      const contract = await Utils.getContract(
        props.address,
        TodoList.abi,
        provider
      );
      const title = await Utils.parseBytes32String(await contract.getTitle());
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
