import { mockUsers } from "@/lib/mockData";

const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

export default function FilterBar({ filters, onChange }) {
  function handle(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="search" className="sr-only">Search tasks</label>
        <input id="search" name="search" placeholder="Search by title" value={filters.search} onChange={handle} className={field} />
      </div>
      <div>
        <label htmlFor="status" className="sr-only">Status</label>
        <select id="status" name="status" value={filters.status} onChange={handle} className={field}>
          <option value="">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div>
        <label htmlFor="priority" className="sr-only">Priority</label>
        <select id="priority" name="priority" value={filters.priority} onChange={handle} className={field}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="assignee" className="sr-only">Assignee</label>
        <select id="assignee" name="assignee" value={filters.assignee} onChange={handle} className={field}>
          <option value="">All assignees</option>
          {mockUsers.map((u) => (
            <option key={u.uid} value={u.uid}>{u.displayName}</option>
          ))}
        </select>
      </div>
    </div>
  );
}