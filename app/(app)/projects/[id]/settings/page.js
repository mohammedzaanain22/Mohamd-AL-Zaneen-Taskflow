"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import MembersPanel from "@/components/MembersPanel";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import StateMessage from "@/components/ui/StateMessage";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProject";
import { useMembers } from "@/hooks/useMembers";
import { updateProject, deleteProject } from "@/services/projects";
import { addMemberByEmail, removeMember } from "@/services/members";

export default function ProjectSettingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { project, loading, error } = useProject(id);
  const members = useMembers(project?.memberIds);
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (loading) {
    return (
      <div role="status" className="mx-auto grid w-full max-w-xl gap-4">
        <span className="sr-only">Loading settings...</span>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
      </div>
    );
  }
  if (error === "denied") {
    return (
      <StateMessage title="Access denied">
        You aren't a member of this project, or it doesn't exist.
      </StateMessage>
    );
  }
  if (error) {
    return <StateMessage title="Project not found">This project is unavailable.</StateMessage>;
  }
  if (project.ownerId !== user.uid) {
    return (
      <StateMessage title="Owner only" href={`/projects/${id}`} linkLabel="Back to project">
        Only the project owner can change these settings.
      </StateMessage>
    );
  }

  async function handleSave(values) {
    await updateProject(id, values);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleDelete() {
    await deleteProject(id);
    router.replace("/dashboard");
  }

  return (
    <div className="mx-auto grid w-full max-w-xl gap-6">
      <Link href={`/projects/${id}`} className="text-sm text-brand-600 hover:underline">
        &larr; Back to project
      </Link>
      <h1 className="text-2xl font-semibold">Project settings</h1>

      <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="mb-3 text-lg font-medium">Details</h2>
        {saved && (
          <p role="status" className="mb-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            Changes saved.
          </p>
        )}
        <ProjectForm
          initial={{ name: project.name, description: project.description ?? "" }}
          submitLabel="Save changes"
          onSubmit={handleSave}
        />
      </section>

      <MembersPanel
        project={project}
        members={members}
        onAdd={(email) => addMemberByEmail(project, email)}
        onRemove={(member) => removeMember(id, member.uid)}
      />

      <section className="rounded-xl bg-white p-5 ring-1 ring-red-200">
        <h2 className="text-lg font-medium text-red-700">Delete project</h2>
        <p className="mt-1 mb-3 text-sm text-slate-600">
          This permanently deletes the project and all of its tasks.
        </p>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete project
        </Button>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete project"
        message={`Delete "${project.name}" and all of its tasks? This can't be undone.`}
        confirmLabel="Delete project"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}