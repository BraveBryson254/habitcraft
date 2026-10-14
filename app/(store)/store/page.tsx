import type { Metadata } from "next";
import { Suspense } from "react";
import { StoreListing } from "@/components/store/StoreListing";

export const metadata: Metadata = {
  title: "Store — fuel the plan, gear up",
  description: "A curated shelf of general-wellness supplements and training gear to go with your Habitcraft plan.",
};

export default function StorePage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: 60 }}>Loading the shelf…</div>}>
      <StoreListing />
    </Suspense>
  );
}
