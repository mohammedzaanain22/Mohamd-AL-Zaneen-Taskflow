"use client";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar({ userName, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-lg font-semibold text-brand-600">
          TaskFlow
        </Link>
        <button
          className="rounded-lg p-2 ring-1 ring-slate-300 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">Dashboard</Link>
          <span className="text-sm text-slate-500">{userName}</span>
          <Button variant="secondary" onClick={onLogout}>Log out</Button>
        </div>
      </nav>
      {open && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 md:hidden">
          <Link href="/dashboard" className="text-sm">Dashboard</Link>
          <span className="text-sm text-slate-500">{userName}</span>
          <Button variant="secondary" onClick={onLogout}>Log out</Button>
        </div>
      )}
    </header>
  );
}
