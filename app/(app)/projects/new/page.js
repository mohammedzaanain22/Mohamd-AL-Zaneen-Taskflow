"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { useAuth } from "@/hooks/useAuth";
import { createProject } from "@/services/projects";

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();

  async function handleCreate(values) {
    const id = await createProject(values, user);
    router.replace(`/projects/${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">
        &larr; Back to dashboard
      </Link>

      <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="mb-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M12 10v5M9.5 12.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold">Create a new project</h1>
          <p className="mt-1 text-sm text-slate-500">
            Give your project a name and a short description. You can manage its settings later.
          </p>
        </div>

        <ProjectForm
          submitLabel="Create project"
          onSubmit={handleCreate}
          onCancel={() => router.push("/dashboard")}
        />
      </div>
    </div>
  );
}