import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VacationModel } from "../Models/VacationModel";

/**
 * Replaces the vacation list with a new array.
 */
function initVacations(_state: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    return action.payload;
}

/**
 * Adds a new vacation to the list.
 */
function addVacation(state: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    return [...state, action.payload];
}

/**
 * Updates an existing vacation by ID.
 * Replaces the matching item with the updated data.
 */
function updateVacation(state: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const updatedVacation = action.payload;
    const index = state.findIndex(v => v._id === updatedVacation._id);
    if (index === -1) return state;

    const updatedState = [...state];
    updatedState[index] = updatedVacation;
    return updatedState;
}

/**
 * Deletes a vacation by its ID.
 */
function deleteVacation(state: VacationModel[], action: PayloadAction<string>): VacationModel[] {
    return state.filter(v => v._id !== action.payload);
}

/**
 * Optimistically toggles the like/unlike state of a vacation.
 * - Increases/decreases the likes count
 * - Toggles the likedByMe boolean
 */
function toggleLikeOptimistic(state: VacationModel[], action: PayloadAction<string>): VacationModel[] {
    return state.map(vacation => {
        if (vacation._id !== action.payload) return vacation;

        const isLikedByMe = !vacation.likedByMe;
        const nextLikesCount = Math.max(0, (vacation.likesCount ?? 0) + (isLikedByMe ? 1 : -1));
        return { ...vacation, likedByMe: isLikedByMe, likesCount: nextLikesCount };
    });
}

/**
 * Redux slice for managing vacation data.
 * Includes actions:
 * - initVacations: Set vacation list
 * - addVacation: Add a new vacation
 * - updateVacation: Modify an existing vacation
 * - deleteVacation: Remove a vacation
 * - toggleLikeOptimistic: Optimistically toggle like/unlike state
 */
export const vacationSlice = createSlice({
    name: "vacations",
    initialState: [] as VacationModel[],
    reducers: {
        initVacations,
        addVacation,
        updateVacation,
        deleteVacation,
        toggleLikeOptimistic,
    },
});

export default vacationSlice.reducer;
