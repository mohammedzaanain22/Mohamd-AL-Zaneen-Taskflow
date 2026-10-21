"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { mockUser } from "@/lib/mockData";

export default function AppShell({ children }) {
  const router = useRouter();
  return (
    <>
      <Navbar userName={mockUser.displayName} onLogout={() => router.push("/login")} />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </>
  );
}