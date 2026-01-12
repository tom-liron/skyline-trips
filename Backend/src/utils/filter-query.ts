import { FilterType } from "./filter";
import { ObjectId } from "mongoose";

/**
 * Utility for building MongoDB queries for vacations based on filter type and user.
 * Supports filtering for liked vacations, active vacations, upcoming vacations, or all.
 * Used to dynamically construct queries for vacation endpoints.
 *
 * Example usage:
 *   buildVacationQuery("liked", userId)
 *   buildVacationQuery("active", null)
 */

export function buildVacationQuery(filter: FilterType, userId: ObjectId | null) {
    switch (filter) {
        case "liked":
            return userId ? { likedUserIds: userId } : {};
        case "active":
            const now = new Date();
            return { startDate: { $lte: now }, endDate: { $gte: now } };
        case "upcoming":
            return { startDate: { $gt: new Date() } };
        case "all":
        default:
            return {};
    }
}
