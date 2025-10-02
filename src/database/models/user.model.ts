import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  fullName: string;
  email: string;
  password?: string;
  country: string;
  investmentGoals: "Growth" | "Income" | "Conservation" | "Balanced";
  riskTolerance: "Low" | "Medium" | "High";
  preferredIndustry:
    | "Technology"
    | "Healthcare"
    | "Finance"
    | "Energy"
    | "Consumer Goods";
  emailVerified: Date | null;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  image?: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  country: { type: String, required: true },
  investmentGoals: {
    type: String,
    enum: ["Growth", "Income", "Conservation", "Balanced"],
    required: true,
  },
  riskTolerance: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  preferredIndustry: {
    type: String,
    enum: ["Technology", "Healthcare", "Finance", "Energy", "Consumer Goods"],
    required: true,
  },
  emailVerified: { type: Date, default: null },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
