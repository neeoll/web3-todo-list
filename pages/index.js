import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { providerOptions } from "../providerOptions";
import * as Dialog from "@radix-ui/react-dialog";
import {
  StyledCard,
  StyledButton,
  StyledActions,
  StyledText
} from "../components/primitives/Primitives";
import { StyledOverlay, StyledContent, IconButton } from '../components/primitives/Home'
import DialogModal from "../components/DialogModal";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkConnected = async () => {
      if (window.localStorage.getItem('userAddress') != null) {
        console.log(window.localStorage.getItem('userAddress'))
        console.log(window.localStorage.getItem('network'))
        const web3modal = new Web3Modal({
          cacheProvider: true,
          providerOptions,
        });
        const library = await web3modal.connectTo(window.localStorage.getItem('network'));
        const provider = new ethers.providers.Web3Provider(library);
        const accounts = await provider.listAccounts();

        if (accounts) {
          router.push(
            {
              pathname: "/lists",
              query: { address: accounts[0] },
            },
            "/lists"
          );
        }
      } else {
        return
      }
    }

    checkConnected()
  }, [])

  const connectWalletHandler = async (_network) => {
    try {
      const web3modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      });
      const library = await web3modal.connectTo(_network);
      const provider = new ethers.providers.Web3Provider(library);
      const accounts = await provider.listAccounts();

      if (accounts) {
        window.localStorage.setItem("userAddress", accounts[0]);
        window.localStorage.setItem("network", _network);
        router.push(
          {
            pathname: "/lists",
            query: { address: accounts[0] },
          },
          "/lists"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledCard page={"connect"}>
      <StyledActions className={"header"}>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <StyledButton type={"save"}>Connect Wallet</StyledButton>
          </Dialog.Trigger>
          <Dialog.Portal>
            <StyledOverlay>
              <StyledContent>
                <DialogModal select={connectWalletHandler} />
                <Dialog.Close asChild>
                  <StyledActions>
                    <IconButton type={"icon"}>
                      <Cross2Icon height={20} width={20} />
                    </IconButton>
                  </StyledActions>
                </Dialog.Close>
              </StyledContent>
            </StyledOverlay>
          </Dialog.Portal>
        </Dialog.Root>
        <StyledButton
          type={"save"}
          onClick={() => {
            router.push("https://github.com/neeoll/web3-todo-list");
          }}
        >
          Repository
        </StyledButton>
      </StyledActions>
      <StyledText className={"contents"}>
        *Switch to Goerli Testnet before proceeding*
      </StyledText>
    </StyledCard>
  );
}
