import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { useTitle } from "../../../Utils/UseTitle";
import { routes } from "../../../Utils/Routes";
import "./AddVacation.css";
import { useAdminGuard } from "../../../Utils/UseAdminGuard";
import { useState } from "react";

/**
 * Allows admin users to add a new vacation.
 * - Displays a form with validation for all vacation fields.
 * - Requires an image upload.
 * - Sends the vacation to the backend on submit.
 * - Shows a success notification and redirects to admin list.
 */

export function AddVacation() {
    useAdminGuard();
    useTitle("Add Vacation");

    const { register, handleSubmit } = useForm<VacationModel>();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function send(vacation: VacationModel) {

        if (isSubmitting) return;
        setIsSubmitting(true);

        const start = new Date(vacation.startDate as string);
        const end = new Date(vacation.endDate as string);

        const today = new Date();
        const startOnly = new Date(start.toDateString());
        const todayOnly = new Date(today.toDateString());

        if (startOnly < todayOnly) {
            notify.error("Start date cannot be in the past.");
            return;
        }

        if (end < start) {
            notify.error("End date cannot be earlier than start date.");
            return;
        }

        const files = vacation.image as unknown as FileList;

        if (!files || files.length === 0) {
            notify.error("Image is required.");
            return;
        }

        try {
            await vacationService.addVacation({
                destination: vacation.destination,
                description: vacation.description,
                startDate: vacation.startDate,
                endDate: vacation.endDate,
                price: Number(vacation.price),
                image: files[0]
            });

            notify.success("Vacation has been added.");
            navigate(routes.adminVacations);
        } catch {
            notify.error("Failed to add vacation. Please check the form and try again.");
        }
    }

    return (
        <div className="AddVacation">
            <form onSubmit={handleSubmit(send)}>

                <h3>Add Vacation</h3>

                <label>Destination:</label>
                <input type="text" {...register("destination")} required minLength={2} maxLength={60} />

                <label>Description:</label>
                <textarea {...register("description")} required minLength={10} maxLength={1000} rows={4} />

                <label>Start Date:</label>
                <input type="date" {...register("startDate")} required />

                <label>End Date:</label>
                <input type="date" {...register("endDate")} required />

                <label>Price (USD):</label>
                <input type="number" step="0.01" {...register("price")} required min={0} max={10000} />

                <label>Image:</label>
                <input type="file" accept="image/*" {...register("image")} required />

                <button disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add"}
                </button>

            </form>
        </div>
    );
}
