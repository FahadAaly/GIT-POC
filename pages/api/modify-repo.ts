// pages/api/modify-repo.ts
import type { NextApiRequest, NextApiResponse } from "next";

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
  const token = process.env.GITHUB_TOKEN;
  const { owner, repo, path, message, content } = req.body;

  if (!owner || !repo || !path || !message || !content) {
    return res.status(400).json({
      error: "Required parameters: owner, repo, path, message, content",
    });
  }

  try {
    // Fetch the existing file SHA
    const shaResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json", // GitHub requires a user-agent header
        },
      }
    );

    if (!shaResponse.ok) {
      const shaError = await shaResponse.json();
      return res.status(shaResponse.status).json({ error: shaError.message });
    }

    const shaData = await shaResponse.json();
    const fileSHA = shaData.sha; // Extract the file's SHA

    // Update the file
    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
          "User-Agent": "GitOps-POC-App",
        },
        body: JSON.stringify({
          message,
          content: Buffer.from(content).toString("base64"), // Encode content to Base64
          sha: fileSHA,
        }),
      }
    );

    if (!updateResponse.ok) {
      const updateError = await updateResponse.json();
      return res
        .status(updateResponse.status)
        .json({ error: updateError.message });
    }

    const updateData = await updateResponse.json();
    res.status(200).json({
      message: `File updated successfully! Commit: ${updateData.commit.sha}`,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error modifying repository:", error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
