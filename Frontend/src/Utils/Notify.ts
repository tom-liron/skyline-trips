import { errorExtractor } from "error-extractor";
import { Notyf } from "notyf";

/**
 * Notification utility for displaying success and error messages in the UI.
 * Uses Notyf for toast notifications and error-extractor for consistent error messages.
 * Use the exported `notify` singleton throughout the frontend.
 *
 * Example usage:
 *   notify.success("Vacation added!");
 *   notify.error(error);
 */

class Notify {

    private notyf = new Notyf({
        duration: 3000,
        position: { x: "center", y: "top" },
        dismissible: true
    });

    public success(message: string): void {
        this.notyf.success(message);
    }

    public error(err: any): void {
        const message = errorExtractor.getMessage(err);
        this.notyf.error(message);
    }

}

export const notify = new Notify();
