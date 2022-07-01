import * as Tabs from '@radix-ui/react-tabs'
import { violet, slateDark } from '@radix-ui/colors';
import { styled } from '@stitches/react';

export const StyledTabs = styled(Tabs.Root, {
  display: "flex",
  flexDirection: "column",
  width: "auto",
  marginBottom: 10,
});

export const StyledList = styled(Tabs.List, {
  flexShrink: 0,
  display: "flex",
  borderBottom: `1px solid ${slateDark.slate9}`,
});

export const StyledTrigger = styled(Tabs.Trigger, {
  all: "unset",
  fontFamily: "inherit",
  backgroundColor: slateDark.slate1,
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
  "&:hover": { color: violet.violet11 },
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

export const StyledTabsContent = styled(Tabs.Content, {
  maxHeight: 350,
  overflowY: "auto",
  listStyle: "none",
  flexGrow: 1,
  padding: 20,
  backgroundColor: slateDark.slate1,
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  outline: "none",
});