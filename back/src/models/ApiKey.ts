import mongoose, { Schema } from "mongoose";
import { IApiKey } from "../utils";

const TodoSchema: Schema<IApiKey> = new Schema(
  {
    keyName: { type: String, required: true, unique: true },
    apiKey: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const ApiKey = mongoose.model<IApiKey>("ApiKey", TodoSchema);
