import { clsx } from "clsx";
import Link from "next/link";
import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4">{children}</div>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("rounded-2xl bg-white shadow-sm ring-1 ring-line p-6", className)}>{children}</div>;
}

export function Button({
  children, href, onClick, variant="primary", type="button"
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}) {
  const cls = variant === "primary"
    ? "bg-royal text-white hover:brightness-90"
    : "bg-white text-navy ring-1 ring-line hover:bg-gray-50";
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition";
  if (href) return <Link className={clsx(base, cls)} href={href}>{children}</Link>;
  return <button type={type} onClick={onClick} className={clsx(base, cls)}>{children}</button>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none",
        "focus:border-royal focus:ring-2 focus:ring-royal/10",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx(
        "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none",
        "focus:border-royal focus:ring-2 focus:ring-royal/10",
        props.className
      )}
    />
  );
}
