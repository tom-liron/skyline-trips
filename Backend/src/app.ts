import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { appConfig } from "./2-utils/app-config";
import { errorMiddleware } from "./6-middleware/error-middleware";
import { userController } from "./5-controllers/user-controller";
import { vacationController } from "./5-controllers/vacation-controller";
import fileUpload from "express-fileupload";
import path from "path";
import { fileSaver } from "uploaded-file-saver";

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
        server.use(fileUpload());

        // Configure fileSaver regarding where to save the files: 
        const location = path.join(__dirname, "1-assets", "images");
        fileSaver.config(location);

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


