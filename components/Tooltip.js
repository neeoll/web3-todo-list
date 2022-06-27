import * as HoverCard from "@radix-ui/react-hover-card";
import { styled, keyframes } from "@stitches/react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { slateDark } from "@radix-ui/colors";

const Tooltip = ({ text }) => {
  return (
    <HoverCard.Root openDelay={0}>
      <HoverCard.Trigger asChild>
        <InfoCircledIcon width={20} height={20} />
      </HoverCard.Trigger>
      <StyledContent>
        {text}
        <StyledArrow />
      </StyledContent>
    </HoverCard.Root>
  );
};

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const StyledContent = styled(HoverCard.Content, {
  borderRadius: 6,
  padding: 20,
  width: 300,
  color: "#fff",
  backgroundColor: slateDark.slate1,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  "@media (prefers-reduced-motion: no-preference)": {
    animationDuration: "400ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    animationFillMode: "forwards",
    willChange: "transform, opacity",
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const StyledArrow = styled(HoverCard.Arrow, {
  fill: slateDark.slate1,
});

export default Tooltip;
