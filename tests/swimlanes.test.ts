import { describe, expect, it } from "vitest";
import {
  addRowValue,
  displayRowValue,
  readRowValues,
  replaceRowValue,
  storedRowsApply,
} from "../src/board/swimlanes";

describe("swimlane row values", () => {
  it("reads a list property as an array of strings", () => {
    expect(readRowValues({ lanes: ["Alice", "Bob"] }, "lanes")).toEqual([
      "Alice",
      "Bob",
    ]);
  });

  it("coerces a bare scalar into a single-item list", () => {
    expect(readRowValues({ lanes: "Alice" }, "lanes")).toEqual(["Alice"]);
    expect(readRowValues({ lanes: 3 }, "lanes")).toEqual(["3"]);
  });

  it("returns an empty list when the property is absent", () => {
    expect(readRowValues({}, "lanes")).toEqual([]);
    expect(readRowValues(undefined, "lanes")).toEqual([]);
  });

  it("adds a row value without disturbing existing ones", () => {
    const fm: Record<string, unknown> = { lanes: ["Alice"] };
    addRowValue(fm, "lanes", "Bob");
    expect(fm.lanes).toEqual(["Alice", "Bob"]);
  });

  it("does not duplicate a row value already present", () => {
    const fm: Record<string, unknown> = { lanes: ["Alice"] };
    addRowValue(fm, "lanes", "Alice");
    expect(fm.lanes).toEqual(["Alice"]);
  });

  it("replaces one row with another, keeping the rest untouched", () => {
    const fm: Record<string, unknown> = { lanes: ["Alice", "Bob", "Carol"] };
    replaceRowValue(fm, "lanes", "Bob", "Dave");
    expect(fm.lanes).toEqual(["Alice", "Carol", "Dave"]);
  });

  it("just removes the row when moving to no value", () => {
    const fm: Record<string, unknown> = { lanes: ["Alice", "Bob"] };
    replaceRowValue(fm, "lanes", "Bob", null);
    expect(fm.lanes).toEqual(["Alice"]);
  });

  it("deletes the property entirely once the list becomes empty", () => {
    const fm: Record<string, unknown> = { lanes: ["Bob"] };
    replaceRowValue(fm, "lanes", "Bob", null);
    expect(fm.lanes).toBeUndefined();
  });

  it("just adds the row when there was no previous membership", () => {
    const fm: Record<string, unknown> = {};
    replaceRowValue(fm, "lanes", null, "Alice");
    expect(fm.lanes).toBe("Alice");
  });

  it("keeps a single value single when moving between rows", () => {
    const fm: Record<string, unknown> = { lanes: "[[Home]]" };
    replaceRowValue(fm, "lanes", "[[Home]]", "[[Work]]");
    expect(fm.lanes).toBe("[[Work]]");
  });

  it("keeps a list a list when it ends up with one value", () => {
    const fm: Record<string, unknown> = { lanes: ["Alice", "Bob"] };
    replaceRowValue(fm, "lanes", "Alice", null);
    expect(fm.lanes).toEqual(["Bob"]);
  });

  it("turns a single value into a list only when a second row is added", () => {
    const fm: Record<string, unknown> = { lanes: "Alice" };
    addRowValue(fm, "lanes", "Alice");
    expect(fm.lanes).toBe("Alice");
    addRowValue(fm, "lanes", "Bob");
    expect(fm.lanes).toEqual(["Alice", "Bob"]);
  });

  it("adds a first row as a single value", () => {
    const fm: Record<string, unknown> = {};
    addRowValue(fm, "lanes", "Alice");
    expect(fm.lanes).toBe("Alice");
  });
});

describe("swimlane row titles", () => {
  it("shows a wikilink as its note name", () => {
    expect(displayRowValue("[[Home]]")).toBe("Home");
    expect(displayRowValue("[[Areas/Home]]")).toBe("Home");
  });

  it("prefers the alias of a wikilink", () => {
    expect(displayRowValue("[[Areas/Home|Home area]]")).toBe("Home area");
  });

  it("leaves other values unchanged", () => {
    expect(displayRowValue("Alice")).toBe("Alice");
    expect(displayRowValue("Home [[draft]]")).toBe("Home [[draft]]");
  });
});

describe("stored swimlane rows", () => {
  it("apply when they were saved for the same property", () => {
    expect(storedRowsApply("area", "area")).toBe(true);
  });

  it("apply to configs that never recorded a property", () => {
    expect(storedRowsApply(undefined, "area")).toBe(true);
  });

  it("do not apply once another property is picked", () => {
    expect(storedRowsApply("area", "status")).toBe(false);
    expect(storedRowsApply("area", null)).toBe(false);
  });
});
