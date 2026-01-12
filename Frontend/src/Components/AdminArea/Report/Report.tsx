import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./Report.css";
import { useTitle } from "../../../Utils/UseTitle";
import { useAdminGuard } from "../../../Utils/UseAdminGuard";

/**
 * Admin-only analytics page for vacation likes.
 *
 * Behavior:
 * - Protects access using `useAdminGuard`.
 * - Sets document title to "Reports".
 * - Fetches vacation likes report on mount from `vacationService.getReportJSON`.
 * - Allows downloading the full report as CSV (`vacationService.downloadCSV()`).
 * - Displays a responsive vertical bar chart using Recharts.
 * - Shows a spinner while loading data.
 *
 * Data flow:
 * - The report data is a list of objects: `{ destination, likes }[]`.
 * - The `rows` state holds the original server data.
 * - `sorted` memoizes the rows sorted by like count (descending).
 * - `maxLikes` memoizes the highest like count (used to set X-axis domain).
 *
 * UI/UX:
 * - A `<TooltipContent>` component renders custom tooltips on hover.
 * - A scrollable chart card adjusts height dynamically based on row count.
 * - Bar chart is fully accessible (`role="img"` with ARIA label).
 *
 * Technologies:
 * - Uses Recharts components: `BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, etc.
 * - Styled using `Report.css`.
 */

type Row = { destination: string; likes: number };

export function Report() {
    useAdminGuard();
    useTitle("Reports");

    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await vacationService.getReportJSON();
                setRows(data);
            } catch {
                notify.error("Failed to load report data.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const sorted = useMemo(() => {
        return [...rows].sort((a, b) => b.likes - a.likes);
    }, [rows]);

    const maxLikes = useMemo(() => Math.max(1, ...sorted.map(r => r.likes)), [sorted]);

    const TooltipContent = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null;
        const likes = payload[0].value;
        return (
            <div className="report-tooltip" role="dialog" aria-label={`${label}: ${likes} likes`}>
                <div className="report-tooltip__title">{label}</div>
                <div className="report-tooltip__row">
                    <span>Likes</span>
                    <strong>{likes}</strong>
                </div>
            </div>
        );
    };

    return (
        <section className="Report">
            <header className="toolbar">
                <h2>Likes Report</h2>
                <button className="primary" onClick={() => vacationService.downloadCSV()}>
                    Download CSV
                </button>
            </header>

            {loading && <div className="spinner" role="status" aria-label="Loading" />}

            {!loading && (
                <div className="chart-card" role="img" aria-label="Bar chart of likes per destination">
                    <h3>Likes by Destination</h3>

                    {/* Scroll container */}
                    <div className="chart-scroll">
                        <ResponsiveContainer width="100%" height={Math.max(260, sorted.length * 40)}>
                            <BarChart
                                data={sorted}
                                layout="vertical"
                                margin={{ top: 8, right: 20, left: 80, bottom: 8 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" allowDecimals={false} domain={[0, Math.ceil(maxLikes)]} />
                                <YAxis
                                    type="category"
                                    dataKey="destination"
                                    width={120} /* reserve space for long names */
                                />
                                <Tooltip content={<TooltipContent />} />
                                <Bar dataKey="likes" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </section>
    );
}
