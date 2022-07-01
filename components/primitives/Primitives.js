import { styled } from "@stitches/react";
import { slateDark } from "@radix-ui/colors";

export const StyledDiv = styled("div", {
  variants: {
    className: {
      header: {
        gridArea: "header",
      },
      footer: {
        display: "flex",
        flexDirection: "column",
        gridArea: "footer",
        alignItems: "center",
      },
      lists: {
        gridArea: "lists",
      },
      contents: {
        gridArea: "contents",
      },
    },
  },
});

export const StyledCard = styled(StyledDiv, {
  width: 1000,
  padding: 25,
  margin: 20,
  border: "none",
  color: "#fff",
  backgroundColor: slateDark.slate3,
  borderRadius: 10,
  display: "grid",
  variants: {
    page: {
      connect: {
        width: "auto",
        gridTemplateColumns: "repeat(1, 1fr)",
        gridAutoRows: "minmax(50px, auto)",
        gridTemplateAreas: `
        'header'
        'contents'
        `,
      },
      lists: {
        gridTemplateColumns: "repeat(6, 1fr)",
        gridAutoRows: "minmax(50px, auto)",
        gridTemplateAreas: `
        'header header header form form form'
        'lists lists lists contents contents contents'
        'footer footer footer footer footer footer'
        `,
      },
      list: {
        gridTemplateColumns: "repeat(1, 1fr)",
        gridAutoRows: "minmax(50px, auto)",
        gridTemplateAreas: `
        'form '
        'contents'
        'actions'
        'footer'
        `,
      },
    },
    writeAccess: {
      false: {
        pointerEvents: "none",
      },
    },
  },
});

export const StyledActions = styled(StyledDiv, {
  backgroundColor: "transparent",
  paddingTop: 10,
  paddingBottom: 10,
  borderRadius: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
});

export const StyledCardList = styled(StyledDiv, {
  listStyle: "none",
  padding: 10,
  backgroundColor: "transparent",
  borderRadius: 5,
  outline: "none",
  display: "flex",
  flexDirection: "column",
  variants: {
    type: {
      list: {
        maxHeight: 250,
        overflowY: "auto",
      },
    },
  },
});

export const StyledCardItem = styled(StyledDiv, {
  padding: 15,
  marginTop: 10,
  marginBottom: 10,
  backgroundColor: slateDark.slate2,
  color: "#fff",
  borderRadius: 5,
  overflowY: "auto",
  variants: {
    type: {
      list: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        justifyContent: "flex-start",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: slateDark.slate1,
        },
      },
      listContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 4,
        maxHeight: 250,
        overflowY: "auto",
        scrollBehavior: "smooth",
      },
      task: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        "&:hover": {
          cursor: "pointer",
          backgroundColor: slateDark.slate3,
        },
      },
    },
  },
});

export const StyledForm = styled("form", {
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  gap: 15,
  padding: 10,
  borderRadius: 5,
  variants: {
    className: {
      form: {
        gridArea: "form",
      },
    },
  },
});

export const StyledButton = styled("button", {
  height: "fit-content",
  width: "fit-content",
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 20,
  paddingRight: 20,
  color: "#fff",
  border: "none",
  fontSize: 16,
  borderRadius: 5,
  variants: {
    type: {
      save: {
        backgroundColor: "#0075FF",
        "&:hover": { backgroundColor: "#0062d2" },
      },
      cancel: {
        backgroundColor: "#F71919",
        "&:hover": { backgroundColor: "#c81414" },
      },
      icon: {
        backgroundColor: "transparent",
        paddingLeft: 0,
      },
    },
    ignoreBlock: {
      true: {
        pointerEvents: "all",
      },
    },
  },
});

export const StyledText = styled(StyledDiv, {
  display: "flex",
  justifyContent: "space-evenly",
});