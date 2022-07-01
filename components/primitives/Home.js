import * as Dialog from '@radix-ui/react-dialog'
import { slateDark } from '@radix-ui/colors';
import { StyledButton } from './Primitives';
import { styled, keyframes } from '@stitches/react';

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

export const StyledOverlay = styled(Dialog.Overlay, {
  backgroundColor: "rgba(0 0 0 / 0.5)",
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

export const StyledContent = styled(Dialog.Content, {
  background: slateDark.slate5,
  borderRadius: 4,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color: "#fff",
  padding: 30,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

export const IconButton = styled(StyledButton, {
  position: "absolute",
  top: 5,
  right: 0,
});