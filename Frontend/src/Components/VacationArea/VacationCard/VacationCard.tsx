import { VacationModel } from "../../../Models/VacationModel";
import { formatRange } from "../../../Utils/Date";
import { CardMode } from "../VacationTypes/VacationTypes";
import { Heart, HeartOff } from "lucide-react";
import "./VacationCard.css";

/**
 * Renders a styled vacation card based on the provided vacation data.
 * Supports two display modes:
 * - "user" mode: shows a heart icon to like/unlike the vacation
 * - "admin" mode: shows Edit and Delete buttons for admin controls
 *
 * Props:
 * - `vacation`: The vacation data to display (destination, dates, image, etc.)
 * - `mode`: Determines which set of actions to show ("user" | "admin")
 * - `onLikeToggle?`: Callback triggered when a user likes/unlikes a vacation (user mode only)
 * - `onEdit?`: Callback triggered when admin clicks Edit (admin mode only)
 * - `onDelete?`: Callback triggered when admin clicks Delete (admin mode only)
 *
 * Behavior:
 * - Uses `formatRange()` to format start and end dates
 * - Uses icons from `lucide-react` to display like state (filled heart, gray heart, or heart-off)
 * - Applies conditional classes for visual feedback (liked, others-liked)
 *
 * Styles are handled in the associated VacationCard.css file.
 */


type Props = {
    vacation: VacationModel;
    mode: CardMode; // "user" | "admin"
    onLikeToggle?: (_id: string) => void;
    onEdit?: (_id: string) => void;
    onDelete?: (_id: string) => void;
};

export function VacationCard({ vacation, mode, onLikeToggle, onEdit, onDelete }: Props) {
    const { _id, destination, description, startDate, endDate, price, imageUrl, likesCount, likedByMe } = vacation;

    return (
        <article className="VacationCard" aria-label={`${destination} card`}>
            <div className="media">
                <img src={imageUrl} alt={destination} loading="lazy" />
            </div>

            <header className="header">
                <h3 className="title">{destination}</h3>
                <span className="price">${Number(price).toFixed(2)}</span>
            </header>

            <p className="dates">{formatRange(startDate, endDate)}</p>
            <p className="desc">{description}</p>

            {mode === "user" && (
                <div className="actions">
                    <button
                        type="button"
                        className={`like-button ${likedByMe ? "liked" : ""} ${!likedByMe && likesCount > 0 ? "others-liked" : ""}`}
                        aria-pressed={likedByMe}
                        onClick={() => onLikeToggle?.(_id)}
                    >
                        {likedByMe ? (
                            <Heart size={18} color="red" fill="red" />
                        ) : likesCount > 0 ? (
                            <Heart size={18} color="gray" fill="gray" />
                        ) : (
                            <HeartOff size={18} color="#aaa" />
                        )}

                        <span className="like-count">{likesCount ?? 0}</span>
                    </button>
                </div>
            )}

            {mode === "admin" && (
                <div className="actions">
                    <button type="button" className="edit" onClick={() => onEdit?.(_id)}>Edit</button>
                    <button type="button" className="delete" onClick={() => onDelete?.(_id)}>Delete</button>
                </div>
            )}
        </article>
    );
}
