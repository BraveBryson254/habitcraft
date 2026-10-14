import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingStepper } from "@/components/fitness/BookingStepper";

export const metadata: Metadata = {
  title: "Book your session",
  description: "Book your $97 Body Plan Session — a 45-minute 1-on-1 video call with a real Habitcraft coach.",
};

export default function BookPage() {
  return (
    <Suspense fallback={<div className="bk"><div className="wrap">Loading…</div></div>}>
      <BookingStepper />
    </Suspense>
  );
}
