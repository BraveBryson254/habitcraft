import { FitnessHeader } from "@/components/fitness/FitnessHeader";
import { Footer } from "@/components/Footer";

/** Fitness site chrome (brief §4 header). */
export default function FitnessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FitnessHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}
