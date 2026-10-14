import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "@/components/store/OrderSuccess";

export const metadata: Metadata = { title: "Order confirmed" };

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: 80 }}>Confirming your order…</div>}>
      <OrderSuccess />
    </Suspense>
  );
}
