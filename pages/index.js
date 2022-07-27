import {useEffect} from "react";
import {useRouter} from "next/router";
import {
  StyledCard,
  StyledButton,
  StyledActions,
  StyledText,
} from "../components/Primitives";
import Dialog from "../components/Dialog";
import {styled} from "@stitches/react";
import * as Realm from "realm-web";
import * as Utils from "../utils"

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkConnected = async () => {
      if (window.localStorage.getItem("userAddress") != null) {
        const connection = await Utils.connectToNetwork(
          window.localStorage.getItem("network")
        );
        const provider = await Utils.getProvider(connection);
        const accounts = await provider.listAccounts();

        if (accounts) router.push("/lists");
      } else {
        return;
      }
    };

    checkConnected();
  }, []);

  const connectWalletHandler = async (_network) => {
    const connection = await Utils.connectToNetwork(_network);
    const provider = await Utils.getProvider(connection);
    const accounts = await provider.listAccounts();

    if (!accounts) return;

    const app = new Realm.App({id: "application-0-heuqo"});
    const credentials = Realm.Credentials.anonymous();
    await app.logIn(credentials);

    const client = app.currentUser.mongoClient("mongodb-atlas");
    const users = client.db(_network).collection("users");
    const userExists = (await users.findOne({address: accounts[0]})) != null;

    if (userExists != true) {
      const doc = {address: accounts[0], contracts: []};
      const result = await users.insertOne(doc);
    }

    window.localStorage.setItem("userAddress", accounts[0]);
    window.localStorage.setItem("network", _network);
    router.push(
      {
        pathname: "/lists",
        query: {address: accounts[0]},
      },
      "/lists"
    );
  };

  return (
    <>
      <Title>Tudu</Title>
      <Title subtitle={true}>A Web3 Task Tracker</Title>
      <StyledCard page={"connect"}>
        <StyledActions className={"header"}>
          <Dialog onSelect={connectWalletHandler} />
          <StyledButton
            type={"save"}
            onClick={() => {
              router.push("https://github.com/neeoll/web3-todo-list");
            }}>
            Repository
          </StyledButton>
        </StyledActions>
        <StyledText className={"contents"}>
          *Switch to Goerli Testnet before proceeding*
        </StyledText>
      </StyledCard>
    </>
  );
}

const Title = styled("div", {
  display: "flex",
  color: "#fff",
  textAlign: "center",
  fontSize: 36,
  fontFamily: `'PT Sans Narrow', sans-serif`,
  variants: {
    subtitle: {
      true: {
        fontSize: 24,
      },
    },
  },
});
