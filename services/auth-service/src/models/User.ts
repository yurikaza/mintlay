import mongoose, { Document, Schema } from "mongoose";

// 1. Define an Interface for the User Document
export interface IUser extends Document {
  walletAddress: string;
  nonce: string;
  username: string;
  plan: {
    tier: "FREE" | "PRO" | "ENTERPRISE";
    status: "ACTIVE" | "EXPIRED" | "CANCELED";
    expiresAt: Date | null;
  };
  avatar?: string;
  role: "USER" | "ADMIN";
  lastLogin: Date;
  createdAt: Date; // <--- Add this to the interface
  updatedAt: Date; // <--- Add this to the interface
}

const UserSchema = new Schema<IUser>(
  {
    walletAddress: { type: String, required: true, unique: true },
    nonce: { type: String, required: true },
    plan: {
      tier: {
        type: String,
        enum: ["FREE", "PRO", "ENTERPRISE"],
        default: "FREE",
      },
      status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED", "CANCELED"],
        default: "ACTIVE",
      },
      expiresAt: { type: Date, default: null },
    },

    username: { type: String, default: "ARCHITECT_UNNAMED" },
    avatar: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    lastLogin: { type: Date, default: Date.now },
  },
  {
    // 2. This is the crucial part that fixes the error
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", UserSchema);
