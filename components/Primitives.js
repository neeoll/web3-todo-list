import {styled} from "@stitches/react";
import {gray} from "@radix-ui/colors";

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
        display: "flex",
        flexDirection: 'column'
      },
      contents: {
        gridArea: "contents",
        display: "flex",
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: 'column'
      },
      loading: {
        display: "flex",
        gridArea: "loading",
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: 'column'
      },
      actions: {
        display: "flex",
        gridArea: "actions",
        alignItems: "center",
      }
    },
  },
});

export const StyledCard = styled(StyledDiv, {
  width: 1000,
  padding: 25,
  margin: 20,
  border: "none",
  borderRadius: 10,
  display: "grid",
  backgroundColor: "#fff",
  boxShadow: "hsl(206 22% 4% / 35%) 0px 10px 38px -5px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  fontFamily: `'Raleway', sans-serif`,
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

export const StyledCard_Lists = styled(StyledCard, {
  gridTemplateColumns: "repeat(6, 1fr)",
  gridAutoRows: "minmax(50px, auto)",
  variants: {
    loading: {
      true: {
        gridTemplateAreas: `
        'header header header form form form'
        'loading loading loading loading loading loading'
        'footer footer footer footer footer footer'
        `,
      },
      false: {
        gridTemplateAreas: `
        'header header header form form form'
        'lists lists lists contents contents contents'
        'footer footer footer footer footer footer'
        `,
      },
    },
  },
});

export const StyledCard_List = styled(StyledCard, {
  gridTemplateColumns: "repeat(1, 1fr)",
  gridAutoRows: "minmax(50px, auto)",
  variants: {
    loading: {
      true: {
        gridTemplateAreas: `
        'form '
        'loading'
        'actions'
        'footer'
        `,
      },
      false: {
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
  width: "100%",
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
  margin: 5,
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
  width: '100%',
  padding: 15,
  marginTop: 10,
  marginBottom: 10,
  borderRadius: 5,
  overflowY: "auto",
  variants: {
    type: {
      list: {
        backgroundColor: gray.gray5,
        display: "flex",
        alignItems: "center",
        gap: 10,
        justifyContent: "flex-start",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: gray.gray8,
        },
      },
      listContent: {
        backgroundColor: gray.gray5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 4,
        maxHeight: 250,
        overflowY: "auto",
        scrollBehavior: "smooth",
      },
      task: {
        backgroundColor: gray.gray8,
        display: "flex",
        alignItems: "center",
        gap: 10,
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
        "&:hover": {backgroundColor: "#0062d2"},
      },
      cancel: {
        backgroundColor: "#F71919",
        "&:hover": {backgroundColor: "#c81414"},
      },
      icon: {
        backgroundColor: "transparent",
        color: "#000",
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

export const LoadingPlaceholder = styled('div', {
  width: '100%',
  height: '100%',
  position: 'fixed',
  background: `
      url("https://media.giphy.com/media/8agqybiK5LW8qrG3vJ/giphy.gif") center
      no-repeat`,
  zIndex: 1,
});
