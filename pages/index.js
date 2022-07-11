import {useEffect} from "react";
import {useRouter} from "next/router";
import {
  StyledCard,
  StyledButton,
  StyledActions,
  StyledText,
} from "../components/Primitives";
import Dialog from "../components/Dialog";
import {connectToNetwork, getProvider} from "../utils";
import { styled } from '@stitches/react'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkConnected = async () => {
      if (window.localStorage.getItem("userAddress") != null) {
        const connection = await connectToNetwork(
          window.localStorage.getItem("network")
        );
        const provider = await getProvider(connection);
        const accounts = await provider.listAccounts();

        if (accounts) {
          router.push("/lists");
        }
      } else {
        return;
      }
    };

    checkConnected();
  }, []);

  const connectWalletHandler = async (_network) => {
    try {
      const connection = await connectToNetwork(_network);
      const provider = await getProvider(connection);
      const accounts = await provider.listAccounts();

      if (accounts) {
        window.localStorage.setItem("userAddress", accounts[0]);
        window.localStorage.setItem("network", _network);
        router.push(
          {
            pathname: "/lists",
            query: {address: accounts[0]},
          },
          "/lists"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return( 
    <>
      <Title>{"Tudu"}</Title>
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

const Title = styled('div', {
  display: 'flex',
  color: '#fff',
  textAlign: 'center',
  fontSize: 36,
  fontFamily: `'PT Sans Narrow', sans-serif`
})
