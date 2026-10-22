import { fieldClass } from "@/lib/styles";

export default function Select({ label, id, error, hint, children, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={fieldClass(Boolean(error))}
        {...props}
      >
        {children}
      </select>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}