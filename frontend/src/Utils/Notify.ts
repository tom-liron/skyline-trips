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
    dismissible: true,
  });

  public success(message: string): void {
    this.notyf.success(message);
  }

  public error(err: any): void {
    console.log("Notify.error -> received", err);

    const message = typeof err === "string" ? err : errorExtractor.getMessage(err) || "Something went wrong";

    console.log("Notify.error -> extracted message", message);

    try {
      const result = this.notyf.error(message);
      console.log("Notify.error -> notyf.error returned", result);
    } catch (innerErr) {
      console.log("Notify.error -> notyf.error threw", innerErr);
    }

    setTimeout(() => {
      console.log("Notify.error -> DOM error toasts count", document.querySelectorAll(".notyf__toast--error").length);
      console.log("Notify.error -> DOM all toasts count", document.querySelectorAll(".notyf__toast").length);
    }, 100);
  }
}

export const notify = new Notify();
