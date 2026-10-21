"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { registerUser, loginUser, getAuthErrorMessage } from "@/services/auth";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const { user, loading } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && user && !saving) router.replace("/dashboard");
  }, [user, loading, saving, router]);

  function validate() {
    const found = {};
    if (isRegister && values.name.trim().length < 2) {
      found.name = "Enter your name (at least 2 characters).";
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      found.email = "Enter a valid email address.";
    }
    if (values.password.length < 6) {
      found.password = "Password must be at least 6 characters.";
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
      if (isRegister) {
        await registerUser({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        });
      } else {
        await loginUser({ email: values.email.trim(), password: values.password });
      }
      router.replace("/dashboard");
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
      setSaving(false);
    }
  }

  if (loading || (user && !saving)) {
    return <p role="status" className="text-center text-sm text-slate-500">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-brand-600">TaskFlow</h1>
        <p className="text-sm text-slate-500">
          {isRegister ? "Create your account" : "Sign in to your account"}
        </p>
      </div>

      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      {isRegister && (
        <Input id="name" name="name" label="Name" value={values.name} onChange={handleChange} error={errors.name} />
      )}
      <Input id="email" name="email" type="email" label="Email" value={values.email} onChange={handleChange} error={errors.email} />
      <Input id="password" name="password" type="password" label="Password" value={values.password} onChange={handleChange} error={errors.password} />

      <Button type="submit" disabled={saving}>
        {saving ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        {isRegister ? "Already have an account? " : "No account? "}
        <Link href={isRegister ? "/login" : "/register"} className="font-medium text-brand-600 hover:underline">
          {isRegister ? "Sign in" : "Create one"}
        </Link>
      </p>
    </form>
  );
}