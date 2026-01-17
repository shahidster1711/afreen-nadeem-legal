import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./HeroSection";

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children }) => <div>{children}</div>,
      h1: ({ children }) => <h1>{children}</h1>,
      p: ({ children }) => <p>{children}</p>,
    },
  };
});

describe("HeroSection", () => {
  it("should render the hero section", () => {
    render(<HeroSection />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
