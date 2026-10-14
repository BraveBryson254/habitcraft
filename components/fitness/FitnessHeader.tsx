"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cx } from "@/lib/utils";
import { LogoMark, Avatar } from "@/components/Avatar";
import { openCoachChat } from "@/components/chat/openCoachChat";

const LINKS: Array<[string, string]> = [
  ["/", "Home"],
  ["/workouts", "Workouts"],
  ["/programs", "Programs"],
  ["/book", "Book a session"],
];

export function FitnessHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="hdr hdr-fit">
        <div className="wrap nav">
          <Link className="brand" href="/"><LogoMark />Habitcraft<em>Fitness</em></Link>
          <nav className="links">
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} className={cx(pathname === href && "on")}>{label}</Link>
            ))}
            <Link href="/store">Shop →</Link>
          </nav>
          <div className="nav-r">
            <button className="askb" onClick={() => openCoachChat()}>
              <Avatar size={34} />Ask Coach B
            </button>
            <Link className="btn btn-hot btn-sm" href="/book">Book — $97</Link>
            <button className="burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">☰</button>
          </div>
        </div>
      </header>
      <div className={`mnav${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)}>
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
        <Link href="/store">Visit the Store →</Link>
        <Link href="/about">About</Link>
        <Link href="/faq">FAQ</Link>
      </div>
    </>
  );
}
