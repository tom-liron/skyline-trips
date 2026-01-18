import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { useTitle } from "../../../Utils/UseTitle";
import { routes } from "../../../Utils/Routes";
import "./EditVacation.css";
import { useAdminGuard } from "../../../Utils/UseAdminGuard";

/**
 * Allows admin users to edit an existing vacation by ID.
 * - Fetches current vacation data and pre-fills the form.
 * - Supports updating all fields including image.
 * - Submits the updated vacation to the backend.
 * - Displays a success message and redirects on success.
 * - Displays the current image if one exists.
 */

export function EditVacation() {
    useAdminGuard();
    useTitle("Edit Vacation");

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const [imageUrl, setImageUrl] = useState<string>("");
    const { register, handleSubmit, setValue } = useForm<VacationModel>();
    const navigate = useNavigate();
    const params = useParams();
    const _id = params._id!;

    useEffect(() => {
        vacationService.getOneVacation(_id)
            .then(vacation => {
                setValue("destination", vacation.destination);
                setValue("description", vacation.description);
                setValue("startDate", vacation.startDate?.slice(0, 10));
                setValue("endDate", vacation.endDate?.slice(0, 10));
                setValue("price", vacation.price);
                setImageUrl(vacation.imageUrl || "");
            })
            .catch(() => {
                notify.error("Failed to load vacation details.")
            });
    }, [_id, setValue]);

    async function send(vacation: VacationModel) {
        if (isSubmitting) return;

        const start = new Date(vacation.startDate);
        const end = new Date(vacation.endDate);

        if (end < start) {
            notify.error("End date cannot be earlier than start date.");
            return;
        }

        try {
            setIsSubmitting(true);

            const file = (vacation.image as unknown as FileList)?.[0] as File | undefined;

            await vacationService.updateVacation(_id, {
                destination: vacation.destination,
                description: vacation.description,
                startDate: String(vacation.startDate).slice(0, 10),
                endDate: String(vacation.endDate).slice(0, 10),
                price: Number(vacation.price),
                ...(file ? { image: file } : {})
            });

            notify.success("Vacation has been updated.");
            navigate(routes.adminVacations);
        } catch {
            notify.error("Failed to update vacation. Please check the form and try again.");
            setIsSubmitting(false);
        }
    }


    return (
        <div className="EditVacation">

            <div className="form-header">

                <button type="button" className="back-btn" onClick={() => navigate(routes.adminVacations)}>
                    ← Back
                </button>

                <h3>Edit Vacation</h3>

            </div>

            <form onSubmit={handleSubmit(send)}>

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

                <label>Image (optional):</label>
                <input type="file" accept="image/*" {...register("image")} />

                {imageUrl && (
                    <img src={imageUrl} alt="Current" className="current-image" />
                )}

                <button disabled={isSubmitting}>
                    Update
                </button>

            </form>
        </div>
    );
}
