import bcrypt from "bcrypt";
import { Router, Request, Response } from "express";
import { IResponse } from "../utils";
import { deleteUserById, registerUser } from "../controllers";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { authenticated } from "../middlewares/authenticated";

export const userRouter = Router();
const useSecureAuth = process.env.NODE_ENV === "production" ? true : false;

userRouter.delete(
  "/user/:id",
  authenticated,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await deleteUserById(id);
    res.status(response.status).send(response.data || response.error);
  }
);

userRouter.post("/signup", async (req: Request, res: Response) => {
  const userData = req.body;
  const response = await registerUser(userData);
  res.status(response.status).send(response);
});

userRouter.post("/login", async (req: Request, res: Response) => {
  let response: IResponse = {
    status: 200,
  };

  try {
    if (req.body.email === "" || req.body.password === "") {
      response.error = "Please fill in all fields";
      response.status = 400;
      return res.status(response.status).send(response.error);
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      response.error = "User doesn't exist";
      response.status = 404;
      return res.status(response.status).send(response.error);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      response.error = "Invalid password";
      response.status = 401;
      return res.status(response.status).send(response.error);
    }

    const token = jwt.sign({ user }, (process.env.SECRET_KEY as string) || "", {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      maxAge: 31 * 24 * 3600 * 1000,
      httpOnly: true,
      secure: useSecureAuth,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: "none",
    });

    response.data = {
      user: { id: user._id, name: user.name, email: user.email },
      token,
    };
  } catch (error) {
    response.error = "Internal server error";
    response.status = 500;
  }
  return res.status(response.status).send(response);
});

userRouter.get(
  "/is-logged-in",
  authenticated,
  async (req: Request, res: Response) => {
    let response: IResponse = {
      status: 200,
    };

    const token = req.cookies.token;

    if (token) {
      response.data = { user: (req as any).user.user, token };
    }

    res.status(response.status).send(response);
  }
);

userRouter.delete(
  "/logout",
  authenticated,
  async (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: useSecureAuth,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: "none",
    });
    res.send("disconnect successfully");
  }
);
