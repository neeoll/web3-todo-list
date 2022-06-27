import { useState } from "react";
import { styled } from "@stitches/react";
import { slateDark } from "@radix-ui/colors";

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
  backgroundColor: slateDark.slate2,
  borderColor: "#393939",
  border: "none",
  borderRadius: 5,
  width: "100%",
  height: "fit-content",
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 20,
  paddingRight: 20,
  color: "#fff",
  variants: {
    page: {
      list: {
        width: "45%",
      },
    },
  },
});

export default TextInput;
