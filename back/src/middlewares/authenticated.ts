import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

export const authenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.cookies.token;

  if (!token) {
    token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).send("Unauthorized");
    }
  }

  try {
    (req as any).user = jwt.verify(token, process.env.SECRET_KEY || "");
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
};

hskjhshdjqsjdkqsjdkjqdhkhqkjkjhk