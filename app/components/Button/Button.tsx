import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  name: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  name,
  onClick,
  type = "button",
  disabled,
}) => {
  return (
    <button
      type={type}
      className={disabled ? styles.disabledButton : styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
