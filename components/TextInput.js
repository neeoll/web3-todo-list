import { useState } from "react";
import { styled } from "@stitches/react";

const TextInput = ({ submit, maxLength, children }) => {
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
    />
  );
};

const StyledTextInput = styled("input", {
  backgroundColor: "#292929",
  borderColor: "#393939",
  border: "none",
  borderRadius: 5,
  width: "100%",
  height: "100%",
  padding: 5,
  color: "#fff",
  margin: 5,
});

export default TextInput;
