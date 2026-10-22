"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/services/auth";

export default function AppShell({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  async function handleLogout() {
    await logoutUser();
    router.replace("/login");
  }

  if (loading || !user) {
    return (
      <p role="status" className="p-6 text-center text-sm text-slate-500">
        Loading...
      </p>
    );
  }

  return (
    <>
      <Navbar userName={user.displayName || user.email} onLogout={handleLogout} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>    </>
  );
}