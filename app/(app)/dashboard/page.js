"use client";
import Link from "next/link";
import DashboardStats from "@/components/DashboardStats";
import ProjectCard from "@/components/ProjectCard";
import TaskList from "@/components/TaskList";
import { mockProjects, mockTasks } from "@/lib/mockData";
import { countByStatus, isOverdue } from "@/lib/utils";

export default function DashboardPage() {
  const overdueTasks = mockTasks.filter(isOverdue);

  return (
    <div className="grid gap-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <DashboardStats
        projects={mockProjects.length}
        total={mockTasks.length}
        counts={countByStatus(mockTasks)}
        overdue={overdueTasks.length}
      />

      <section aria-labelledby="projects-heading" className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 id="projects-heading" className="text-lg font-medium">Your projects</h2>
          <Link href="/projects/new" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            New project
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((p) => (
            <ProjectCard key={p.id} project={p} tasks={mockTasks.filter((t) => t.projectId === p.id)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="overdue-heading" className="grid gap-3">
        <h2 id="overdue-heading" className="text-lg font-medium">Overdue tasks</h2>
        <TaskList tasks={overdueTasks} emptyMessage="No overdue tasks. Nice work." />
      </section>
    </div>
  );
}