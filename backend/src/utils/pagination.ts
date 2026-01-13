/**
 * Utilities for parsing pagination parameters from query strings.
 * Ensures page and page size are positive integers, with sensible defaults.
 * Used to standardize pagination logic in vacation endpoints.
 *
 * Example usage:
 *   const page = parsePage(req.query.page);
 *   const pageSize = parsePageSize(req.query.pageSize);
 */

export function parsePage(value: string | undefined): number {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

export function parsePageSize(value: string | undefined): number {
    const size = Number(value);
    return Number.isInteger(size) && size > 0 ? size : 9;
}