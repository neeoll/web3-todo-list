import * as TabsPrimitive from "@radix-ui/react-tabs";
import { violet, gray } from "@radix-ui/colors";
import { styled } from "@stitches/react";
import Task from "./Task";

const Tabs = ({ tasks, toggle, revert }) => {
  return (
    <StyledTabs defaultValue="all">
      <StyledList>
        <StyledTrigger value="all" id={"all"}>
          All
        </StyledTrigger>
        <StyledTrigger value="active" id={"active"}>
          Active
        </StyledTrigger>
        <StyledTrigger value="completed" id={"completed"}>
          Completed
        </StyledTrigger>
      </StyledList>
      <StyledTabsContent value="all">
        {tasks.map((item) => (
          <li key={item.id}>
            <Task data={item} toggle={toggle} revert={revert} />
          </li>
        ))}
      </StyledTabsContent>
      <StyledTabsContent value="active">
        {tasks
          .filter((item) => item.completed == false)
          .map((item) => (
            <li key={item.id}>
              <Task data={item} toggle={toggle} revert={revert} />
            </li>
          ))}
      </StyledTabsContent>
      <StyledTabsContent value="completed">
        {tasks
          .filter((item) => item.completed == true)
          .map((item) => (
            <li key={item.id}>
              <Task data={item} toggle={toggle} revert={revert} />
            </li>
          ))}
      </StyledTabsContent>
    </StyledTabs>
  );
};

const StyledTabs = styled(TabsPrimitive.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginBottom: 10,
});

const StyledList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: "flex",
  borderBottom: `1px solid ${gray.gray9}`,
});

const StyledTrigger = styled(TabsPrimitive.Trigger, {
  all: "unset",
  fontFamily: "inherit",
  backgroundColor: gray.gray3,
  padding: "0 20px",
  height: 45,
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 15,
  lineHeight: 1,
  userSelect: "none",
  "&:first-child": { borderTopLeftRadius: 6 },
  "&:last-child": { borderTopRightRadius: 6 },
  variants: {
    id: {
      all: {
        "&:hover": { color: violet.violet11 },
        '&[data-state="active"]': {
          color: violet.violet11,
          boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
        },
      },
      active: {
        "&:hover": { color: "#F71919" },
        '&[data-state="active"]': {
          color: "#F71919",
          boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
        },
      },
      completed: {
        "&:hover": { color: "#0075FF" },
        '&[data-state="active"]': {
          color: "#0075FF",
          boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
        },
      },
    },
  },
});

const StyledTabsContent = styled(TabsPrimitive.Content, {
  maxHeight: 350,
  overflowY: "auto",
  listStyle: "none",
  flexGrow: 1,
  padding: 20,
  backgroundColor: gray.gray7,
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  outline: "none",
});

export default Tabs;
