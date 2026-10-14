import { StoreHeader } from "@/components/store/StoreHeader";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Footer } from "@/components/Footer";

/** Store site chrome (brief §5). Orange theme applied via body.mode-store. */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHeader />
      <main>{children}</main>
      <Footer store />
      <CartDrawer />
    </>
  );
}
