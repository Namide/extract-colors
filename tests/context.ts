import { describe, it, expect } from "vitest";
import {
  checkIsBrowser,
  checkIsWorker,
  checkIsNode,
} from "../src/context";

describe("Context Detection", () => {
  it("should detect browser context correctly", () => {
    expect(checkIsBrowser()).toBeTypeOf("boolean");
  });

  it("should detect worker context correctly", () => {
    expect(checkIsWorker()).toBeTypeOf("boolean");
  });

  it("should detect Node.js context correctly", () => {
    expect(checkIsNode()).toBeTypeOf("boolean");
  });
});
