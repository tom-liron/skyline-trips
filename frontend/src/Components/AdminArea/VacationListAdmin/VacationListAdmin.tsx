import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../../Utils/UseTitle";
import { notify } from "../../../Utils/Notify";
import { appConfig } from "../../../Utils/AppConfig";
import { routes } from "../../../Utils/Routes";
import type { AppState } from "../../../Redux/Store";
import type { PaginatedVacationsMeta } from "../../../Models/VacationDtos";
import { vacationService } from "../../../Services/VacationService";
import { Pagination } from "../../VacationArea/Pagination/Pagination";
import { EmptyState } from "../../VacationArea/EmptyState/EmptyState";
import "./VacationListAdmin.css";
import { VacationCard } from "../../VacationArea/VacationCard/VacationCard";
import { useAdminGuard } from "../../../Utils/UseAdminGuard";

/**
 * Admin-only vacation management page.
 *
 * Behavior:
 * - Guards access to admin users only (`useAdminGuard`).
 * - Sets the document title ("Manage Vacations").
 * - Loads paginated vacation data from the server via `vacationService.getVacations`.
 * - Displays a spinner while loading and an empty state if no vacations exist.
 * - Shows two `Pagination` controls (top and bottom).
 * - Renders each vacation with an admin-mode `VacationCard` (with edit/delete support).
 * - Clicking "Edit" navigates to the edit route (replacing :_id).
 * - Clicking "Delete" shows a confirm dialog and deletes the vacation, then refreshes the page.
 *
 * Data flow:
 * - `vacations` are read from Redux (hydrated by the service).
 * - `pagination` is local state derived from the server response (`PaginatedVacationsMeta`).
 * - Page changes and deletions re-trigger `load()` to keep pagination metadata accurate.
 *
 * User experience:
 * - Scrolls to top on page change.
 * - Notifies user of errors or successful deletion using the `notify` utility.
 */

export function VacationListAdmin() {
    useAdminGuard(); // Redirects non-admins away
    useTitle("Manage Vacations"); // Set page title

    const navigate = useNavigate();

    // Read vacation list from Redux store
    const vacations = useSelector((state: AppState) => state.vacations);

    // Local UI state
    const [isLoading, setIsLoading] = useState(false);      // Show spinner
    const [currentPage, setCurrentPage] = useState(1);       // Current page
    const [pagination, setPagination] = useState({          // Pagination meta (synced with server)
        page: 1,
        pageSize: appConfig.pageSize,
        totalPages: 1,
        totalCount: 0,
    });

    // Load paginated vacations from server
    async function load(pageToLoad = currentPage) {
        try {
            setIsLoading(true);

            // Always use "all" filter for admin view
            const serverMeta: PaginatedVacationsMeta =
                await vacationService.getVacations("all", pageToLoad, appConfig.pageSize);

            // Update pagination state from response
            setPagination({
                page: serverMeta.page,
                pageSize: serverMeta.pageSize,
                totalPages: serverMeta.totalPages,
                totalCount: serverMeta.totalCount,
            });

        } catch {
            notify.error("Failed to load vacations.");
            setPagination(prev => ({ ...prev, totalPages: 1, totalCount: 0 }));
        } finally {
            setIsLoading(false);
        }
    }

    // Load vacations on initial mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        load(1);
    }, []);

    // Handle pagination click
    async function handlePageChange(nextPage: number) {
        setCurrentPage(nextPage);
        await load(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
    }

    // Navigate to edit page for a given vacation
    function handleEdit(_id: string) {
        navigate(routes.adminEditVacation.replace(":_id", _id));
    }

    // Delete vacation (with confirmation), then reload page
    async function handleDelete(vacationId: string) {
        if (!confirm("Delete this vacation?")) return;

        try {
            await vacationService.deleteVacation(vacationId); // Server + Redux update
            notify.success("Vacation has been deleted.");
            await load(currentPage); // Refresh page in case last item was deleted
        } catch {
            notify.error("Failed to delete vacation.");
        }
    }

    return (
        <section className="VacationListAdmin">

            {/* Spinner while loading */}
            {isLoading && <div className="spinner" role="status" aria-label="Loading" />}

            {/* Empty state if list is empty */}
            {!isLoading && vacations.length === 0 && (
                <EmptyState message="No vacations yet." />
            )}

            {/* Pagination at top */}
            <Pagination meta={pagination} onChange={handlePageChange} />

            {/* Vacation cards grid */}
            <div className="grid">
                {vacations.map(vacation => (
                    <VacationCard
                        key={vacation._id}
                        vacation={vacation}
                        mode="admin"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Pagination at bottom */}
            <Pagination meta={pagination} onChange={handlePageChange} />
        </section>
    );
}
