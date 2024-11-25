import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  name: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  name,
  onClick,
  type = "button",
  disabled,
  className,
}) => {
  return (
    <button
      type={type}
      className={className ? styles.button : styles.submitButton}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
