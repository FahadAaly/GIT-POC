import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter, useSearchParams } from "next/navigation";
import ModifyRepo from "@/app/components/ModifyRepository/ModifyRepository";

// Mock `useRouter` and `useSearchParams` from Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe("ModifyRepo Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Mock useSearchParams to simulate query parameters
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn((key) => {
        if (key === "repo") return "test-repo";
        if (key === "owner") return "test-owner";
        return null;
      }),
    });
  });

  it("displays the file content in the textarea when file is selected", async () => {
    // Mock API response for file content
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          files: [{ name: "README.md", path: "README.md", isDirectory: false }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: "This is the content of the file.", // Simulate file content
        }),
      });

    render(<ModifyRepo />);

    // Wait for files to load and simulate selecting a file
    await waitFor(() => screen.getByText("README.md"));
    fireEvent.change(screen.getByLabelText("Select a File:"), {
      target: { value: "README.md" },
    });

    // Wait for file content to load and check the value in the textarea
    const textarea = await screen.findByDisplayValue(
      "This is the content of the file."
    );
    expect(textarea).toBeInTheDocument(); // Assert that the content is shown in the textarea
  });

  it("displays an error message if the commit fails", async () => {
    // Mock API responses
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          files: [{ name: "README.md", path: "README.md", isDirectory: false }],
        }),
      })
      .mockResolvedValueOnce({
        ok: false, // Simulate failure on commit
        json: async () => ({
          error: "Failed to commit changes.",
        }),
      });

    render(<ModifyRepo />);

    // Wait for files to load and simulate selecting a file
    await waitFor(() => screen.getByText("README.md"));
    fireEvent.change(screen.getByLabelText("Select a File:"), {
      target: { value: "README.md" },
    });

    // Enter commit message and update content
    fireEvent.change(screen.getByPlaceholderText("Enter commit message"), {
      target: { value: "Updated README" },
    });

    // Click the commit button
    fireEvent.click(screen.getByText("Commit Changes"));

    // Wait for the error message
    await waitFor(() =>
      expect(screen.getByText(/Error committing changes/i)).toBeInTheDocument()
    );
  });
});
