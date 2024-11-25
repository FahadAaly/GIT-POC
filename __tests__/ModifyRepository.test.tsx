// app/components/ModifyRepository/__tests__/ModifyRepository.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModifyRepository from "../app/components/ModifyRepository/ModifyRepository";

// Mock the fetch API
global.fetch = jest.fn();

describe("ModifyRepository Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all input fields and a button", () => {
    render(<ModifyRepository />);

    // Check input fields
    expect(
      screen.getByPlaceholderText("Owner (username or org)")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repository Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Commit Message")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("New README content")
    ).toBeInTheDocument();

    // Check submit button
    expect(screen.getByText("Update Readme")).toBeInTheDocument();
  });

  it("updates input values when typing", () => {
    render(<ModifyRepository />);

    const ownerInput = screen.getByPlaceholderText("Owner (username or org)");
    const repoInput = screen.getByPlaceholderText("Repository Name");
    const messageInput = screen.getByPlaceholderText("Commit Message");
    const contentTextarea = screen.getByPlaceholderText("New README content");

    fireEvent.change(ownerInput, { target: { value: "test-owner" } });
    fireEvent.change(repoInput, { target: { value: "test-repo" } });
    fireEvent.change(messageInput, { target: { value: "New commit message" } });
    fireEvent.change(contentTextarea, {
      target: { value: "New README content" },
    });

    expect(ownerInput).toHaveValue("test-owner");
    expect(repoInput).toHaveValue("test-repo");
    expect(messageInput).toHaveValue("New commit message");
    expect(contentTextarea).toHaveValue("New README content");
  });

  it("submits the form and displays success message when API call succeeds", async () => {
    // Mock the fetch response for a successful request
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "README.md updated successfully" }),
    });

    render(<ModifyRepository />);

    fireEvent.change(screen.getByPlaceholderText("Owner (username or org)"), {
      target: { value: "test-owner" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repository Name"), {
      target: { value: "test-repo" },
    });
    fireEvent.change(screen.getByPlaceholderText("Commit Message"), {
      target: { value: "Updated README" },
    });
    fireEvent.change(screen.getByPlaceholderText("New README content"), {
      target: { value: "Updated content for README" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Update Readme"));

    // Wait for the fetch call and assertions
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/modify-readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: "test-owner",
          repo: "test-repo",
          message: "Updated README",
          content: "Updated content for README",
        }),
      });
    });

    // Check for success message
    const successMessage = screen.getByText("README.md updated successfully");
    expect(successMessage).toBeInTheDocument();
  });

  it("displays an error message when the API call fails", async () => {
    // Mock the fetch response for a failed request
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Failed to update README" }),
    });

    render(<ModifyRepository />);

    fireEvent.change(screen.getByPlaceholderText("Owner (username or org)"), {
      target: { value: "test-owner" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repository Name"), {
      target: { value: "test-repo" },
    });
    fireEvent.change(screen.getByPlaceholderText("Commit Message"), {
      target: { value: "Updated README" },
    });
    fireEvent.change(screen.getByPlaceholderText("New README content"), {
      target: { value: "Updated content for README" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Update Readme"));

    // Wait for the fetch call and assertions
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/modify-readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: "test-owner",
          repo: "test-repo",
          message: "Updated README",
          content: "Updated content for README",
        }),
      });
    });

    // Check for error message
    const errorMessage = screen.getByText("Error: Failed to update README");
    expect(errorMessage).toBeInTheDocument();
  });

  it("displays a generic error message if fetch throws an error", async () => {
    // Mock fetch to throw an error
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<ModifyRepository />);

    fireEvent.change(screen.getByPlaceholderText("Owner (username or org)"), {
      target: { value: "test-owner" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repository Name"), {
      target: { value: "test-repo" },
    });
    fireEvent.change(screen.getByPlaceholderText("Commit Message"), {
      target: { value: "Updated README" },
    });
    fireEvent.change(screen.getByPlaceholderText("New README content"), {
      target: { value: "Updated content for README" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Update Readme"));

    // Wait for the fetch call and assertions
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/modify-readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: "test-owner",
          repo: "test-repo",
          message: "Updated README",
          content: "Updated content for README",
        }),
      });
    });

    // Check for generic error message
    const errorMessage = screen.getByText("Failed to update README.");
    expect(errorMessage).toBeInTheDocument();
  });
});
