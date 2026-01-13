import { VacationListFilter } from "../VacationTypes/VacationTypes";
import "./FiltersBar.css";

/**
 * Displays a horizontal set of buttons for filtering vacations.
 * Built using the VacationListFilter type: "all" | "liked" | "active" | "upcoming".
 *
 * Props:
 * - `value`: The currently selected filter.
 * - `onChange`: Callback triggered when a new filter is selected.
 *
 * Features:
 * - Highlights the active filter button
 * - Accessible via keyboard and screen readers (`aria-current`, `aria-label`)
 * - Uses labels map for friendly display text
 *
 * Example usage:
 *   <FiltersBar value={filter} onChange={setFilter} />
 */

type Props = {
    value: VacationListFilter;
    onChange: (value: VacationListFilter) => void;
};

// Display text for each filter option
const labels: Record<VacationListFilter, string> = {
    all: "All Vacations",
    liked: "My Likes",
    active: "Active Now",
    upcoming: "Upcoming"
};

export function FiltersBar({ value, onChange }: Props) {
    const items: VacationListFilter[] = ["all", "liked", "active", "upcoming"];

    return (
        <nav className="FiltersBar" aria-label="Vacation filters">
            {items.map((f) => (
                <button
                    key={f}
                    type="button"
                    className={f === value ? "active" : ""}
                    aria-current={f === value ? "true" : undefined}
                    onClick={() => onChange(f)}
                >
                    {labels[f]}
                </button>
            ))}
        </nav>
    );
}
