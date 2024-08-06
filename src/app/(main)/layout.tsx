import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <Navbar />
      <div className="flex min-h-screen flex-col">
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </div>
    </SessionProvider>
  );
}
