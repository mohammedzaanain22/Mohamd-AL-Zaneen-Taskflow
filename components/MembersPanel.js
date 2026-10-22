"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getFirestoreErrorMessage } from "@/lib/errors";

export default function MembersPanel({ project, members, onAdd, onRemove }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  const sorted = [...members].sort(
    (a, b) => Number(b.uid === project.ownerId) - Number(a.uid === project.ownerId)
  );

  async function handleAdd(e) {
    e.preventDefault();
    setMessage("");
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const added = await onAdd(value);
      setEmail("");
      setMessage(`${added.displayName} was added to the project.`);
    } catch (err) {
      setError(getFirestoreErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-labelledby="members-heading" className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
      <h2 id="members-heading" className="text-lg font-medium">
        Members ({project.memberIds.length})
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Only people who already have a TaskFlow account can be added.
      </p>

      <ul className="mt-4 grid gap-2">
        {sorted.map((m) => {
          const isOwner = m.uid === project.ownerId;
          return (
            <li key={m.uid} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {m.displayName}
                  {isOwner && (
                    <span className="ml-2 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      Owner
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-slate-500">{m.email}</p>
              </div>
              {!isOwner && (
                <Button
                  variant="secondary"
                  aria-label={`Remove ${m.displayName}`}
                  onClick={() => setRemoveTarget(m)}
                >
                  Remove
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleAdd} noValidate className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
        <Input
          id="memberEmail"
          name="email"
          type="email"
          label="Add member by email"
          placeholder="name@example.com"
          autoComplete="off"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setMessage("");
          }}
          error={error}
        />
        <Button type="submit" disabled={saving} className="w-full sm:mt-6 sm:w-auto">
          {saving ? "Adding..." : "Add member"}
        </Button>
      </form>

      {message && (
        <p role="status" className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
          {message}
        </p>
      )}

      <ConfirmDialog
        open={Boolean(removeTarget)}
        title="Remove member"
        message={`Remove ${removeTarget?.displayName} from this project? They will lose access, and their assigned tasks will become unassigned.`}
        confirmLabel="Remove"
        busyLabel="Removing..."
        onConfirm={async () => {
          await onRemove(removeTarget);
          setRemoveTarget(null);
        }}
        onCancel={() => setRemoveTarget(null)}
      />
    </section>
  );
}