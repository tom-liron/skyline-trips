import express, { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { fileSaver } from "uploaded-file-saver";
import { VacationModel } from "../3-models/vacation-model";
import { StatusCode } from "../3-models/status-code";
import { vacationService } from "../4-services/vacation-service";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { FilterType, parseFilter } from "../2-utils/filter";
import { parsePage, parsePageSize } from "../2-utils/pagination";
import { preventAdminLike } from "../6-middleware/role-middleware";
import { serializeVacation, serializeVacations } from "../2-utils/vacation-serializer";

/**
 * Express controller for vacation-related API endpoints.
 * Handles CRUD operations, likes, image serving, and admin reporting.
 * Applies authentication, authorization, and XSS prevention middleware as needed.
 */

class VacationController {

    public router: Router = express.Router();

    public constructor() {
        // Public routes for logged-in users
        this.router.get("/api/vacations", securityMiddleware.verifyToken, this.getVacations);
        this.router.get("/api/vacations/:_id", securityMiddleware.verifyToken, this.getOneVacation);
        this.router.post("/api/vacations/:_id/like", securityMiddleware.verifyToken, preventAdminLike, this.likeVacation);
        this.router.delete("/api/vacations/:_id/like", securityMiddleware.verifyToken, preventAdminLike, this.unlikeVacation);

        // Public route for serving vacation images by filename
        this.router.get("/api/vacations/images/:imageName", this.getImage);

        // Admin routes
        this.router.post("/api/vacations", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, securityMiddleware.preventXssAttack, this.addVacation);
        this.router.patch("/api/vacations/:_id", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, securityMiddleware.preventXssAttack, this.updateVacation);
        this.router.delete("/api/vacations/:_id", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, this.deleteVacation);
        this.router.get("/api/vacations/report/csv", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, this.getReportCSV);
        this.router.get("/api/vacations/report/json", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, this.getReportJSON);
    }

    // Get paginated vacations with filtering for the current user
    private async getVacations(request: Request, response: Response) {
        const filter: FilterType = parseFilter(request.query.filter);
        const page = parsePage(request.query.page as string | undefined);
        const pageSize = parsePageSize(request.query.pageSize as string | undefined);
        const userId = response.locals.user?._id;

        const { vacations, totalCount } = await vacationService.getVacations(filter, userId, page, pageSize);

        response.json({
            vacations: serializeVacations(vacations, userId),
            page,
            pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
        });
    }

    // Get a single vacation by id for the current user
    private async getOneVacation(request: Request, response: Response) {
        const _id = request.params._id;
        const vacation = await vacationService.getOneVacation(_id);
        response.json(serializeVacation(vacation, response.locals.user._id));
    }

    // Add a new vacation (admin only)
    private async addVacation(request: Request, response: Response) {
        const vacation = new VacationModel(request.body);
        const image = request.files?.image as UploadedFile;
        const dbVacation = await vacationService.addVacation(vacation, image);
        response.status(StatusCode.Created).json(dbVacation);
    }

    // Update an existing vacation (admin only)
    private async updateVacation(request: Request, response: Response) {
        request.body._id = request.params._id;
        const vacation = new VacationModel(request.body);
        const image = request.files?.image as UploadedFile;
        const dbVacation = await vacationService.updateVacation(vacation, image);
        response.json(dbVacation);
    }

    // Delete a vacation (admin only)
    private async deleteVacation(request: Request, response: Response) {
        const _id = request.params._id;
        await vacationService.deleteVacation(_id);
        response.sendStatus(StatusCode.NoContent);
    }

    // Like a vacation (user only, admin prevented)
    private async likeVacation(request: Request, response: Response) {
        const v = await vacationService.likeVacation(request.params._id, response.locals.user._id);
        response.json(serializeVacation(v, response.locals.user._id));
    }

    // Unlike a vacation (user only, admin prevented)
    private async unlikeVacation(request: Request, response: Response) {
        const v = await vacationService.unlikeVacation(request.params._id, response.locals.user._id);
        response.json(serializeVacation(v, response.locals.user._id));
    }

    // Serve an image file for a vacation
    private async getImage(request: Request, response: Response) {
        const imageName = request.params.imageName;
        const imagePath = fileSaver.getFilePath(imageName);
        response.sendFile(imagePath);
    }

    // Generate and return a CSV report of vacations (admin only)
    private async getReportCSV(request: Request, response: Response) {
        try {
            const csvData = await vacationService.generateVacationsReportCSV();

            response
                .type("csv")
                .attachment("vacations-report.csv")
                .send(csvData);
        } catch (err) {
            response.status(StatusCode.InternalServerError).json({ message: "Failed to generate CSV report." });
        }
    }

    // Generate and return a JSON report of vacations (admin only)
    private async getReportJSON(request: Request, response: Response) {
        try {
            const report = await vacationService.getVacationsReport();
            response.json(report);
        } catch (err) {
            response.status(StatusCode.InternalServerError).json({ message: "Failed to generate report." });
        }
    }

}

export const vacationController = new VacationController();
