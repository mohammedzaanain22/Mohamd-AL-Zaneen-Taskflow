export function todayISO() {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

// Overdue = due date before today AND status is not done (SRS section 13)
export function isOverdue(task) {
  return Boolean(task.dueDate) && task.dueDate < todayISO() && task.status !== "done";
}

export function formatDate(iso) {
  if (!iso) return "No due date";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function countByStatus(tasks) {
  return tasks.reduce(
    (acc, t) => {
      acc[t.status] += 1;
      return acc;
    },
    { todo: 0, in_progress: 0, done: 0 }
  );
}