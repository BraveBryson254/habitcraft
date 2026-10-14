import React from "react";
import type { ProductArt as ArtKind } from "@/lib/products";

/**
 * Product illustration engine — original flat-vector packaging on plain
 * backgrounds (brief §6.5). No stock photos, no people; swap for real product
 * photos later via Product.images[] + next/image.
 */
export function ProductArt({
  type,
  color,
  label,
  labelColor = "#0a2230",
}: {
  type: ArtKind;
  color: string;
  label?: string;
  labelColor?: string;
}) {
  const Label = ({ y, h = 70 }: { y: number; h?: number }) =>
    label !== undefined && label !== "" ? (
      <>
        <rect x="44" y={y} width="112" height={h} rx="10" fill="#fff" />
        <rect x="44" y={y} width="112" height="12" rx="6" fill={labelColor} />
        <text x="100" y={y + h / 2 + 8} textAnchor="middle" fontFamily="Bricolage Grotesque,sans-serif" fontWeight="800" fontSize="15" fill={labelColor}>{label}</text>
        <text x="100" y={y + h - 10} textAnchor="middle" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="8" fill="#6b7f87">HABITCRAFT</text>
      </>
    ) : null;

  switch (type) {
    case "tub":
      return (
        <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="246" rx="70" ry="9" fill="#0a2230" opacity=".15" />
          <rect x="34" y="62" width="132" height="176" rx="22" fill={color} />
          <rect x="28" y="38" width="144" height="40" rx="14" fill="#0a2230" />
          <rect x="28" y="38" width="144" height="12" rx="6" fill="#fff" opacity=".18" />
          <rect x="42" y="74" width="12" height="150" rx="6" fill="#fff" opacity=".22" />
          <Label y={110} />
        </svg>
      );
    case "bottle":
      return (
        <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="248" rx="54" ry="8" fill="#0a2230" opacity=".15" />
          <rect x="62" y="24" width="76" height="34" rx="10" fill="#0a2230" />
          <rect x="74" y="56" width="52" height="22" fill={color} />
          <rect x="48" y="74" width="104" height="168" rx="26" fill={color} />
          <rect x="58" y="86" width="10" height="140" rx="5" fill="#fff" opacity=".25" />
          <Label y={112} h={76} />
        </svg>
      );
    case "pouch":
      return (
        <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="248" rx="64" ry="8" fill="#0a2230" opacity=".15" />
          <path d="M40,34 H160 L170,240 Q100,252 30,240Z" fill={color} />
          <path d="M40,34 H160 L162,52 H38Z" fill="#0a2230" opacity=".85" />
          <rect x="40" y="78" width="12" height="150" rx="6" fill="#fff" opacity=".2" />
          <Label y={100} h={84} />
        </svg>
      );
    case "shaker":
      return (
        <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="250" rx="52" ry="8" fill="#0a2230" opacity=".15" />
          <rect x="62" y="22" width="76" height="26" rx="12" fill={labelColor} />
          <rect x="86" y="10" width="28" height="16" rx="8" fill={labelColor} />
          <path d="M54,48 H146 L138,240 Q100,250 62,240Z" fill={color} opacity=".95" />
          <path d="M60,120 H142 L138,240 Q100,250 62,240Z" fill="#fff" opacity=".28" />
          <path d="M70,150 H134 M72,176 H132 M74,202 H130" stroke="#fff" strokeWidth="3" opacity=".6" />
        </svg>
      );
    case "bands":
      return (
        <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="246" rx="74" ry="9" fill="#0a2230" opacity=".15" />
          {([["#ff6a2b", 96, 78], ["#c8f542", 84, 68], ["#14b8a6", 72, 58], ["#ffb627", 60, 48]] as const).map(([c, rx, ry], i) => (
            <ellipse key={i} cx="100" cy={150 - i * 2} rx={rx} ry={ry} fill="none" stroke={c} strokeWidth="15" transform={`rotate(${-8 + i * 6} 100 150)`} />
          ))}
        </svg>
      );
    case "mat":
      return (
        <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="246" rx="70" ry="9" fill="#0a2230" opacity=".15" />
          <rect x="40" y="48" width="120" height="190" rx="18" fill={color} />
          <ellipse cx="100" cy="52" rx="60" ry="22" fill={color} />
          <ellipse cx="100" cy="52" rx="38" ry="12" fill="#0a2230" opacity=".28" />
          <ellipse cx="100" cy="52" rx="14" ry="5" fill="#fff" opacity=".6" />
          <rect x="50" y="64" width="9" height="160" rx="4" fill="#fff" opacity=".22" />
          <rect x="40" y="170" width="120" height="14" fill={labelColor} opacity=".9" />
        </svg>
      );
    case "rope":
      return (
        <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="248" rx="60" ry="8" fill="#0a2230" opacity=".15" />
          <path d="M52,60 C20,150 40,236 100,236 C160,236 180,150 148,60" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
          <rect x="42" y="30" width="20" height="62" rx="9" fill="#0a2230" />
          <rect x="138" y="30" width="20" height="62" rx="9" fill="#0a2230" />
          <rect x="46" y="38" width="12" height="10" rx="4" fill="#c8f542" />
          <rect x="142" y="38" width="12" height="10" rx="4" fill="#c8f542" />
        </svg>
      );
    default:
      return null;
  }
}

/** Category tile icon — a representative illustration per category. */
export function CategoryIcon({ category }: { category: string }) {
  const map: Record<string, React.ReactNode> = {
    protein: <ProductArt type="tub" color="#ff6a2b" label="PRO" />,
    daily: <ProductArt type="bottle" color="#14b8a6" label="DAILY" />,
    pre: <ProductArt type="pouch" color="#c8f542" label="FUEL" />,
    sleep: <ProductArt type="bottle" color="#8b7cf0" label="REST" />,
    gear: <ProductArt type="bands" color="#ff6a2b" label="" />,
    all: <ProductArt type="tub" color="#ffb627" label="ALL" />,
  };
  return <>{map[category] ?? null}</>;
}
