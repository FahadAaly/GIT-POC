// pages/api/list-repos.ts
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

const REPOS_DIR = path.resolve("./cloned-repos");

type Repo = {
  owner: string;
  repo: string;
};

type ResponseData = {
  repositories?: Repo[];
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    if (!fs.existsSync(REPOS_DIR)) {
      return res.status(200).json({ repositories: [] });
    }

    const owners = fs
      .readdirSync(REPOS_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory());

    const repositories: Repo[] = [];

    owners.forEach((ownerDir) => {
      const ownerPath = path.join(REPOS_DIR, ownerDir.name);
      const repos = fs
        .readdirSync(ownerPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory());

      repos.forEach((repoDir) => {
        repositories.push({
          owner: ownerDir.name,
          repo: repoDir.name,
        });
      });
    });

    res.status(200).json({ repositories });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error listing repositories:", error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
