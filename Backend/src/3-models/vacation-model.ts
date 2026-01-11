import { Document, model, ObjectId, Schema } from "mongoose";
import { appConfig } from "../2-utils/app-config";

/**
 * Defines the Mongoose schema and TypeScript interface for vacation entities.
 * Used for CRUD operations on vacations, including validation and serialization.
 * Supports virtual fields (e.g., imageUrl) and tracks which users liked each vacation.
 *
 * Example usage:
 *   const vacation = await VacationModel.findById(id);
 *   vacation.imageUrl // computed from imageName and baseImageUrl
 */

export interface IVacationModel extends Document {
    _id: ObjectId;
    destination: string;
    description: string;
    startDate: Date;    
    endDate: Date;      
    price: number;
    imageName: string;
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
    imageName: {
      type: String,
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
    toJSON: { virtuals: true },
    id: false,
    timestamps: true,
  }
);

VacationSchema.virtual("imageUrl").get(function () {
  return appConfig.baseImageUrl + this.imageName;   
  // example : this.imageName = 3f9c2a4a-paris.jpg then we return-
  // "http://localhost:4001/api/vacations/images/3f9c2a4a-paris.jpg" 
});

export const VacationModel = model<IVacationModel>(
  "VacationModel",
  VacationSchema,
  "vacations"
);
