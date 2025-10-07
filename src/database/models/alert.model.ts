import { Schema, model, models, type Document, type Model } from "mongoose";

export interface Alert {
  userId: string;
  name: string;
  stockIdentifier: string;
  type: "price" | "volume";
  condition: "greater_than" | "less_than";
  threshold: number;
  frequency: "once" | "daily" | "weekly";
}

const AlertSchema = new Schema<Alert>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    stockIdentifier: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    type: { type: String, enum: ["price", "volume"], required: true },
    condition: {
      type: String,
      enum: ["greater_than", "less_than", "equal_to"],
      required: true,
    },
    threshold: { type: Number, required: true },
    frequency: {
      type: String,
      enum: ["once_per_minute", "once_per_hour", "once_per_day"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Alert: Model<Alert> =
  (models?.Alert as Model<Alert>) || model<Alert>("Alert", AlertSchema);
