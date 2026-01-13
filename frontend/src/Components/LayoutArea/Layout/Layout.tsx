// src/components/LayoutArea/Layout/Layout.tsx
import { useLocation } from "react-router-dom";
import { Header } from "../Header/Header";
import { Routing } from "../Routing/Routing";
import { routes } from "../../../Utils/Routes";
import "./Layout.css";

/**
 * Root layout component that wraps the entire app UI.
 * 
 * - Displays the `<Header />` on all pages except Home and Auth routes.
 * - Renders the main `<Routing />` area for page content.
 * - Encapsulated inside a div with class "Layout" for layout-specific styling.
 */

export function Layout() {
    const { pathname } = useLocation();

    // Still hide header on home/auth if you want:
    const hideHeader = pathname === routes.home || pathname.startsWith("/auth");

    return (
        <div className="Layout">
            {!hideHeader && (
                <header>
                    <Header />
                </header>
            )}

            <main className="Main">
                <Routing />
            </main>

        </div>
    );
}
