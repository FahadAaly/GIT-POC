"use client";

import React, { useEffect, useState } from "react";
import RepositoryList from "../components/RepositoryList/RepositoryList";

interface Repo {
  owner: string;
  repo: string;
}

const Repositories = () => {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    // Fetch the list of repositories from the API
    const fetchRepos = async () => {
      const response = await fetch("/api/list-repos");
      const data = await response.json();
      setRepos(data.repositories || []);
    };

    fetchRepos();
  }, []);

  return (
    <div>
      <RepositoryList repos={repos} />
    </div>
  );
};

export default Repositories;
