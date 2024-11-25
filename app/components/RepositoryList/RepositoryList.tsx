"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./RepositoryList.module.css";

interface Repo {
  owner: string;
  repo: string;
}

interface RepositoryListProps {
  repos: Repo[]; // Array of repositories with owner and repo
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repos }) => {
  const router = useRouter();

  // Handle dropdown selection
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [owner, repo] = event.target.value.split("/");
    if (owner && repo) {
      router.push(`/modify?owner=${owner}&repo=${repo}`); // Navigate to Modify Repo page with owner and repo as query parameters
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor="repoDropdown" className={styles.label}>
        Select a Repository:
      </label>
      <select
        id="repoDropdown"
        className={styles.dropdown}
        onChange={handleSelect}
        defaultValue=""
      >
        <option value="" disabled>
          -- Choose a repository --
        </option>
        {repos.length > 0 ? (
          repos.map((repo) => (
            <option
              key={`${repo.owner}/${repo.repo}`}
              value={`${repo.owner}/${repo.repo}`}
            >
              {`${repo.owner}/${repo.repo}`}
            </option>
          ))
        ) : (
          <option> No repository found</option>
        )}
      </select>
    </div>
  );
};

export default RepositoryList;
