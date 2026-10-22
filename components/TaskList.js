"use client";
import Link from "next/link";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate, isOverdue } from "@/lib/utils";

export default function TaskList({
  tasks,
  members = [],
  showAssignee = true,
  projectsById,
  permissions,
  onEdit,
  onDelete,
  onStatusChange,
  emptyMessage = "No tasks yet.",
}) {
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
        const assignee = members.find((m) => m.uid === task.assigneeId);
        const project = projectsById?.[task.projectId];
        const canEdit = permissions?.canEdit(task);
        const canStatus = permissions?.canChangeStatus(task);
        const canDelete = permissions?.canDelete(task);

        return (
          <li
            key={task.id}
            className="flex flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-medium">{task.title}</h3>
              {task.description && (
                <p className="mt-0.5 text-sm text-slate-600">{task.description}</p>
              )}
              <p className="mt-1 text-sm text-slate-500">
                {showAssignee &&
                  (task.assigneeId
                    ? `Assigned to ${assignee?.displayName ?? "a member"} · `
                    : "Unassigned · ")}
                {project && (
                  <>
                    <Link href={`/projects/${project.id}`} className="text-brand-600 hover:underline">
                      {project.name}
                    </Link>
                    {" · "}
                  </>
                )}
                Due: {formatDate(task.dueDate)}
                {isOverdue(task) && <span className="ml-2 font-medium text-red-700">(Overdue)</span>}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {canStatus ? (
                <select
                  aria-label={`Change status of ${task.title}`}
                  value={task.status}
                  onChange={(e) => onStatusChange(task, e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
                >
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              ) : (
                <StatusBadge status={task.status} />
              )}
              <PriorityBadge priority={task.priority} />
              {canEdit && (
                <Button variant="secondary" onClick={() => onEdit(task)}>Edit</Button>
              )}
              {canDelete && (
                <Button variant="danger" onClick={() => onDelete(task)}>Delete</Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}