"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { getFirestoreErrorMessage } from "@/lib/errors";

export default function ProjectForm({
  initial = { name: "", description: "" },
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  function validate() {
    const found = {};
    const name = values.name.trim();
    if (name.length < 3 || name.length > 80) {
      found.name = "Project name must be 3 to 80 characters.";
    }
    if (values.description.length > 1000) {
      found.description = "Description can't exceed 1000 characters.";
    }
    return found;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setFormError("");
    try {
      await onSubmit({ name: values.name.trim(), description: values.description.trim() });
    } catch (err) {
      setFormError(getFirestoreErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
   <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      <Input
        id="name"
        name="name"
        label="Project name"
        placeholder="e.g. Website redesign"
        maxLength={80}
        autoFocus
        hint="3 to 80 characters"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Textarea
        id="description"
        name="description"
        label="Description (optional)"
        placeholder="What is this project about?"
        maxLength={1000}
        rows={4}
        hint={`${values.description.length} / 1000`}
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={saving} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
          {saving ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}