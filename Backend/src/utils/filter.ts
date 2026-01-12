/**
 * Defines vacation filter types and provides a utility to safely parse filter values.
 * Used to validate and normalize filter query parameters for vacation endpoints.
 *
 * Example usage:
 *   const filter = parseFilter(req.query.filter);
 */

export type FilterType = "all" | "liked" | "active" | "upcoming";

export function parseFilter(value: unknown): FilterType { // unknown? ?
  const allowedFilters: FilterType[] = ["all", "liked", "active", "upcoming"];

  if (typeof value === "string" && allowedFilters.includes(value as FilterType)) {
    return value as FilterType;
  }

  return "all";
}
