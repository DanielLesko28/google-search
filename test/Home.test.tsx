import { render, screen } from "@testing-library/react";
import Home from "../src/pages/Home";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

describe("Home screen", () => {
  it("renders Nothing to show text first", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText("Nothing to show")).toBeInTheDocument();
  });

  it("updates search input on typing", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search...");
    await userEvent.type(input, "hello");

    expect(input).toHaveValue("hello");
  });

  it("shows Clear button after results load", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          items: [{ title: "Test", link: "https://test.com" }],
          queries: {},
        }),
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search...");
    await userEvent.type(input, "query");

    // Wait for the Clear button to appear
    expect(await screen.findByText("Clear")).toBeInTheDocument();
  });
});

it("renders table rows with results", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        items: [
          { title: "Item 1", link: "https://item1.com" },
          { title: "Item 2", link: "https://item2.com" },
        ],
        queries: {},
      }),
  });

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  const input = screen.getByPlaceholderText("Search...");
  await userEvent.type(input, "search");

  // Wait for table rows
  expect(await screen.findByText("Item 1")).toBeInTheDocument();
  expect(screen.getByText("Item 2")).toBeInTheDocument();
  expect(screen.getAllByText("Open").length).toBe(2);
});

it("clicking Clear button resets input and results", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        items: [{ title: "Test", link: "https://test.com" }],
        queries: {},
      }),
  });

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  const input = screen.getByPlaceholderText("Search...");
  await userEvent.type(input, "query");
  expect(await screen.findByText("Clear")).toBeInTheDocument();

  await userEvent.click(screen.getByText("Clear"));

  expect(input).toHaveValue("");
  expect(screen.getByText("Nothing to show")).toBeInTheDocument();
});
