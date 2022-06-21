import Metamask from "../public/metamask.svg";
import WalletConnect from "../public/walletconnect.svg";
import Coinbase from "../public/coinbase.svg";
import { styled } from "@stitches/react";

const DialogModal = ({ select }) => {
  return (
    <>
      <StyledHeader>Choose a Provider</StyledHeader>
      <StyledGrid>
        <StyledGridItem
          position={"one"}
          onClick={() => {
            select("injected");
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
            select("walletconnect");
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
            select("coinbasewallet");
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
    </>
  );
};

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
  backgroundColor: "#191919",
  variants: {
    position: {
      one: { gridRow: 1, gridColumn: 1, marginBottom: 5 },
      two: { gridRow: 2, gridColumn: 1, marginBottom: 5 },
      three: { gridRow: 3, gridColumn: 1, marginBottom: 5 },
    },
  },
  "&:hover": {
    cursor: "pointer",
    backgroundColor: "#222",
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

export default DialogModal;
