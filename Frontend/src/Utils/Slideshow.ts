/**
 * Utility functions for slideshow features.
 * - `shuffle`: Returns a new array with elements shuffled (Fisher–Yates algorithm).
 * - `preloadImages`: Preloads image URLs to improve slideshow transitions.
 *
 * Example usage:
 *   const images = shuffle(imageArray);
 *   preloadImages(images);
 */

/** Fisher–Yates shuffle (returns a new array; input stays untouched). */
export function shuffle<T>(arr: readonly T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/** Preload images to smooth first transitions. */
export function preloadImages(paths: readonly string[]): void {
    paths.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}
