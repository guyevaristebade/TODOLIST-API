import mongoose from "mongoose";
import { ApiKey } from "../models/ApiKey";
import { IResponse } from "../utils";

export const deleteApiKeys = async (keyId: string, userId: string) => {
  let response: IResponse = {
    status: 200,
  };

  if (!mongoose.isValidObjectId(keyId) && !mongoose.isValidObjectId(userId)) {
    response.error = "Id's is not valid";
    response.status = 400;
    return response;
  }

  try {
    const keyToDelete = await ApiKey.findOneAndDelete({
      _id: keyId,
      userId: userId,
    });

    if (!keyToDelete) {
      response.error = "API Key not found or does not belong to the user";
      response.status = 404;
      return response;
    }

    response.data = { message: "API Key successfully deleted" };
  } catch (error: any) {
    response.error = `Internal server error ${error.message}`;
    response.status = 500;
  }

  return response;
};
