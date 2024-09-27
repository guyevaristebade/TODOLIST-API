import mongoose, { Schema } from "mongoose";
import { ITodo } from "../utils";

const TodoSchema: Schema<ITodo> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, required: true },
    priority: { type: String, required: true, enum: ["low", "medium", "high"] },
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model<ITodo>("Todo", TodoSchema);
