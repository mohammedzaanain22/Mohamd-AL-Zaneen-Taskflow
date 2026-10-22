import { fieldClass } from "@/lib/styles";

export default function FilterBar({ filters, onChange, onClear, members = [] }) {
  const hasFilters = Object.values(filters).some(Boolean);

  function handle(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="grid gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="search" className="sr-only">Search tasks by title</label>
        <input
          id="search"
          name="search"
          type="search"
          placeholder="Search by title"
          value={filters.search}
          onChange={handle}
          className={fieldClass()}
        />
      </div>
      <div>
        <label htmlFor="status" className="sr-only">Status</label>
        <select id="status" name="status" value={filters.status} onChange={handle} className={fieldClass()}>
          <option value="">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div>
        <label htmlFor="priority" className="sr-only">Priority</label>
        <select id="priority" name="priority" value={filters.priority} onChange={handle} className={fieldClass()}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="assignee" className="sr-only">Assignee</label>
        <select id="assignee" name="assignee" value={filters.assignee} onChange={handle} className={fieldClass()}>
          <option value="">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {members.map((m) => (
            <option key={m.uid} value={m.uid}>{m.displayName}</option>
          ))}
        </select>
      </div>
      {hasFilters && (
        <div className="flex justify-end sm:col-span-2 lg:col-span-4">
          <button type="button" onClick={onClear} className="text-sm font-medium text-brand-600 hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}