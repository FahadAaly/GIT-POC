"use client";
import React from "react";
import styles from "./styles/Home.module.css";
import CloneRepo from "./components/CloneRepo/CloneRepo";

const Clone = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Git Repository Cloner</h1>

      <div className={styles.formWrapper}>
        <CloneRepo />
      </div>
    </div>
  );
};

export default Clone;
