"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    // TODO (Day 3): replace with Firebase Auth
    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-brand-600">TaskFlow</h1>
        <p className="text-sm text-slate-500">
          {isRegister ? "Create your account" : "Sign in to your account"}
        </p>
      </div>

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