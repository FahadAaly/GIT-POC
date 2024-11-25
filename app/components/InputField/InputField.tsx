import React from "react";
import styles from "./InputField.module.css";

interface InputFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  onChange,
  placeholder,
  label,
}) => {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        className={styles.inputField}
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default InputField;
