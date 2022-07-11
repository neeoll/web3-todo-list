import * as DialogPrimitive from "@radix-ui/react-dialog";
import Metamask from "../public/metamask.svg";
import WalletConnect from "../public/walletconnect.svg";
import Coinbase from "../public/coinbase.svg";
import { gray } from "@radix-ui/colors";
import { StyledButton } from "./Primitives";
import { styled, keyframes } from "@stitches/react";
import { Cross2Icon } from "@radix-ui/react-icons";

const Dialog = ({ onSelect }) => {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <StyledButton type={"save"}>Connect Wallet</StyledButton>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <StyledOverlay>
          <StyledContent>
            <StyledHeader>Choose a Provider</StyledHeader>
            <StyledGrid>
              <StyledGridItem
                position={"one"}
                onClick={() => {
                  onSelect("injected");
                }}
              >
                <StyledGridContents icon={true}>
                  <Metamask />
                </StyledGridContents>
                <StyledGridContents icon={false}>
                  Connect with Metamask
                </StyledGridContents>
              </StyledGridItem>
              <StyledGridItem
                position={"two"}
                onClick={() => {
                  onSelect("walletconnect");
                }}
              >
                <StyledGridContents icon={true}>
                  <WalletConnect />
                </StyledGridContents>
                <StyledGridContents icon={false}>
                  Connect with WalletConnect
                </StyledGridContents>
              </StyledGridItem>
              <StyledGridItem
                position={"three"}
                onClick={() => {
                  onSelect("coinbasewallet");
                }}
              >
                <StyledGridContents icon={true}>
                  <Coinbase />
                </StyledGridContents>
                <StyledGridContents icon={false}>
                  Connect with Coinbase
                </StyledGridContents>
              </StyledGridItem>
            </StyledGrid>
            <DialogPrimitive.Close asChild>
              <IconButton type={"icon"}>
                <Cross2Icon height={20} width={20} />
              </IconButton>
            </DialogPrimitive.Close>
          </StyledContent>
        </StyledOverlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: "rgba(0 0 0 / 0.5)",
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

const StyledContent = styled(DialogPrimitive.Content, {
  background: "#fff",
  borderRadius: 4,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  padding: 30,
  fontFamily: `'Raleway', sans-serif`,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

const StyledHeader = styled("h2", {
  display: "inline-block",
  width: "100%",
  textAlign: "center",
  justifySelf: "center",
});

const StyledGrid = styled("div", {
  display: "grid",
});

const StyledGridItem = styled("div", {
  width: "100%",
  borderRadius: 5,
  marginBottom: 10,
  padding: 5,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  variants: {
    position: {
      one: { gridRow: 1, gridColumn: 1, marginBottom: 5 },
      two: { gridRow: 2, gridColumn: 1, marginBottom: 5 },
      three: { gridRow: 3, gridColumn: 1, marginBottom: 5 },
    },
  },
  "&:hover": {
    cursor: "pointer",
    backgroundColor: gray.gray5,
  },
});

const StyledGridContents = styled("div", {
  width: "100%",
  variants: {
    icon: {
      true: {
        width: "30%",
        marginRight: 10,
      },
      false: {
        display: "flex",
        justifyContent: "center",
      },
    },
  },
});

const IconButton = styled(StyledButton, {
  position: "absolute",
  top: 5,
  right: 0,
  color: "#000"
});

export default Dialog;
