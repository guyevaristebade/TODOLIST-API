import mongoose from "mongoose";
import { Todo } from "../models";
import { IResponse, ITodo, parseToBool } from "../utils";

// TODO rajouter response.data = [] dans l'objet response lorsqu'on s'attend à recevoir des données

export const postTodo = async (todo: ITodo): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  try {
    const todos = new Todo(todo);
    await todos.save();

    response.data = todos;
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }
  return response;
};

export const getTodos = async (): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  try {
    const todos = await Todo.find();

    if (todos.length == 0) {
      response.status = 404;
      response.error = "No todo found!! ";
      return response;
    }

    response.data = todos;
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};

export const getTodoById = async (id: string): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  if (!mongoose.isValidObjectId(id)) {
    response.status = 400;
    response.error = "Id is not valid";
    return response;
  }

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      response.status = 404;
      response.error = "No todo found or incorrect id ";
      return response;
    }

    response.data = todo;
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};

export const putTodoById = async (
  id: string,
  todoData: Object
): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  if (!mongoose.isValidObjectId(id)) {
    response.status = 400;
    response.error = "Id is not valid";
    return response;
  }
  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      response.status = 404;
      response.error = "No todo found";
      return response;
    }

    const updateTodo: any = await Todo.findByIdAndUpdate(id, todoData, {
      new: true,
    });

    await updateTodo.save();

    response.data = updateTodo;
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};

export const deleteAllTodo = async (): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  try {
    const todos = await Todo.deleteMany();

    if (todos.deletedCount == 0) {
      response.status = 400;
      response.error = `You can not delete, there are not todos`;
      return response;
    }
    response.data = { message: "todo deleted successfully " };
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};

export const deleteTodoById = async (id: string): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  if (!mongoose.isValidObjectId(id)) {
    response.status = 400;
    response.error = "Id is not valid";
    return response;
  }

  try {
    const todo = await Todo.findByIdAndDelete(id);

    response.message = "Todo delete successfully";
    response.data = todo;
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};

export const patchTodoById = async (
  id: string,
  patchData: Object
): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  if (!mongoose.isValidObjectId(id)) {
    response.status = 400;
    response.error = "Id is not valid";
    return response;
  }

  try {
    const todoPatched = await Todo.findByIdAndUpdate(id, patchData, {
      new: true,
    });

    if (!todoPatched) {
      response.status = 404;
      response.error = "Todo not found";
      return response;
    }

    response.data = todoPatched;
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};

export const getTodoStatusCompleted = async (
  todoState: string
): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  try {
    const todo = await Todo.find();

    if (!todo) {
      response.status = 404;
      response.error = "Todo not found";
      response.data = [];
      return response;
    }

    const todoStatusCompleted = todo.filter(
      (t) => t.completed === parseToBool(todoState)
    );

    if (todoStatusCompleted.length == 0) {
      response.error = "No todo found, verify state spelling";
      response.status = 400;
      response.data = [];
      return response;
    }

    response.data = todoStatusCompleted;
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};

export const getTodoAccordToPriority = async (
  priority: string
): Promise<IResponse> => {
  let response: IResponse = {
    status: 200,
  };

  try {
    if (priority === "") {
      response.error = "Priority missing";
      response.status = 400;
      return response;
    }
    const todo = await Todo.find();

    if (!todo) {
      response.status = 404;
      response.error = "Todo not found";
      response.data = [];
      return response;
    }

    const todoAccordToPriority = todo.filter((t) => t.priority === priority);

    if (todoAccordToPriority.length == 0) {
      response.error = "No todo found, verify priority spelling";
      response.status = 400;
      return response;
    }

    response.data = todoAccordToPriority;
  } catch (error: any) {
    response.status = 500;
    response.error = `Internal server error ${error.message}`;
  }

  return response;
};
