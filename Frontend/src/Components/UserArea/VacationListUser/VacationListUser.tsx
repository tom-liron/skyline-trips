import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiltersBar } from "../../VacationArea/FiltersBar/FiltersBar";
import { VacationCard } from "../../VacationArea/VacationCard/VacationCard";
import { Pagination } from "../../VacationArea/Pagination/Pagination";
import { EmptyState } from "../../VacationArea/EmptyState/EmptyState";
import { useTitle } from "../../../Utils/UseTitle";
import type { VacationFilter, PaginatedVacationsMeta } from "../../../Models/VacationDtos";
import { appConfig } from "../../../Utils/AppConfig";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { VacationListFilter, PaginationMeta } from "../../VacationArea/VacationTypes/VacationTypes";
import type { AppState } from "../../../Redux/Store";
import "./VacationListUser.css";
import { useAuthGuard } from "../../../Utils/UseAuthGuard";

/**
 * Auth-protected vacations page with filtering, pagination, and like support.
 *
 * Behavior:
 * - Guards access (`useAuthGuard`) and sets the document title.
 * - Loads vacations on mount via `vacationService.getVacations`.
 * - Stores pagination metadata locally; the vacations array itself lives in Redux.
 * - `FiltersBar` updates the active filter and resets to page 1.
 * - `Pagination` (top & bottom) changes pages and scrolls to top smoothly.
 * - `EmptyState` appears when no results match the current filter.
 * - A small spinner is shown while requests are in flight.
 * - Likes use optimistic UI (handled in the Redux slice; server confirms).
 *
 * Data flow:
 * - `vacations` are read from Redux (hydrated by the service call).
 * - `PaginatedVacationsMeta` returned from the service updates local pagination state.
 */

export function VacationsListUser() {
    useAuthGuard(); // Redirects unauthenticated users
    useTitle("Vacations"); // Set browser tab title

    // Active filter for vacation list: "all", "liked", etc.
    const [activeFilter, setActiveFilter] = useState<VacationListFilter>("all");

    // Loading indicator while fetching data
    const [isLoading, setIsLoading] = useState(false);

    // Vacations are stored globally in Redux (populated via service call)
    const vacations = useSelector((state: AppState) => state.vacations);

    // Local pagination metadata (not stored in Redux)
    const [pagination, setPagination] = useState<PaginationMeta>({
        page: 1,
        pageSize: appConfig.pageSize,
        totalPages: 1,
        totalCount: 0
    });

    // Load vacations from server (based on current filter + page)
    async function loadVacations(
        nextFilter: VacationFilter = activeFilter,
        nextPage = pagination.page
    ) {
        try {
            setIsLoading(true); // Start spinner

            // Fetch vacations + pagination meta from server
            const serverMeta: PaginatedVacationsMeta = await vacationService.getVacations(
                nextFilter,
                nextPage,
                appConfig.pageSize
            );

            // Update pagination from server response
            setPagination({
                page: serverMeta.page,
                pageSize: serverMeta.pageSize,
                totalPages: serverMeta.totalPages,
                totalCount: serverMeta.totalCount
            });

        } catch (err: any) {
            notify.error(err.message); // Show error message
            setPagination(prev => ({ ...prev, totalPages: 1, totalCount: 0 })); // Reset fallback
        } finally {
            setIsLoading(false); // Stop spinner
        }
    }

    // Load on initial mount
    useEffect(() => {
        loadVacations();
    }, []);

    // When user selects a different filter
    function handleFilterChange(nextFilter: VacationListFilter) {
        setActiveFilter(nextFilter);
        loadVacations(nextFilter, 1); // Reload from first page
    }

    // When user navigates pages
    async function handlePageChange(nextPage: number) {
        await loadVacations(activeFilter, nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on change
    }

    // Optimistic like toggle (Redux handles local update)
    async function handleLikeToggle(vacationId: string) {
        try {
            await vacationService.toggleLike(vacationId); // Server confirms
        } catch (err: any) {
            notify.error(err.message); // Show error if failed
        }
    }

    return (
        <section className="VacationsListUser">

            {/* Top filter bar */}
            <FiltersBar value={activeFilter} onChange={handleFilterChange} />

            {/* Spinner during loading */}
            {isLoading && <div className="spinner" role="status" aria-label="Loading" />}

            {/* Empty state when no vacations match filter */}
            {!isLoading && vacations.length === 0 && (
                <EmptyState message="No vacations match your filters." />
            )}

            {/* Top pagination */}
            <Pagination meta={pagination} onChange={handlePageChange} />

            {/* Vacation grid */}
            <div className="grid">
                {vacations.map(vacation => (
                    <VacationCard
                        key={vacation._id}
                        vacation={vacation}
                        mode="user"
                        onLikeToggle={handleLikeToggle}
                    />
                ))}
            </div>

            {/* Bottom pagination */}
            <Pagination meta={pagination} onChange={handlePageChange} />
        </section>
    );
}
