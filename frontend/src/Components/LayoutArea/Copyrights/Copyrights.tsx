import "./Copyrights.css";

/**
 * Displays a copyright footer at the bottom of the page.
 * 
 * - Shows the current year dynamically.
 * - Styled to appear over background images (e.g. home page slideshow).
 * - Used on public pages like Home, Login, or Register.
 */
export function Copyrights() {
    const year = new Date().getFullYear();
    return (
        <footer className="Copyrights">
            © {year} Skyline Trips · All rights reserved.
        </footer>
    );
}
