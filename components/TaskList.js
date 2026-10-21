import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { mockUsers } from "@/lib/mockData";
import { formatDate, isOverdue } from "@/lib/utils";

export default function TaskList({ tasks, emptyMessage = "No tasks yet." }) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {tasks.map((task) => {
        const assignee = mockUsers.find((u) => u.uid === task.assigneeId);
        return (
          <li
            key={task.id}
            className="flex flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-slate-500">
                {assignee ? `Assigned to ${assignee.displayName}` : "Unassigned"} · Due: {formatDate(task.dueDate)}
                {isOverdue(task) && <span className="ml-2 font-medium text-red-700">(Overdue)</span>}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              <Button variant="secondary">Edit</Button>
              <Button variant="danger">Delete</Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}