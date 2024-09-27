import { User } from "./../models/User";
import { IResponse, IUser } from "../utils";
import { passwdValidator } from "../utils/passwordValidator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { ApiKey } from "../models";

// TODO mettre en place le fait de pouvoir modifier son mot de passe

export const registerUser = async (userData: IUser): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  const { name, email, password } = userData;

  if (name === "" || email === "" || password === "") {
    response.error = "please fill in all fields";
    response.status = 400;
    return response;
  }

  try {
    const findUser = await User.findOne({ email });

    if (findUser) {
      response.error = "This is already use !!";
      response.status = 400;
      return response;
    }

    const validation = passwdValidator(userData.password);

    if (!validation.state) {
      response.error = validation.message;
      response.status = 400;
      return response;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    await user.save();

    response.data = { message: "Created successfully", user };
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};

export const deleteUserById = async (id: string): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  if (!mongoose.isValidObjectId(id)) {
    response.error = "Invalid Id";
    response.status = 400;
    return response;
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      response.error = "User doesn't exist";
      response.status = 404;
      return response;
    }

    const apiKeysToDelete = await ApiKey.findOneAndDelete({ userId: id });
    response.data = { message: "User deleted successfuly", user };
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};
