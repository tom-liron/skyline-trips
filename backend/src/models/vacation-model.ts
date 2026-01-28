import { Document, model, ObjectId, Schema } from "mongoose";

/**
 * Defines the Mongoose schema and TypeScript interface for vacation entities.
 *
 * Used for:
 * - CRUD operations on vacations
 * - Schema-level validation
 * - Tracking which users liked each vacation
 *
 * Image handling:
 * - Each vacation stores a direct `imageUrl` pointing to a Cloudinary-hosted image
 * - No local file names, paths, or virtual image fields are used
 * - The backend does not serve image files; the frontend renders images directly from the URL
 *
 * Example usage:
 *   const vacation = await VacationModel.findById(id);
 *   vacation.imageUrl // Cloudinary HTTPS URL
 */

export interface IVacationModel extends Document {
  _id: ObjectId;
  destination: string;
  description: string;
  startDate: Date;
  endDate: Date;
  price: number;
  imageUrl: string;
  imagePublicId: string;
  likedUserIds: ObjectId[];
}

export const VacationSchema = new Schema<IVacationModel>(
  {
    destination: {
      type: String,
      required: [true, "Missing destination."],
      maxlength: [100, "Destination too long."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Missing description."],
      maxlength: [1000, "Description too long."],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Missing start date."],
    },
    endDate: {
      type: Date,
      required: [true, "Missing end date."],
    },
    price: {
      type: Number,
      required: [true, "Missing price."],
      min: [0, "Price can't be negative."],
      max: [10000, "Price can't exceed 10000."],
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imagePublicId: {
      type: String,
      required: true,
      trim: true,
    },
    likedUserIds: {
      type: [Schema.Types.ObjectId],
      ref: "UserModel",
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const VacationModel = model<IVacationModel>("VacationModel", VacationSchema, "vacations");
