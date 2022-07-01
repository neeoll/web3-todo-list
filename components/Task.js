import { useState, useEffect } from "react";
import {
  DividerHorizontalIcon,
  CheckIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { StyledCardItem, StyledButton } from "./primitives/Primitives";
import * as Checkbox from "@radix-ui/react-checkbox";
import { styled } from "@stitches/react";
import { violet } from "@radix-ui/colors";

const Task = ({ data, toggle, revert }) => {
  const [propsData, updateProps] = useState(data);
  useEffect(() => {
    updateProps(data);
  }, [data]);

  const [checked, setChecked] = useState("indeterminate");
  useEffect(() => {
    if (propsData.completed == true) {
      setChecked(true);
      return;
    }
    setChecked("indeterminate");
  }, [propsData.completed]);

  const toggleCompletion = () => {
    toggle(propsData.id, !propsData.completed);
  };

  const revertTask = () => {
    revert(propsData.id);
  };

  return (
    <StyledCardItem type={"task"}>
      <StyledCheckbox checked={checked} onClick={toggleCompletion}>
        <StyledIndicator>
          {checked === "indeterminate" && <DividerHorizontalIcon />}
          {checked === true && <CheckIcon />}
        </StyledIndicator>
      </StyledCheckbox>
      <StyledContent completed={propsData.completed}>
        {propsData.content}
      </StyledContent>
      {propsData.new === true && (
        <StyledButton type={"icon"} onClick={revertTask}>
          <Cross2Icon width={20} height={20} />
        </StyledButton>
      )}
    </StyledCardItem>
  );
};

const StyledCheckbox = styled(Checkbox.Root, {
  display: "inline-block",
  verticalAlign: "middle",
  width: "auto",
  height: "auto",
  border: "none",
  borderRadius: "5px",
});

const StyledIndicator = styled(Checkbox.Indicator, {
  color: violet.violet11,
});

const StyledContent = styled("span", {
  variants: {
    completed: {
      true: {
        textDecoration: "line-through",
      },
    },
  },
});

export default Task;
