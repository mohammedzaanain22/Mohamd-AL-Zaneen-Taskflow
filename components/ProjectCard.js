import Link from "next/link";
import { countByStatus } from "@/lib/utils";

export default function ProjectCard({ project, tasks }) {
  const counts = countByStatus(tasks);
  const percent = tasks.length ? Math.round((counts.done / tasks.length) * 100) : 0;
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-brand-500"
    >
      <h3 className="font-medium">{project.name}</h3>
      <p className="text-sm text-slate-500">
        {project.memberIds.length} members · {tasks.length} tasks
      </p>
      <div className="mt-3 h-2 rounded-full bg-slate-100" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Completed tasks">
        <div className="h-2 rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">{percent}% done</p>
    </Link>
  );
}