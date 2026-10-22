export function fieldClass(hasError = false) {
  return [
    "block w-full min-h-10 rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm",
    "placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
    hasError ? "border-red-500" : "border-slate-300",
  ].join(" ");
}