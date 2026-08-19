import { useState } from "react";
import { Check, Circle, Pencil, Save, Trash2, X } from "lucide-react";
import { deleteTask, updateTask } from "../api/task-api";
import type { Task } from "../types/task-types";

interface TaskCardProps {
  task: Task;
  onUpdated: (task: Task) => void;
  onDeleted: (id: number) => void;
}

const TaskCard = ({ task, onUpdated, onDeleted }: TaskCardProps) => {
  const { id, title, description, completed } = task;
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const [editedCompleted, setEditedCompleted] = useState(completed);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setEditedTitle(title);
    setEditedDescription(description || "");
    setError(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setError(null);
    setEditing(false);
  };

  const saveChanges = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editedTitle.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const updatedTask = await updateTask(id, {
        title: editedTitle.trim(),
        description: editedDescription,
        completed: editedCompleted,
      });
      onUpdated(updatedTask);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Couldn't update task. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      await deleteTask(id);
      onDeleted(id);
    } catch (err) {
      console.error(err);
      setError("Couldn't delete task. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={[
        "group flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors",
        completed
          ? "border-border/60 bg-muted/30"
          : "border-border hover:border-border/80",
      ].join(" ")}
    >
      {editing ? (
        <form onSubmit={saveChanges} className="min-w-0 flex-1 space-y-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Task title"
          />
          <textarea
            value={editedDescription}
            onChange={(event) => setEditedDescription(event.target.value)}
            rows={2}
            className="w-full resize-none rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Task description"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <select
              value={editedCompleted ? "completed" : "incomplete"}
              onChange={(event) =>
                setEditedCompleted(event.target.value === "completed")
              }
              className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              aria-label="Task status"
            >
              <option value="incomplete">Active</option>
              <option value="completed">Done</option>
            </select>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving || deleting}
                aria-label="Cancel editing"
                className="rounded p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={saving || deleting}
                aria-label="Save task changes"
                className="rounded p-1.5 text-foreground hover:bg-muted disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </form>
      ) : (
        <>
          <button
            type="button"
            onClick={async () => {
              try {
                const updatedTask = await updateTask(id, {
                  title,
                  description: description || "",
                  completed: !completed,
                });
                onUpdated(updatedTask);
              } catch (err) {
                console.error(err);
              }
            }}
            aria-pressed={completed}
            aria-label={
              completed ? "Mark task as incomplete" : "Mark task as complete"
            }
            className={[
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
              completed
                ? "border-foreground bg-foreground text-background"
                : "border-muted-foreground/40 text-transparent hover:border-foreground",
            ].join(" ")}
          >
            {completed ? (
              <Check className="h-3 w-3" />
            ) : (
              <Circle className="h-3 w-3" />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <p
              className={[
                "truncate text-sm font-medium leading-tight",
                completed
                  ? "text-muted-foreground line-through"
                  : "text-foreground",
              ].join(" ")}
            >
              {title}
            </p>
            {description && (
              <p
                className={[
                  "mt-1 text-xs leading-snug",
                  completed
                    ? "text-muted-foreground/70"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={startEditing}
            aria-label="Edit task"
            className="shrink-0 rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100 focus:opacity-100"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete task"
            className="shrink-0 rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 group-hover:opacity-100 focus:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default TaskCard;
