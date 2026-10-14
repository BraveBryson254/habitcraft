import Link from "next/link";
import { Avatar } from "@/components/Avatar";

export default function NotFound() {
  return (
    <section className="wrap" style={{ padding: "90px 24px", textAlign: "center" }}>
      <Avatar size={80} />
      <h1 style={{ fontSize: "clamp(36px,6vw,64px)", fontWeight: 800, margin: "20px 0 10px" }}>Page not found</h1>
      <p style={{ color: "var(--muted)", fontSize: 18, marginBottom: 28 }}>
        That page took a rest day. Let&apos;s get you back on track.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link className="btn btn-hot" href="/">Back to Fitness</Link>
        <Link className="btn btn-dark" href="/store">Visit the Store</Link>
      </div>
    </section>
  );
}
