import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import RepositoryList from "@/app/components/RepositoryList/RepositoryList";

// Mock `useRouter` from Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("RepositoryList Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the dropdown with repositories", () => {
    const repos = [
      { owner: "owner1", repo: "repo1" },
      { owner: "owner2", repo: "repo2" },
    ];

    render(<RepositoryList repos={repos} />);

    // Check if the label is rendered
    expect(screen.getByText("Select a Repository:")).toBeInTheDocument();

    // Check if the dropdown and options are rendered
    const dropdown = screen.getByLabelText("Select a Repository:");
    expect(dropdown).toBeInTheDocument();

    // Check for default option
    expect(screen.getByText("-- Choose a repository --")).toBeInTheDocument();

    // Check for repository options
    expect(screen.getByText("owner1/repo1")).toBeInTheDocument();
    expect(screen.getByText("owner2/repo2")).toBeInTheDocument();
  });

  it("navigates to the modify page when a repository is selected", () => {
    const repos = [
      { owner: "owner1", repo: "repo1" },
      { owner: "owner2", repo: "repo2" },
    ];

    render(<RepositoryList repos={repos} />);

    // Simulate selecting a repository
    fireEvent.change(screen.getByLabelText("Select a Repository:"), {
      target: { value: "owner1/repo1" },
    });

    // Ensure router.push is called with the correct URL
    expect(mockPush).toHaveBeenCalledWith("/modify?owner=owner1&repo=repo1");
  });

  it("renders a message when no repositories are available", () => {
    render(<RepositoryList repos={[]} />);

    // Check for empty state message
    expect(screen.getByText("No repository found")).toBeInTheDocument();
  });

  it("does not navigate if an invalid option is selected", () => {
    const repos = [
      { owner: "owner1", repo: "repo1" },
      { owner: "owner2", repo: "repo2" },
    ];

    render(<RepositoryList repos={repos} />);

    // Simulate selecting the default option
    fireEvent.change(screen.getByLabelText("Select a Repository:"), {
      target: { value: "" },
    });

    // Ensure router.push is not called
    expect(mockPush).not.toHaveBeenCalled();
  });
});
