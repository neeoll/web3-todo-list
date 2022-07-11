import {useEffect, useState} from "react";
import TodoList from "../artifacts/contracts/TodoList.sol/TodoList.json";
import {StyledButton, StyledCardItem} from "./Primitives";
import {Pencil2Icon} from "@radix-ui/react-icons";
import {styled, keyframes} from "@stitches/react";
import {
  connectToNetwork,
  getProvider,
  getContract,
  parseBytes32String,
} from "../utils";

const ListContents = (props) => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const connection = await connectToNetwork(
        window.localStorage.getItem("network")
      );
      const provider = await getProvider(connection);
      const contract = await getContract(props.address, TodoList.abi, provider);
      const data = await contract.getData();
      const tasks = [];

      for (let i = 0; i < data[0].length; i++) {
        if (data[1][i] == true) continue;
        tasks.push({
          id: i,
          contents: await parseBytes32String(data[0][i]),
          completed: data[1][i],
        });
      }

      setListData(tasks);
      setLoading(false);
    };
    getData();
  }, [props]);

  const route = (e) => {
    props.route(e, props.address);
  };

  return (
    <Card type={"listContent"}>
      <Header>
        <IconButton type={"icon"} onClick={route}>
          <Pencil2Icon width={20} height={20} />
        </IconButton>
      </Header>
      {listData.length == 0
        ? "No active tasks"
        : listData.map((item) => (
            <li key={item.id}>
              <p>{item.contents}</p>
            </li>
          ))}
    </Card>
  );
};

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(0%, -50%) scaleY(.96)" },
  "100%": { opacity: 1, transform: "translate(0%, 0%) scaleY(1)" },
});

const Card = styled(StyledCardItem, {
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const Header = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
});

const IconButton = styled(StyledButton, {});

export default ListContents;
