import { PageChange, PaginationMeta } from "../VacationTypes/VacationTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

/**
 * Displays a numeric pagination control with left/right arrows and page buttons.
 * Accessible, responsive, and reusable across any paginated list.
 *
 * Props:
 * - `meta`: PaginationMeta
 *     Contains current page, page size, total pages, and total count.
 *     Only shown if totalPages > 1.
 *
 * - `onChange`: PageChange
 *     Callback function triggered when a new page is selected.
 *
 * Features:
 * - Automatically generates one button per page (1-based index).
 * - Disables "Previous" when on the first page, and "Next" when on the last.
 * - Highlights the active page.
 * - Uses `aria-current`, `aria-label`, and `role="navigation"` for accessibility.
 *
 * Example usage:
 *   <Pagination meta={meta} onChange={(page) => setPage(page)} />
 */

type Props = {
    meta: PaginationMeta;
    onChange: PageChange;
};

export function Pagination({ meta, onChange }: Props) {
    const { page, totalPages } = meta;
    if (!totalPages || totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="Pagination" role="navigation" aria-label="Pagination">
            <div className="pager">
                <button
                    type="button"
                    className="arrow prev"
                    aria-label="Previous page"
                    disabled={page <= 1}
                    onClick={() => onChange(page - 1)}
                >
                    <ChevronLeft size={20} />
                </button>

                {pages.map((p) => (
                    <button
                        key={p}
                        type="button"
                        className={p === page ? "page-btn active" : "page-btn"}
                        aria-current={p === page ? "page" : undefined}
                        onClick={() => onChange(p)}
                    >
                        {p}
                    </button>
                ))}

                <button
                    type="button"
                    className="arrow next"
                    aria-label="Next page"
                    disabled={page >= totalPages}
                    onClick={() => onChange(page + 1)}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
