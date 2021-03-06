import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { StyledActions, StyledButton } from "./Primitives";
import { styled, keyframes } from "@stitches/react";
import { gray } from "@radix-ui/colors";

const AlertDialog = ({ title, description, confirm }) => {
  const sendConfirmation = () => {
    confirm();
  };

  return (
    <AlertDialogPrimitive.Root>
      <AlertDialogPrimitive.Trigger asChild>
        <StyledButton type={"cancel"}>Sign out</StyledButton>
      </AlertDialogPrimitive.Trigger>
      <AlertDialogPrimitive.Portal>
        <StyledAlertOverlay />
        <StyledAlertContent>
          <StyledTitle>{title}</StyledTitle>
          <StyledDescription>{description}</StyledDescription>
          <StyledActions>
            <AlertDialogPrimitive.Cancel asChild>
              <StyledButton type={"cancel"}>Cancel</StyledButton>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <StyledButton type={"save"} onClick={sendConfirmation}>
                Confirm
              </StyledButton>
            </AlertDialogPrimitive.Action>
          </StyledActions>
        </StyledAlertContent>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
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

const StyledAlertOverlay = styled(AlertDialogPrimitive.Overlay, {
  backgroundColor: "rgba(0 0 0 / 0.5)",
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

const StyledAlertContent = styled(AlertDialogPrimitive.Content, {
  backgroundColor: "#fff",
  borderRadius: 4,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "500px",
  maxHeight: "85vh",
  padding: 30,
  fontFamily: `'Raleway', sans-serif`,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  "&:focus": { outline: "none" },
});

const StyledTitle = styled(AlertDialogPrimitive.Title, {
  margin: 0,
  fontSize: 17,
  fontWeight: 500,
});

const StyledDescription = styled(AlertDialogPrimitive.Description, {
  marginBottom: 20,
  color: gray.gray9,
  fontSize: 15,
  lineHeight: 1.5,
});

export default AlertDialog;
