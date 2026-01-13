import "./EmptyState.css";

/**
 * Renders a friendly placeholder for empty UI states, such as when no data is available.
 *
 * Props:
 * - `message` (optional): Text to display. Defaults to "No results found."
 * - `actionText` (optional): Label for an optional action button.
 * - `onAction` (optional): Callback when the action button is clicked.
 * - `icon` (optional): Optional React icon or visual node to display.
 * - `role` (optional): ARIA live role, either "status" (default) or "alert".
 *
 * Usage:
 * - Commonly used in lists, search results, or fallback views.
 * - Accessible for screen readers via `role` and `aria-live`.
 *
 * Example:
 *   <EmptyState
 *     message="No vacations found."
 *     icon={<PlaneIcon />}
 *     actionText="Reload"
 *     onAction={reload}
 *   />
 */

type EmptyStateProps = {
    message?: string;
    actionText?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
    role?: "status" | "alert"; // default "status"
};

export function EmptyState({
    message = "No results found.",
    actionText,
    onAction,
    icon,
    role = "status"
}: EmptyStateProps) {
    return (
        <div className="EmptyState" role={role} aria-live={role === "alert" ? "assertive" : "polite"}>
            {icon && <div className="icon">{icon}</div>}
            <p>{message}</p>
            {actionText && onAction && (
                <button type="button" onClick={onAction}>{actionText}</button>
            )}
        </div>
    );
}
