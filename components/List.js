import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoList from "../artifacts/contracts/TodoList.sol/TodoList.json";
import Web3Modal from "web3modal";
import { providerOptions } from "../providerOptions";
import { StyledButton, StyledCardItem } from "../Primitives";

const List = (props) => {
  const [listTitle, setTitle] = useState();

  useEffect(() => {
    const getData = async () => {
      const web3modal = new Web3Modal({
        network: "localhost",
        cacheProvider: true,
        providerOptions,
      });
      const connection = await web3modal.connectTo(
        window.sessionStorage.getItem("network")
      );
      const provider = new ethers.providers.Web3Provider(connection);
      const contract = new ethers.Contract(
        props.address,
        TodoList.abi,
        provider
      );
      const title = ethers.utils.parseBytes32String(await contract.getTitle());

      setTitle(title);
    };
    getData();
  }, [props]);

  const route = () => {
    props.route(listTitle, props.address);
  };

  const setActive = () => {
    props.setActive(props.address);
  };

  return (
    <StyledCardItem type={"list"} onClick={setActive}>
      <a className="nav-link" onClick={route}>
        {listTitle}
      </a>
    </StyledCardItem>
  );
};

export default List;
