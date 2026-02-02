import express, { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { VacationModel } from "../models/vacation-model";
import { StatusCode } from "../models/status-code";
import { vacationService } from "../services/vacation-service";
import { securityMiddleware } from "../middleware/security-middleware";
import { FilterType, parseFilter } from "../utils/filter";
import { parsePage, parsePageSize } from "../utils/pagination";
import { preventAdminLike } from "../middleware/role-middleware";
import { serializeVacation, serializeVacations } from "../utils/vacation-serializer";

/**
 * Express controller for vacation-related API endpoints.
 * Handles CRUD operations, likes, and admin reporting.
 * * Applies authentication and authorization middleware as needed.
 */

class VacationController {
  public router: Router = express.Router();

  public constructor() {
    // Public routes for logged-in users
    this.router.get(
      "/api/vacations",
      securityMiddleware.verifyToken,
      this.getVacations
    );

    this.router.get(
      "/api/vacations/:_id",
      securityMiddleware.verifyToken,
      this.getOneVacation
    );

    this.router.post(
      "/api/vacations/:_id/like",
      securityMiddleware.verifyToken,
      preventAdminLike,
      this.likeVacation
    );

    this.router.delete(
      "/api/vacations/:_id/like",
      securityMiddleware.verifyToken,
      preventAdminLike,
      this.unlikeVacation
    );
      
    // Admin routes
    this.router.post(
      "/api/vacations",
      securityMiddleware.verifyToken,
      securityMiddleware.verifyAdmin,
      this.addVacation,
    );

    this.router.patch(
      "/api/vacations/:_id",
      securityMiddleware.verifyToken,
      securityMiddleware.verifyAdmin,
      this.updateVacation,
    );

    this.router.delete(
      "/api/vacations/:_id",
      securityMiddleware.verifyToken,
      securityMiddleware.verifyAdmin,
      this.deleteVacation,
    );

    this.router.get(
      "/api/vacations/report/csv",
      securityMiddleware.verifyToken,
      securityMiddleware.verifyAdmin,
      this.getReportCSV,
    );

    this.router.get(
      "/api/vacations/report/json",
      securityMiddleware.verifyToken,
      securityMiddleware.verifyAdmin,
      this.getReportJSON,
    );
  }

  // Get paginated vacations with filtering for the current user
  private async getVacations(request: Request, response: Response) {
    const filter: FilterType = parseFilter(request.query.filter);
    const page = parsePage(request.query.page as string | undefined);
    const pageSize = parsePageSize(request.query.pageSize as string | undefined);

    const userId = response.locals.user._id.toString();

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
    const userId = response.locals.user._id.toString();

    response.json(serializeVacation(vacation, userId));
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
    const userId = response.locals.user._id.toString();

    const vacation = await vacationService.likeVacation(request.params._id, userId);

    response.json(serializeVacation(vacation, userId));
  }

  // Unlike a vacation (user only, admin prevented)
  private async unlikeVacation(request: Request, response: Response) {
    const userId = response.locals.user._id.toString();

    const vacation = await vacationService.unlikeVacation(request.params._id, userId);

    response.json(serializeVacation(vacation, userId));
  }

  // Generate and return a CSV report of vacations (admin only)
  private async getReportCSV(request: Request, response: Response) {
    const csvData = await vacationService.generateVacationsReportCSV();
    response.type("csv").attachment("vacations-report.csv").send(csvData);
  }

  // Generate and return a JSON report of vacations (admin only)
  private async getReportJSON(request: Request, response: Response) {
    const report = await vacationService.getVacationsReport();
    response.json(report);
  }
}

export const vacationController = new VacationController();
