import { NO_VALUE_SWIMLANE } from "../support/constants";

/**
 * Read the swimlane property off a file's frontmatter as a list of row
 * values. The property is treated as a list, so a card can belong to
 * multiple rows at once. A bare scalar is coerced into a single-item list.
 */
export function readRowValues(
  frontmatter: Record<string, unknown> | undefined,
  property: string,
): string[] {
  const raw = frontmatter?.[property];
  if (Array.isArray(raw)) {
    return raw
      .filter((v): v is string | number | boolean =>
        ["string", "number", "boolean"].includes(typeof v),
      )
      .map((v) => String(v));
  }
  if (
    typeof raw === "string" ||
    typeof raw === "number" ||
    typeof raw === "boolean"
  ) {
    return [String(raw)];
  }
  return [];
}

/**
 * Title shown for a swimlane row. A wikilink value such as `[[Home]]` or
 * `[[Areas/Home|Home area]]` is shown as its alias or note name, without the
 * brackets; any other value is shown unchanged.
 */
export function displayRowValue(row: string): string {
  const link = /^\[\[([^\]|]*)(?:\|([^\]]*))?\]\]$/.exec(row);
  if (!link) return row;
  const alias = link[2]?.trim();
  if (alias) return alias;
  return (link[1] ?? "").split("/").pop()?.trim() ?? row;
}

/**
 * Move a card from one swimlane row to another, keeping every other row it
 * belongs to untouched. The property stays a single value when it held one
 * (as in `area: "[[Home]]"`) and only becomes a list once a card belongs to
 * several rows. Passing `null` for `fromRow`/`toRow` means "no
 * previous/new row membership to change".
 */
export function replaceRowValue(
  frontmatter: Record<string, unknown>,
  property: string,
  fromRow: string | null,
  toRow: string | null,
): void {
  const current = readRowValues(frontmatter, property);
  const wasList = Array.isArray(frontmatter[property]);
  const next = current.filter(
    (row) => row !== fromRow && row !== NO_VALUE_SWIMLANE,
  );
  if (toRow && toRow !== NO_VALUE_SWIMLANE && !next.includes(toRow)) {
    next.push(toRow);
  }
  if (next.length) {
    // A property that held a single value keeps holding a single value.
    frontmatter[property] = !wasList && next.length === 1 ? next[0] : next;
  } else {
    delete frontmatter[property];
  }
}

/** Add a single row value to a card's swimlane list, e.g. on creation. */
export function addRowValue(
  frontmatter: Record<string, unknown>,
  property: string,
  row: string,
): void {
  if (row === NO_VALUE_SWIMLANE) return;
  const current = readRowValues(frontmatter, property);
  const wasList = Array.isArray(frontmatter[property]);
  if (!current.includes(row)) current.push(row);
  frontmatter[property] =
    !wasList && current.length === 1 ? current[0] : current;
}

/**
 * Whether the row order stored in the view config still belongs to the
 * property now used for swimlanes. Configs written before the order
 * remembered its property (`storedFor` undefined) are assumed to match.
 */
export function storedRowsApply(
  storedFor: string | undefined,
  property: string | null,
): boolean {
  return storedFor === undefined || storedFor === property;
}
