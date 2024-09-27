import { Request, Response, NextFunction } from "express";
import { ApiKey } from "../models";

export const apiKeyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.query.apiKey as string;

  if (!apiKey) {
    return res.status(400).send("API Key is missing");
  }

  try {
    const key = await ApiKey.findOne({ apiKey: apiKey });

    if (!key) {
      return res.status(401).send("Invalid API Key");
    }

    // Ajouter l'ID de l'utilisateur à la requête pour une utilisation ultérieure
    (req as any).userId = key.userId;
    next();
  } catch (error: any) {
    return res.status(500).send(`Internal server error: ${error.message}`);
  }
};
