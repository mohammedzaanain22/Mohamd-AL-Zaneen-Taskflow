"use client";
import { useMemo } from "react";
import Link from "next/link";
import DashboardStats from "@/components/DashboardStats";
import ProjectCard from "@/components/ProjectCard";
import TaskList from "@/components/TaskList";
import Skeleton from "@/components/ui/Skeleton";
import StateMessage from "@/components/ui/StateMessage";
import { useProjects } from "@/hooks/useProjects";
import { useAllTasks } from "@/hooks/useTasks";
import { countByStatus, isOverdue } from "@/lib/utils";

function DashboardSkeleton() {
  return (
    <div role="status" className="grid gap-6">
      <span className="sr-only">Loading dashboard...</span>
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-32" />
    </div>
  );
}

export default function DashboardPage() {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError } = useAllTasks(projects);

  const overdueTasks = useMemo(() => tasks.filter(isOverdue), [tasks]);
  const projectsById = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects]
  );

  if (projectsError) {
    return <StateMessage title="Couldn't load your projects" href="/dashboard" linkLabel="Try again">{projectsError}</StateMessage>;
  }
  if (projectsLoading || tasksLoading) return <DashboardSkeleton />;

  return (
    <div className="grid gap-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {tasksError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{tasksError}</p>
      )}

      <DashboardStats
        projects={projects.length}
        total={tasks.length}
        counts={countByStatus(tasks)}
        overdue={overdueTasks.length}
      />

      <section aria-labelledby="projects-heading" className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 id="projects-heading" className="text-lg font-medium">Your projects</h2>
          <Link href="/projects/new" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            New project
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-medium">Start your first project</p>
            <p className="mt-1 text-sm text-slate-500">Projects hold your tasks and your team.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} tasks={tasks.filter((t) => t.projectId === p.id)} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="overdue-heading" className="grid gap-3">
        <h2 id="overdue-heading" className="text-lg font-medium">Overdue tasks</h2>
        <TaskList
          tasks={overdueTasks}
          showAssignee={false}
          projectsById={projectsById}
          emptyMessage="No overdue tasks. Nice work."
        />
      </section>
    </div>
  );
}