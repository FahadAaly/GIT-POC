// pages/api/clone-repo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import simpleGit from "simple-git";
import path from "path";
import fs from "fs";

const REPOS_DIR = path.resolve("./cloned-repos");

type ResponseData = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: "Repository URL is required" });
  }

  try {
    // Parse the repo URL to extract owner and repo name
    const regex = /github\.com\/([^/]+)\/([^/.]+)(\.git)?$/;
    const match = repoUrl.match(regex);

    if (!match) {
      return res.status(400).json({ error: "Invalid GitHub repository URL." });
    }

    const owner = match[1];
    const repoName = match[2];
    const repoPath = path.join(REPOS_DIR, owner, repoName);

    const git = simpleGit();

    if (!fs.existsSync(REPOS_DIR)) {
      fs.mkdirSync(REPOS_DIR, { recursive: true });
    }

    // Check if the repository already exists
    if (fs.existsSync(repoPath)) {
      return res.status(400).json({ error: "Repository already cloned." });
    }

    await git.clone(repoUrl, repoPath);
    res
      .status(200)
      .json({
        message: `Repository ${owner}/${repoName} cloned successfully!`,
      });
  } catch (error: any) {
    console.error("Error cloning repository:", error.message);
    res.status(500).json({ error: error.message });
  }
}
