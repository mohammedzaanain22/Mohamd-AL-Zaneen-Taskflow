"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { getFirestoreErrorMessage } from "@/lib/errors";

function ConfirmBody({ message, confirmLabel, onConfirm, onCancel }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setSaving(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(getFirestoreErrorMessage(err));
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-slate-600">{message}</p>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button type="button" variant="danger" onClick={handleConfirm} disabled={saving}>
          {saving ? "Deleting..." : confirmLabel}
        </Button>
      </div>
    </div>
  );
}

export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <ConfirmBody message={message} confirmLabel={confirmLabel} onConfirm={onConfirm} onCancel={onCancel} />
    </Modal>
  );
}