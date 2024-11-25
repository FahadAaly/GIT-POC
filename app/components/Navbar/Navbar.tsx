"use client";
import React from "react";
import Button from "../Button/Button";

import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <nav className={styles.navbar}>
      <Button
        onClick={() => handleNavigation("/")}
        name="Clone"
        className="button"
      />
      <Button
        onClick={() => handleNavigation("/repositories")}
        name="Repositories"
        className="button"
      />
      <Button
        onClick={() => handleNavigation("/modify")}
        name="Modify"
        disabled={true}
        className="button"
      />
    </nav>
  );
};

export default Navbar;
