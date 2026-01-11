import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { useTitle } from "../../../Utils/UseTitle";
import { routes } from "../../../Utils/Routes";
import "./AddVacation.css";
import { useAdminGuard } from "../../../Utils/UseAdminGuard";

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

    async function send(vacation: VacationModel) {
        try {
            const file = (vacation.image as unknown as FileList)?.[0] as File; // required
            await vacationService.addVacation({
                destination: vacation.destination,
                description: vacation.description,
                startDate: vacation.startDate,
                endDate: vacation.endDate,
                price: Number(vacation.price),
                image: file
            });
            notify.success("Vacation has been added.");
            navigate(routes.adminVacations);
        }
        catch (err: any) { notify.error(err); }
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

                <button>Add</button>
            </form>
        </div>
    );
}
