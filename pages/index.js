import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { providerOptions } from "../providerOptions";
import * as Dialog from "@radix-ui/react-dialog";
import { StyledCard, StyledButton, StyledActions } from "../Primitives";
import DialogModal from "../components/DialogModal";
import { styled } from "@stitches/react";

export default function Home() {
  const router = useRouter();

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
        window.sessionStorage.setItem("userAddress", accounts[0]);
        window.sessionStorage.setItem("network", _network);
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
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <StyledButton type={"save"}>Connect Wallet</StyledButton>
        </Dialog.Trigger>
        <Dialog.Portal>
          <StyledOverlay>
            <StyledDialogContent>
              <DialogModal select={connectWalletHandler} />
              <Dialog.Close asChild>
                <StyledActions>
                  <StyledButton type={"cancel"}>Close</StyledButton>
                </StyledActions>
              </Dialog.Close>
            </StyledDialogContent>
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
      <span>*Switch to Goerli Testnet before proceeding*</span>
    </StyledCard>
  );
}

const StyledOverlay = styled(Dialog.Overlay, {
  background: "rgba(0 0 0 / 0.5)",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "grid",
  placeItems: "center",
  overflowY: "auto",
});

const StyledDialogContent = styled(Dialog.Content, {
  minWidth: 300,
  background: "#191919",
  color: "#fff",
  padding: 30,
  borderRadius: 4,
});
