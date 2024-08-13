import TrendingSidebar from "@/components/TrendingSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Messages</h1>
        </div>
        <p className="text-center">Messages Page: Under Construction</p>
      </div>
      <TrendingSidebar />
    </main>
  );
}
