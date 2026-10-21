"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import FilterBar from "@/components/FilterBar";
import TaskList from "@/components/TaskList";
import Button from "@/components/ui/Button";
import { mockProjects, mockTasks, mockUsers } from "@/lib/mockData";

export default function ProjectPage() {
  const { id } = useParams();
  const project = mockProjects.find((p) => p.id === id);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "", assignee: "" });

  const tasks = useMemo(() => mockTasks.filter((t) => t.projectId === id), [id]);

  const visible = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(term) &&
        (!filters.status || t.status === filters.status) &&
        (!filters.priority || t.priority === filters.priority) &&
        (!filters.assignee || t.assigneeId === filters.assignee)
    );
  }, [tasks, filters]);

  if (!project) {
    return (
      <div className="text-center">
        <p className="mb-3">Project not found.</p>
        <Link href="/dashboard" className="text-brand-600 hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const members = mockUsers.filter((u) => project.memberIds.includes(u.uid));

  return (
    <div className="grid gap-6">
      <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">&larr; Dashboard</Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-sm text-slate-500">{project.description}</p>
          <p className="mt-2 text-sm text-slate-600">
            Members: {members.map((m) => m.displayName).join(", ")}
          </p>
        </div>
        <Button variant="secondary">Settings</Button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Tasks ({visible.length})</h2>
        <Button>New task</Button>
      </div>

      <TaskList tasks={visible} emptyMessage="No tasks match your filters." />
    </div>
  );
}