import { useState } from "react";
import { styled } from "@stitches/react";
import { gray } from "@radix-ui/colors";

const TextInput = ({ submit, maxLength, page, children }) => {
  const [formData, updateForm] = useState();

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      submit(e, formData);
      document.activeElement.value = "";
    }
  };

  return (
    <StyledTextInput
      type="text"
      onKeyDown={handleKeyPress}
      placeholder={children}
      onChange={(e) => updateForm(e.target.value)}
      maxLength={maxLength}
      page={page}
    />
  );
};

const StyledTextInput = styled("input", {
  backgroundColor: gray.gray3,
  borderColor: "#393939",
  border: "none",
  borderRadius: 5,
  width: "100%",
  height: "fit-content",
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 20,
  paddingRight: 20,
  variants: {
    page: {
      list: {
        width: "45%",
      },
    },
  },
  '&:focus': {
    boxShadow: 'none'
  },
});

export default TextInput;
