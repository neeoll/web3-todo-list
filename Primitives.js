import { styled } from "@stitches/react";

export const StyledDiv = styled("div", {
  variants: {
    className: {
      header: {
        gridArea: "header",
      },
      footer: {
        gridArea: "footer",
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
  backgroundColor: "#191919",
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
        'footer'
        `,
      },
      lists: {
        gridTemplateColumns: "repeat(6, 1fr)",
        gridAutoRows: "minmax(50px, auto)",
        gridTemplateAreas: `
        'header header header form form form'
        'lists lists lists contents contents contents'
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
  backgroundColor: "#191919",
  padding: 10,
  borderRadius: 5,
  display: "flex",
  justifyContent: "center",
});

export const StyledCardList = styled(StyledDiv, {
  listStyle: "none",
  flexGrow: 1,
  padding: 10,
  backgroundColor: "#191919",
  borderRadius: 5,
  outline: "none",
});

export const StyledCardItem = styled(StyledDiv, {
  padding: 15,
  marginTop: 10,
  marginBottom: 10,
  backgroundColor: "#292929",
  color: "#fff",
  borderRadius: 5,
  overflowY: "auto",
  variants: {
    type: {
      list: {
        display: "flex",
        justifyContent: "flex-start",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "#222",
        },
      },
      task: {
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "#222",
        },
      },
    },
  },
});

export const StyledForm = styled("form", {
  backgroundColor: "#191919",
  display: "flex",
  justifyContent: "space-evenly",
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
  height: "auto",
  width: "auto",
  marginRight: 10,
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
