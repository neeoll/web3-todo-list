import * as Switch from "@radix-ui/react-switch";
import { styled } from "@stitches/react";
import { blackA, gray } from "@radix-ui/colors";

const Toggle = ({ toggle }) => {
  return (
    <Flex>
      <label>Private</label>
      <StyledSwitch onCheckedChange={toggle}>
        <StyledThumb defaultChecked="false" />
      </StyledSwitch>
    </Flex>
  );
};

const Flex = styled("div", {
  display: "flex",
  gap: 5,
});

const StyledSwitch = styled(Switch.Root, {
  all: "unset",
  width: 42,
  height: 25,
  backgroundColor: gray.gray7,
  borderRadius: "9999px",
  position: "relative",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  '&[data-state="checked"]': { backgroundColor: gray.gray9 },
});

const StyledThumb = styled(Switch.Thumb, {
  display: "block",
  width: 21,
  height: 21,
  backgroundColor: "white",
  borderRadius: "9999px",
  boxShadow: `0 2px 2px ${blackA.blackA7}`,
  transition: "transform 100ms",
  transform: "translateX(2px)",
  willChange: "transform",
  '&[data-state="checked"]': { transform: "translateX(19px)" },
});

export default Toggle;
