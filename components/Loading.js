import {styled, keyframes} from "@stitches/react";

const Loading = () => {
  return <StyledLoading />;
};

const show = keyframes({
  "0%": {opacity: 0},
  "100%": {opacity: 1},
});

const StyledLoading = styled("div", {
  background: `rgba(0, 0, 0, 0.834)
      url("https://media.giphy.com/media/8agqybiK5LW8qrG3vJ/giphy.gif") center
      no-repeat`,
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: 'none', 
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${show} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

export default Loading;
