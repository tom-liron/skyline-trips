import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { appConfig } from "./utils/app-config";
import { errorMiddleware } from "./middleware/error-middleware";
import { userController } from "./controllers/user-controller";
import { vacationController } from "./controllers/vacation-controller";
import fileUpload from "express-fileupload";

/**
 * Main application entry point.
 * - Connects to MongoDB.
 * - Configures Express server, middleware, file uploads, and static file saving.
 * - Registers user and vacation controllers.
 * - Sets up error handling middleware.
 * - Starts the HTTP server on the configured port.
 */

class App {
  public async start(): Promise<void> {
    // Connecting to MongoDB:
    await mongoose.connect(appConfig.mongodbConnectionString);

    // Create the server object:
    const server = express();

    server.use(cors()); // Allow access from any client.

    // Tell express to create request.body from the HTTP Request body json:
    server.use(express.json());

    // Tell express to create request.files object containing upload files:
    server.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
      })
    );

    // Listen to controller routes:
    server.use(userController.router);
    server.use(vacationController.router);

    // Route not found middleware:
    server.use(errorMiddleware.routeNotFound);

    // Catch-all middleware:
    server.use(errorMiddleware.catchAll);

    // Run server:
    server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
  }
}

const app = new App();
app.start();
