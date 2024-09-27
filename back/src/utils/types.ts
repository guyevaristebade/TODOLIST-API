import mongoose, { Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResponse {
  status: number;
  error?: string;
  message?: string;
  data?: any;
}

export interface Iid {
  id: mongoose.Types.ObjectId;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IApiKey {
  keyName: string;
  apiKey: string;
  userId: mongoose.Types.ObjectId;
}
