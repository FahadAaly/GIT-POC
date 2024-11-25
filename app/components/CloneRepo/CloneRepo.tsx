import React, { useState, useEffect } from "react";
import InputField from "../InputField/InputField";
import { validateUrl } from "@/app/util/common";
import styles from "./CloneRepo.module.css";
import Button from "../Button/Button";
import { useRouter } from "next/navigation";

const CloneRepo = () => {
  const router = useRouter();
  const { formContainer } = styles;
  const [formData, setFormData] = useState({
    repoUrl: "",
  });
  const [errors, setErrors] = useState({
    repoUrl: "",
  });
  const [cloneStatus, setCloneStatus] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = { repoUrl: "" };

    if (!formData.repoUrl) {
    } else if (!validateUrl(formData.repoUrl)) {
      newErrors.repoUrl = "Please enter a valid GitHub repository URL.";
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.repoUrl) {
      setCloneStatus("Please fix the errors before submitting.");
      return;
    }

    setCloneStatus("Cloning repository...");

    try {
      const response = await fetch("/api/clone-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setCloneStatus(`Success: ${result.message}`);
      } else {
        setCloneStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error cloning repository:", error);
      setCloneStatus("Failed to clone repository. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={formContainer}>
        <InputField
          label="GitHub Repository URL:"
          name="repoUrl"
          value={formData.repoUrl}
          onChange={handleInputChange}
          placeholder="Enter GitHub repo URL..."
        />
        {errors.repoUrl && <p className="error">{errors.repoUrl}</p>}

        <Button name="Clone Repository" type="submit" />
        {cloneStatus && <p>{cloneStatus}</p>}
      </form>
    </div>
  );
};

export default CloneRepo;
