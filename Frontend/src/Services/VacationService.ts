import axios, { type AxiosRequestConfig } from "axios";
import type { VacationModel } from "../Models/VacationModel";
import { store } from "../Redux/Store";
import { vacationSlice } from "../Redux/VacationSlice";
import { appConfig } from "../Utils/AppConfig";
import type { AddVacationDto, UpdateVacationDto, VacationFilter, PaginatedVacationsMeta } from "../Models/VacationDtos";

/**
 * VacationService manages all vacation-related operations on the frontend.
 *
 * Handles:
 * - Fetching paginated vacation lists
 * - Getting individual vacation details
 * - Liking/unliking vacations with optimistic updates
 * - Admin operations: adding, editing, deleting, exporting reports
 *
 * Optimistic UI:
 * For fast user feedback, some actions (like "like/unlike") update the UI
 * immediately — assuming success — and roll back only if the server fails.
 *
 * All data is synced with the Redux store and backend API endpoints.
 *
 * Example usage:
 *   await vacationService.getVacations(filter, page, pageSize);
 *   await vacationService.addVacation(dto);
 *   await vacationService.toggleLike(vacationId);
 *   await vacationService.downloadCSV();
 */

interface PaginatedResponse {
  vacations: VacationModel[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

class VacationService {
  /**
   * Fetch one page of vacations based on filter and pagination.
   * Saves the vacation list to Redux and returns pagination metadata
   * * Helps the frontend show page numbers and total pages in the UI.
   */
  public async getVacations(
    filter: VacationFilter,
    page: number,
    pageSize = appConfig.pageSize
  ): Promise<PaginatedVacationsMeta> {
    try {
      const response = await axios.get<PaginatedResponse>(appConfig.vacationsUrl, {
        params: { filter, page, pageSize },
      });

      const { vacations, page: serverPage, pageSize: serverPageSize, totalPages, totalCount } = response.data;

      // Update Redux with the fetched vacations
      store.dispatch(vacationSlice.actions.initVacations(vacations));

      // Return pagination info for frontend usage
      return { page: serverPage, pageSize: serverPageSize, totalPages, totalCount };
    } catch {
      throw new Error("Failed to load vacations. Please try again.");
    }
  }

  /**
   * Fetch a single vacation by ID.
   * Checks Redux store first before calling the backend.
   */
  public async getOneVacation(_id: string): Promise<VacationModel> {
    const vacationFromStore = store.getState().vacations.find((v) => v._id === _id);
    if (vacationFromStore) return vacationFromStore;

    try {
      const { data } = await axios.get<VacationModel>(appConfig.vacationsUrl + _id);
      return data;
    } catch {
      throw new Error("Failed to load vacation details.");
    }
  }

  /**
   * Like or unlike a vacation using optimistic UI updates.
   * Immediately toggles the like state in Redux, then confirms with server.
   * If the request fails, the change is rolled back.
   */
  public async toggleLike(_id: string): Promise<void> {
    const wasLiked = !!store.getState().vacations.find((v) => v._id === _id)?.likedByMe;

    // Optimistically update UI
    store.dispatch(vacationSlice.actions.toggleLikeOptimistic(_id));

    try {
      const { data: updated } = wasLiked
        ? await axios.delete<VacationModel>(appConfig.vacationsUrl + `${_id}/like`)
        : await axios.post<VacationModel>(appConfig.vacationsUrl + `${_id}/like`);

      // Update with confirmed server data
      store.dispatch(vacationSlice.actions.updateVacation(updated));
    } catch {
      // Revert optimistic change on failure
      store.dispatch(vacationSlice.actions.toggleLikeOptimistic(_id));
      throw new Error("Failed to toggle like");
    }
  }

  /**
   * Admin only: Add a new vacation.
   * Sends a multipart/form-data request including the image file.
   */
  public async addVacation({
    destination,
    description,
    startDate,
    endDate,
    price,
    image,
  }: AddVacationDto): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("destination", destination);
      formData.append("description", description);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("price", String(price));
      formData.append("image", image);

      const requestOptions: AxiosRequestConfig = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post<VacationModel>(appConfig.vacationsUrl, formData, requestOptions);

      store.dispatch(vacationSlice.actions.addVacation(data));
    } catch {
      throw new Error("Failed to add vacation. Please check the form and try again.");
    }
  }

  /**
   * Admin only: Update an existing vacation.
   * Uses PATCH with multipart/form-data.
   * Image is optional – only appended if provided.
   */
  public async updateVacation(
    _id: string,
    { destination, description, startDate, endDate, price, image }: UpdateVacationDto
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("destination", destination);
      formData.append("description", description);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("price", String(price));
      if (image) formData.append("image", image);

      const requestOptions: AxiosRequestConfig = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.patch<VacationModel>(appConfig.vacationsUrl + _id, formData, requestOptions);

      store.dispatch(vacationSlice.actions.updateVacation(data));
    } catch {
      throw new Error("Failed to update vacation. Please check the form and try again.");
    }
  }

  /**
   * Admin only: Delete a vacation by ID.
   * Also removes it from the Redux store.
   */
  public async deleteVacation(_id: string): Promise<void> {
    try {
      await axios.delete(appConfig.vacationsUrl + _id);
      store.dispatch(vacationSlice.actions.deleteVacation(_id));
    } catch {
      throw new Error("Failed to delete vacation. Please try again later.");
    }
  }

  /**
   * Admin only: Fetch report data as JSON (e.g., for charts).
   * Returns an array of { destination, likes } objects.
   */
  public async getReportJSON(): Promise<Array<{ destination: string; likes: number }>> {
    try {
      const { data } = await axios.get<Array<{ destination: string; likes: number }>>(appConfig.vacationsReportJsonUrl);
      return data;
    } catch {
      throw new Error("Failed to load report data.");
    }
  }

  /**
   * Admin only: Download report as a CSV file.
   * Triggers download in the browser.
   */
  public async downloadCSV(fileName = "vacations-report.csv"): Promise<void> {
    try {
      const { data: blob } = await axios.get<Blob>(appConfig.vacationsReportCsvUrl, { responseType: "blob" });

      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      throw new Error("Failed to download report.");
    }
  }
}

export const vacationService = new VacationService();
