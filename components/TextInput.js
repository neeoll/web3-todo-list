import { useState } from "react";
import { styled } from "@stitches/react";

const TextInput = ({ submit, maxLength, page, children }) => {
  const [formData, updateForm] = useState("");

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
  backgroundColor: "#292929",
  borderColor: "#393939",
  border: "none",
  borderRadius: 5,
  width: "100%",
  height: "auto",
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
