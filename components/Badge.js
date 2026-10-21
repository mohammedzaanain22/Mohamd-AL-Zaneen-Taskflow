const STATUS = {
  todo: { label: "To do", cls: "bg-slate-100 text-slate-700" },
  in_progress: { label: "In progress", cls: "bg-amber-100 text-amber-800" },
  done: { label: "Done", cls: "bg-emerald-100 text-emerald-800" },
};
const PRIORITY = {
  low: { label: "Low", cls: "bg-sky-100 text-sky-800" },
  medium: { label: "Medium", cls: "bg-orange-100 text-orange-800" },
  high: { label: "High", cls: "bg-red-100 text-red-800" },
};

export function StatusBadge({ status }) {
  const s = STATUS[status];
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${s.cls}`}>{s.label}</span>;
}

export function PriorityBadge({ priority }) {
  const p = PRIORITY[priority];
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${p.cls}`}>{p.label}</span>;
}