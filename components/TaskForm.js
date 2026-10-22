"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { getFirestoreErrorMessage } from "@/lib/errors";

export default function TaskForm({ task = null, members, canChangeStatus = true, onSubmit, onCancel }) {
  const isEdit = Boolean(task);
  const [values, setValues] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "medium",
    assigneeId: task?.assigneeId ?? "",
    dueDate: task?.dueDate ?? "",
    status: task?.status ?? "todo",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  function validate() {
    const found = {};
    const title = values.title.trim();
    if (title.length < 3 || title.length > 120) {
      found.title = "Title must be 3 to 120 characters.";
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
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority,
        assigneeId: values.assigneeId || null,
        dueDate: values.dueDate || null,
        ...(isEdit ? { status: values.status } : {}),
      });
    } catch (err) {
      setFormError(getFirestoreErrorMessage(err));
      setSaving(false);
    }
  }

  return (
    <form rm onSubmit={handleSubmit} noValidate className="grid gap-4">
      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>
      )}
      <Input id="title" name="title" label="Title" value={values.title} onChange={handleChange} error={errors.title} />
      <Textarea id="description" name="description" label="Description (optional)" value={values.description} onChange={handleChange} error={errors.description} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select id="priority" name="priority" label="Priority" value={values.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <Input id="dueDate" name="dueDate" type="date" label="Due date (optional)" value={values.dueDate} onChange={handleChange} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select id="assigneeId" name="assigneeId" label="Assignee" value={values.assigneeId} onChange={handleChange}>
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.uid} value={m.uid}>{m.displayName}</option>
          ))}
        </Select>

        {isEdit && (
          <Select
            id="status"
            name="status"
            label="Status"
            value={values.status}
            onChange={handleChange}
            disabled={!canChangeStatus}
            hint={canChangeStatus ? undefined : "Only the owner or the assignee can change the status."}
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </Select>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
