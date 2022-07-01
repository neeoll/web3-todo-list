import * as Select from '@radix-ui/react-select'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { slateDark } from '@radix-ui/colors';
import { styled, keyframes } from '@stitches/react';

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

export const StyledTrigger = styled(Select.Trigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 5,
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 10,
  paddingBottom: 10,
  gap: 5,
  height: "fit-content",
  backgroundColor: slateDark.slate2,
  color: "#fff",
  "&:hover": { backgroundColor: slateDark.slate1 },
});

export const StyledContent = styled(Select.Content, {
  overflow: "hidden",
  backgroundColor: slateDark.slate1,
  borderRadius: 5,
});

export const StyledViewport = styled(Select.Viewport, {
  padding: 5,
});

export const StyledItem = styled(Select.Item, {
  all: "unset",
  color: "#fff",
  borderRadius: 5,
  display: "flex",
  alignItems: "center",
  height: "auto",
  paddingLeft: 30,
  paddingRight: 30,
  position: "relative",
  userSelect: "none",

  "&:focus": {
    backgroundColor: slateDark.slate2,
    color: "#fff",
  },
});

export const StyledItemIndicator = styled(Select.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

export const StyledAlertOverlay = styled(AlertDialog.Overlay, {
  backgroundColor: "rgba(0 0 0 / 0.5)",
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

export const StyledAlertContent = styled(AlertDialog.Content, {
  background: slateDark.slate5,
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
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  "&:focus": { outline: "none" },
});

export const StyledTitle = styled(AlertDialog.Title, {
  margin: 0,
  color: "#fff",
  fontSize: 17,
  fontWeight: 500,
});

export const StyledDescription = styled(AlertDialog.Description, {
  marginBottom: 20,
  color: slateDark.slate9,
  fontSize: 15,
  lineHeight: 1.5,
});