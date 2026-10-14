import type { Metadata } from "next";
import { Programs } from "@/components/fitness/Programs";

export const metadata: Metadata = {
  title: "Programs & pricing",
  description: "The $97 Body Plan Session, the $997 12-week program (or 3 × $349), and a free workout library.",
};

export default function ProgramsPage() {
  return <Programs />;
}
