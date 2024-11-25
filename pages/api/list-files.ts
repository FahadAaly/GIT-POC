// pages/api/list-files.ts
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

const REPOS_DIR = path.resolve("./cloned-repos");

type FileNode = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[]; // Nested structure for folders
};

type ResponseData = {
  files?: FileNode[];
  error?: string;
};

// Helper function to recursively list files and folders
function listFilesRecursively(
  directory: string,
  relativePath = ""
): FileNode[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.map((entry) => {
    const fullPath = path.join(directory, entry.name);
    const relativeEntryPath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      return {
        name: entry.name,
        path: relativeEntryPath,
        isDirectory: true,
        children: listFilesRecursively(fullPath, relativeEntryPath), // Recurse into folder
      };
    } else {
      return {
        name: entry.name,
        path: relativeEntryPath,
        isDirectory: false,
      };
    }
  });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { repoName, owner } = req.query;

  if (!owner || typeof owner !== "string") {
    return res.status(400).json({ error: "Repository owner is required." });
  }

  if (!repoName || typeof repoName !== "string") {
    return res.status(400).json({ error: "Repository name is required." });
  }

  const repoPath = path.join(REPOS_DIR, owner, repoName);

  try {
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: "Repository not found." });
    }

    const files = listFilesRecursively(repoPath);
    res.status(200).json({ files });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error listing files:", error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
