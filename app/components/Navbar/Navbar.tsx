"use client";
import React from "react";
import Button from "../Button/Button";
import { useSearchParams } from "next/navigation";

import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repo = searchParams?.get("repo");

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <nav className={styles.navbar}>
      <Button onClick={() => handleNavigation("/")} name="Clone" />
      <Button
        onClick={() => handleNavigation("/repositories")}
        name="Repositories"
      />
      <Button
        // onClick={() => handleNavigation("/modify")}
        name="Modify"
        disabled={repo ? false : true}
      />
    </nav>
  );
};

export default Navbar;
