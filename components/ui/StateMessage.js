import Link from "next/link";

export default function StateMessage({ title, children, href = "/dashboard", linkLabel = "Back to dashboard" }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-xl bg-white p-6 text-center ring-1 ring-slate-200">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{children}</p>
      <Link href={href} className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline">
        {linkLabel}
      </Link>
    </div>
  );
}