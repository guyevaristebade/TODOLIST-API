import { ApiKey } from "../models/ApiKey";
import { Router, Request, Response } from "express";
import { authenticated } from "../middlewares/authenticated";
import { generatedApiKey } from "../utils";
import { deleteApiKeys } from "../controllers/ApiKey";

export const apiKeyRouter = Router();

apiKeyRouter.post("/", authenticated, async (req: Request, res: Response) => {
  const { keyName } = req.body;

  try {
    if (keyName === "") {
      return res.status(400).send("Please give a name of your api key");
    }

    const genApiKey = generatedApiKey();
    const key = new ApiKey({
      keyName: keyName,
      apiKey: genApiKey,
      userId: (req as any).user.user._id, // TODO à régler ce problème
    });

    await key.save();
    return res.status(200).send(key);
  } catch (error: any) {
    return res
      .status(500)
      .send({ error: `Internal server error ${error.message}`, status: 500 });
  }
});

apiKeyRouter.get("/", authenticated, async (req: Request, res: Response) => {
  try {
    const keys = await ApiKey.find({ userId: (req as any).user.user._id });

    if (keys.length == 0) {
      return res.status(404).send({ error: "Keys not found", status: 404 });
    }

    return res.status(200).send({ data: keys, status: 200 });
  } catch (error: any) {
    return res
      .status(500)
      .send({ error: `Internal server error ${error.message}`, status: 500 });
  }
});

apiKeyRouter.delete(
  "/:id",
  authenticated,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.user._id;
    const response = await deleteApiKeys(id, userId);

    return res.status(response.status).send(response);
  }
);
