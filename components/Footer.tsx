import Link from "next/link";
import { LogoMark } from "@/components/Avatar";
import { DISCLAIMER, SITE } from "@/lib/config";

/** Shared footer. `store` switches the branding to the Store variant. */
export function Footer({ store = false }: { store?: boolean }) {
  return (
    <footer className={store ? "sf" : undefined}>
      <div className="wrap">
        <div className="fg">
          <div>
            <Link className="brand" style={{ color: "#fff" }} href={store ? "/store" : "/"}>
              <LogoMark />Habitcraft<em style={{ color: store ? "var(--sun)" : "var(--teal)" }}>{store ? "Store" : "Fitness"}</em>
            </Link>
            <p className="disc">{DISCLAIMER}</p>
          </div>
          <div>
            <h5>{store ? "Shop" : "Fitness"}</h5>
            {store ? (
              <>
                <Link href="/store">All products</Link>
                <Link href="/store">Protein</Link>
                <Link href="/store">Training gear</Link>
                <Link href="/shipping">Shipping</Link>
              </>
            ) : (
              <>
                <Link href="/workouts">Workouts</Link>
                <Link href="/programs">Programs</Link>
                <Link href="/book">Book a session</Link>
                <Link href="/how-it-works">How it works</Link>
              </>
            )}
          </div>
          <div>
            <h5>Company</h5>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/faq">FAQ</Link>
            <Link href={store ? "/" : "/store"}>{store ? "Fitness site" : "Store"}</Link>
          </div>
          <div>
            <h5>Legal</h5>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/refund-policy">Refund policy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/ai-assistant">AI assistant</Link>
          </div>
        </div>
        <div className="fb">
          <span>© {SITE.year} {SITE.companyName}</span>
          <span>Secure payments by Stripe · Adults 18+</span>
        </div>
      </div>
    </footer>
  );
}
