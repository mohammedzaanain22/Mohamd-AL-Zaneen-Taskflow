"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import FilterBar from "@/components/FilterBar";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import StateMessage from "@/components/ui/StateMessage";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProject";
import { useTasks } from "@/hooks/useTasks";
import { useMembers } from "@/hooks/useMembers";
import { createTask, updateTask, deleteTask } from "@/services/tasks";
import { getFirestoreErrorMessage } from "@/lib/errors";
import { canEditTask, canChangeStatus, canDeleteTask } from "@/lib/permissions";

const EMPTY_FILTERS = { search: "", status: "", priority: "", assignee: "" };

export default function ProjectPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { project, loading, error } = useProject(id);
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks(id, Boolean(project));
  const members = useMembers(project?.memberIds);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [taskModal, setTaskModal] = useState({ open: false, task: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionError, setActionError] = useState("");

    const visible = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesAssignee =
        !filters.assignee ||
        (filters.assignee === "unassigned" ? !t.assigneeId : t.assigneeId === filters.assignee);
      return (
        t.title.toLowerCase().includes(term) &&
        (!filters.status || t.status === filters.status) &&
        (!filters.priority || t.priority === filters.priority) &&
        matchesAssignee
      );
    });
  }, [tasks, filters]);

  if (loading) {
    return (
      <div role="status" className="grid gap-4">
        <span className="sr-only">Loading project...</span>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-12" />
        <Skeleton className="h-24" />
      </div>
    );
  }
  if (error === "denied") {
    return (
      <StateMessage title="Access denied">
       You aren&apos;t a member of this project, or it doesn&apos;t exist.
      </StateMessage>
    );
  }
  if (error === "not-found") {
    return <StateMessage title="Project not found">This project no longer exists.</StateMessage>;
  }
  if (error) {
    return <StateMessage title="Couldn't load the project">Check your connection and refresh the page.</StateMessage>;
  }

  const isOwner = project.ownerId === user.uid;
  const permissions = {
    canEdit: (t) => canEditTask(t, project, user.uid),
    canChangeStatus: (t) => canChangeStatus(t, project, user.uid),
    canDelete: (t) => canDeleteTask(t, project, user.uid),
  };

  function closeTaskModal() {
    setTaskModal({ open: false, task: null });
  }

  async function handleTaskSubmit(payload) {
    if (taskModal.task) {
      await updateTask(id, taskModal.task.id, payload);
    } else {
      await createTask(id, payload, user);
    }
    closeTaskModal();
  }

  async function handleStatusChange(task, status) {
    setActionError("");
    try {
      await updateTask(id, task.id, { status });
    } catch (err) {
      setActionError(getFirestoreErrorMessage(err));
    }
  }

  async function handleDelete() {
    await deleteTask(id, deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="grid gap-6">
      <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">&larr; Dashboard</Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          {project.description && <p className="text-sm text-slate-500">{project.description}</p>}
          <p className="mt-2 text-sm text-slate-600">
            Members:{" "}
            {members
              .map((m) => `${m.displayName}${m.uid === project.ownerId ? " (owner)" : ""}`)
              .join(", ")}
          </p>
        </div>
        {isOwner && (
          <Link
            href={`/projects/${id}/settings`}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            Settings
          </Link>
        )}
      </div>

            <FilterBar
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
        members={members}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Tasks ({visible.length})</h2>
        <Button onClick={() => setTaskModal({ open: true, task: null })}>New task</Button>
      </div>

      {(actionError || tasksError) && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {actionError || tasksError}
        </p>
      )}

      {tasksLoading ? (
        <div role="status" className="grid gap-3">
          <span className="sr-only">Loading tasks...</span>
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (
        <TaskList
          tasks={visible}
          members={members}
          permissions={permissions}
          onEdit={(task) => setTaskModal({ open: true, task })}
          onDelete={setDeleteTarget}
          onStatusChange={handleStatusChange}
          emptyMessage={
            tasks.length === 0
              ? "No tasks yet. Create the first one."
              : "No tasks match your filters."
          }
        />
      )}

      <Modal
        open={taskModal.open}
        title={taskModal.task ? "Edit task" : "New task"}
        onClose={closeTaskModal}
      >
        <TaskForm
          task={taskModal.task}
          members={members}
          canChangeStatus={taskModal.task ? permissions.canChangeStatus(taskModal.task) : true}
          onSubmit={handleTaskSubmit}
          onCancel={closeTaskModal}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete task"
        message={`Delete "${deleteTarget?.title}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}