import { useEffect } from "react";

/**
 * React hook to set the document title for the current page.
 * Prefixes the title with "Skyline Trips | ".
 * Intended for use in page components.
 *
 * Example usage:
 *   useTitle("Vacations");
 */

export function useTitle(title: string): void {
    useEffect(() => {
        document.title = `Skyline Trips | ${title}`;
    }, []);
}
