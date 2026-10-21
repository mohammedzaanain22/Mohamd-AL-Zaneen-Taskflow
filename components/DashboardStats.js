export default function DashboardStats({ projects, total, counts, overdue }) {
  const items = [
    { label: "Projects", value: projects },
    { label: "Total tasks", value: total },
    { label: "To do", value: counts.todo },
    { label: "In progress", value: counts.in_progress },
    { label: "Done", value: counts.done },
    { label: "Overdue", value: overdue },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <dt className="text-sm text-slate-500">{item.label}</dt>
          <dd className="mt-1 text-2xl font-semibold">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}