import prisma from "../lib/prisma.js";

// get tasks
export const getTasks = async (request, response) => {
  try {
    const { search, status } = request.query;

    const where = {};

    // search
    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    // filter
    if (status === "completed") {
      where.completed = true;
    } else if (status === "incomplete") {
      where.completed = false;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    // return tasks
    response.status(200).json({
      message: "Retrieve successfully",
      tasks,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      message: "Internal error",
    });
  }
};

// add task
export const addTask = async (request, response) => {
  try {
    const { title, description } = request.body || {};

    if (!title || !description.trim()) {
      return (
        response.status(400),
        json({
          message: "Title is required",
        })
      );
    }

    // adding task
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    });
    // response
    response.status(201).json({
      message: "Task added",
      task,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      message: "Internal Error",
    });
  }
};

// update task
export const updateTask = async (request, response) => {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "Invalid Task ID",
      });
    }

    const { title, description, completed } = request.body;

    if (title !== undefined && !title.trim()) {
      return response.status(400).json({
        message: "Title is required",
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return response.status(404).json({
        message: "Task not found",
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(completed !== undefined && { completed: Boolean(completed) }),
      },
    });

    return response.status(200).json({
      message: "Updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      message: "Internal error",
    });
  }
};

// delete task
export const deleteTask = async (request, response) => {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "Invalid Task ID",
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return response.status(404).json({
        message: "Task does not exist",
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    return response.status(200).json({
      message: `Task ${id} Deleted Successfully`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Internal error",
    });
  }
};
