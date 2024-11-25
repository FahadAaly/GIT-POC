"use client";
import React from "react";
import styles from "../styles/Home.module.css";
import ModifyRepository from "@/app/components/ModifyRepository/ModifyRepository";

const Modify = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Git Repository Cloner</h1>
      <div className={styles.formWrapper}>
        <ModifyRepository />
      </div>
    </div>
  );
};

export default Modify;
