import { Router, Request, Response } from "express";
import {
  postTodo,
  getTodos,
  getTodoById,
  putTodoById,
  deleteAllTodo,
  deleteTodoById,
  patchTodoById,
  getTodoAccordToPriority,
  getTodoStatusCompleted,
} from "../controllers/Todo";
import { IResponse } from "../utils";
import { apiKeyAuth } from "../middlewares";

export const todoRouter = Router();

// POST REQUEST

todoRouter.post("/", apiKeyAuth, async (req: Request, res: Response) => {
  const result: IResponse = await postTodo(req.body);
  res.status(result.status).send(result.data || result.error);
});


todoRouter.get("/", apiKeyAuth, async (req: Request, res: Response) => {
  const result: IResponse = await getTodos();
  res.status(result.status).send(result.data || result.error);
});

todoRouter.get(
  "/completedstate",
  apiKeyAuth,
  async (req: Request, res: Response) => {
    const state = req.query.state as string;
    const result: IResponse = await getTodoStatusCompleted(state);
    res.status(result.status).send(result);
  }
);

todoRouter.get("/priority", apiKeyAuth, async (req: Request, res: Response) => {
  const priority = req.query.priority as string;
  const result: IResponse = await getTodoAccordToPriority(priority);
  res.status(result.status).send(result);
});

todoRouter.get("/:id", apiKeyAuth, async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const result: IResponse = await getTodoById(id);
  res.status(result.status).send(result.data || result.error);
});

// PUT REQUEST
todoRouter.put("/:id", apiKeyAuth, async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const body = req.body;
  const result: IResponse = await putTodoById(id, body);
  res.status(result.status).send(result.data || result.error);
});

// DELETE REQUEST
todoRouter.delete("/", apiKeyAuth, async (req: Request, res: Response) => {
  const result: IResponse = await deleteAllTodo();
  res.status(result.status).send(result.data || result.error);
});

todoRouter.delete("/:id", apiKeyAuth, async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const result: IResponse = await deleteTodoById(id);
  res
    .status(result.status)
    .send({ message: result.message, data: result.data } || result.error);
});

// PATCH REQUEST
todoRouter.patch(
  "/:id/complete",
  apiKeyAuth,
  async (req: Request, res: Response) => {
    const body: Object = req.body;
    const id = req.params.id;
    const result: IResponse = await patchTodoById(id, body);
    res.status(result.status).send(result.data || result.error);
  }
);
