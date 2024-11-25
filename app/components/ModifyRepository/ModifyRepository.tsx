"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "../Button/Button";
import InputField from "../InputField/InputField";
import styles from "./ModifyRepository.module.css";
import { useRouter } from "next/navigation";

type FileNode = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
};

const ModifyRepo = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const repo = searchParams.get("repo"); // Get the selected repository from query params
  const owner = searchParams.get("owner");

  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState(""); // Selected file
  const [fileContent, setFileContent] = useState(""); // Content of the selected file
  const [commitMessage, setCommitMessage] = useState("");
  const [status, setStatus] = useState("");

  // Fetch all files in the repository
  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch(
        `/api/list-files?repoName=${repo}&owner=${owner}`
      );
      const data = await response.json();
      setFiles(data.files || []);
    };

    if (repo && owner) fetchFiles();
  }, [repo, owner]);

  // Fetch the content of the selected file
  const fetchFileContent = async (filePath: string) => {
    const response = await fetch(
      `/api/get-file-content?repoName=${repo}&owner=${owner}&fileName=${filePath}`
    );
    const data = await response.json();
    setFileContent(data.content || "");
  };

  const renderFileOptions = (nodes: FileNode[], level = 0): JSX.Element[] => {
    return nodes.map((node) => {
      const indentation = "\u00A0".repeat(level * 4); // Add spaces for indentation

      if (node.isDirectory) {
        // Include directory itself as a selectable option
        return (
          <React.Fragment key={node.path}>
            <option disabled>{`${indentation}${node.name}/`}</option>
            {renderFileOptions(node.children || [], level + 1)}{" "}
            {/* Recursively render children */}
          </React.Fragment>
        );
      } else {
        // Render file as a selectable option
        return (
          <option key={node.path} value={node.path}>
            {`${indentation}${node.name}`}
          </option>
        );
      }
    });
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fileName = event.target.value;
    setSelectedFile(fileName);
    fetchFileContent(fileName); // Fetch content of the selected file
  };

  // Handle file commit
  const handleCommit = async () => {
    if (!owner || !repo) {
      setStatus("Error: Owner or repository name is missing.");
      return;
    }

    if (!selectedFile) {
      setStatus("Error: No file selected.");
      return;
    }
    setStatus("Committing...");
    try {
      const response = await fetch("/api/modify-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: owner, // Replace with the repository owner
          repo: repo, // Repository name from query params
          path: selectedFile, // The selected file path
          message: commitMessage, // Commit message entered by the user
          content: fileContent, // Edited file content
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("Changes committed successfully!");
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus("Error committing changes.");
    }
  };

  const cancelChanges = () => {
    router.push("/repositories");
  };

  return (
    <div className={styles.formContainer}>
      <h1>Modify Repository: {repo}</h1>

      <label htmlFor="fileDropdown">Select a File:</label>
      <select
        id="fileDropdown"
        value={selectedFile}
        onChange={handleFileSelect}
        className={styles.select}
      >
        <option value="" disabled>
          -- Choose a file --
        </option>
        {renderFileOptions(files)}
      </select>

      {selectedFile && (
        <>
          <h2>Editing File: {selectedFile}</h2>
          <textarea
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            className={styles.textarea}
          ></textarea>
          <InputField
            label="Commit message:"
            name="commit"
            placeholder="Enter commit message"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
          />
          <Button onClick={handleCommit} name="Commit Changes" />
          <Button onClick={cancelChanges} name="Cancel Changes" />
        </>
      )}

      {status && <p>{status}</p>}
    </div>
  );
};

export default ModifyRepo;
