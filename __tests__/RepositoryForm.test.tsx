// app/components/RepositoryForm/__tests__/RepositoryForm.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RepositoryForm from "../app/components/CloneRepo/CloneRepo";
import { validateUrl } from "@/app/util/common";

// Mock the validateUrl utility function
jest.mock("@/app/util/common", () => ({
  validateUrl: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe("RepositoryForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with the required input field and button", () => {
    render(<RepositoryForm />);

    // Check input field
    const inputField = screen.getByPlaceholderText("Enter GitHub repo URL...");
    expect(inputField).toBeInTheDocument();

    // Check submit button
    const submitButton = screen.getByText("Clone Repository");
    expect(submitButton).toBeInTheDocument();
  });

  it("shows an error message when an invalid URL is entered", () => {
    (validateUrl as jest.Mock).mockReturnValue(false); // Simulate invalid URL

    render(<RepositoryForm />);

    // Simulate user typing an invalid URL
    const inputField = screen.getByPlaceholderText("Enter GitHub repo URL...");
    fireEvent.change(inputField, { target: { value: "invalid-url" } });

    // Wait for the effect to validate the form
    fireEvent.blur(inputField);

    // Check for the error message
    const errorMessage = screen.getByText(
      "Please enter a valid GitHub repository URL."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("submits the form when a valid URL is entered", async () => {
    (validateUrl as jest.Mock).mockReturnValue(true); // Simulate valid URL

    // Mock the fetch response for the POST request
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Repository cloned successfully" }),
    });

    render(<RepositoryForm />);

    // Simulate user typing a valid URL
    const inputField = screen.getByPlaceholderText("Enter GitHub repo URL...");
    fireEvent.change(inputField, {
      target: { value: "https://github.com/user/repo.git" },
    });

    // Submit the form
    const submitButton = screen.getByText("Clone Repository");
    fireEvent.click(submitButton);

    // Wait for async actions to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/clone-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: "https://github.com/user/repo.git" }),
      });
    });

    // Check for the success message
    const successMessage = screen.getByText(
      "Success: Repository cloned successfully"
    );
    expect(successMessage).toBeInTheDocument();
  });

  it("displays an error if the API call fails", async () => {
    (validateUrl as jest.Mock).mockReturnValue(true); // Simulate valid URL

    // Mock the fetch response for the POST request to fail
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Failed to clone repository" }),
    });

    render(<RepositoryForm />);

    // Simulate user typing a valid URL
    const inputField = screen.getByPlaceholderText("Enter GitHub repo URL...");
    fireEvent.change(inputField, {
      target: { value: "https://github.com/user/repo.git" },
    });

    // Submit the form
    const submitButton = screen.getByText("Clone Repository");
    fireEvent.click(submitButton);

    // Wait for async actions to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/clone-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: "https://github.com/user/repo.git" }),
      });
    });

    // Check for the error message
    const errorMessage = screen.getByText("Error: Failed to clone repository");
    expect(errorMessage).toBeInTheDocument();
  });

  it("does not submit the form if there are validation errors", async () => {
    (validateUrl as jest.Mock).mockReturnValue(false); // Simulate invalid URL

    render(<RepositoryForm />);

    // Simulate user typing an invalid URL
    const inputField = screen.getByPlaceholderText("Enter GitHub repo URL...");
    fireEvent.change(inputField, { target: { value: "invalid-url" } });

    // Submit the form
    const submitButton = screen.getByText("Clone Repository");
    fireEvent.click(submitButton);

    // Ensure fetch was not called
    expect(fetch).not.toHaveBeenCalled();

    // Check for the error message
    const errorMessage = screen.getByText(
      "Please enter a valid GitHub repository URL."
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
