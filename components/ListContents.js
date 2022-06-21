import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TodoList from "../artifacts/contracts/TodoList.sol/TodoList.json";
import Web3Modal from "web3modal";
import { providerOptions } from "../providerOptions";
import { StyledCardItem } from "../Primitives";

const ListContents = (props) => {
  const [listData, setListData] = useState([]);

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
      const data = await contract.getData();
      const tasks = [];

      for (let i = 0; i < data[0].length; i++) {
        if (data[1][i] == true) continue;
        tasks.push({
          id: i,
          contents: ethers.utils.parseBytes32String(data[0][i]),
          completed: data[1][i],
        });
      }

      if (tasks.length > 2) {
        tasks = tasks.splice(1);
        tasks.push({
          id: 100,
          contents: "...",
          completed: false,
        });
      }

      setListData(tasks);
    };
    getData();
  }, [props]);

  return (
    <StyledCardItem>
      {listData.length == 0
        ? "No active tasks"
        : listData.map((item) => (
            <li key={item.id}>
              <p>{item.contents}</p>
            </li>
          ))}
    </StyledCardItem>
  );
};

export default ListContents;
