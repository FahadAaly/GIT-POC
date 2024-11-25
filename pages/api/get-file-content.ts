// pages/api/get-file-content.ts
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

const REPOS_DIR = path.resolve("./cloned-repos");

type ResponseData = {
  content?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { repoName, owner, fileName } = req.query;

  if (!owner || typeof owner !== "string") {
    return res.status(400).json({ error: "Repository owner is required." });
  }

  if (!repoName || typeof repoName !== "string") {
    return res.status(400).json({ error: "Repository name is required." });
  }

  if (!fileName || typeof fileName !== "string") {
    return res.status(400).json({ error: "File name is required." });
  }

  const filePath = path.join(REPOS_DIR, owner, repoName, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found." });
    }

    const content = fs.readFileSync(filePath, "utf8");
    res.status(200).json({ content });
  } catch (error: any) {
    console.error("Error fetching file content:", error.message);
    res.status(500).json({ error: error.message });
  }
}
