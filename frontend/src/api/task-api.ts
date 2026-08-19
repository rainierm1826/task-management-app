import type { Task, TaskResponse } from "../types/task-types";

const API_URL = `${import.meta.env.VITE_API_URL}/api/task`;

export async function getTasks({
  search,
  status,
}: {
  search: string;
  status: string;
}): Promise<TaskResponse> {
  try {
    const params = new URLSearchParams({
      search,
      status: status,
    });
    console.log(API_URL);
    const response = await fetch(`${API_URL}?${params.toString()}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to retrieved tasks");
    }
    return result;
  } catch (error) {
    throw error;
  }
}

export async function addTask({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<Task> {
  try {
    const data = {
      title,
      description,
    };

    console.log(data);

    const response = await fetch(`${API_URL}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to add task: ${response.status}`);
    }

    const result: { task: Task } = await response.json();
    return result.task;
  } catch (error) {
    throw error;
  }
}

export async function updateTask(
  id: number,
  data: { title: string; description: string; completed: boolean },
): Promise<Task> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update task");
  }

  return result.task;
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete task");
  }
}
