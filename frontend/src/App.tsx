import { useEffect, useState } from "react";
import "./App.css";
import { getTasks } from "./api/task-api";
import type { Task } from "./types/task-types";
import TaskCard from "./components/task-card";
import TaskForm from "./components/task-form";

type StatusFilter = "" | "completed" | "incomplete";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const { tasks } = await getTasks({ search, status });
        setTasks(tasks);
      } catch (err) {
        console.error(err);
        setError("Couldn't load tasks. Try again.");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchTasks, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [search, status]);

  const remaining = tasks.filter((t) => !t.completed).length;

  const handleTaskAdded = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const statusOptions: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "" },
    { label: "Active", value: "incomplete" },
    { label: "Done", value: "completed" },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <header className="mb-6 border-b border-border pb-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Task Manager
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading
                ? "Loading…"
                : tasks.length === 0
                  ? "No tasks yet"
                  : remaining === 0
                    ? "All tasks complete"
                    : `${remaining} of ${tasks.length} remaining`}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:max-w-xs"
          />

          <div className="flex gap-1 rounded-md border border-border bg-muted/30 p-0.5">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={[
                  "rounded px-3 py-1 text-xs font-medium transition-colors",
                  status === opt.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mb-3">
        <TaskForm onAdded={handleTaskAdded} />
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg border border-border bg-muted/30"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            {search || status ? "No matching tasks" : "Nothing here yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search || status
              ? "Try a different search or filter"
              : "Tasks you add will show up in this list"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdated={handleTaskUpdated}
              onDeleted={handleTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
