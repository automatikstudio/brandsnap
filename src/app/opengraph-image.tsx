import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BrandSnap — AI Brand Identity Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ background: "#0F080E", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 80px", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #EC4899, #8B5CF6)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "64px", fontWeight: 800, color: "#ffffff", letterSpacing: "-2px", display: "flex" }}>BrandSnap</div>
          <div style={{ fontSize: "32px", fontWeight: 500, color: "#EC4899", display: "flex" }}>AI Brand Identity Generator</div>
          <div style={{ fontSize: "24px", color: "#6B7280", maxWidth: "700px", lineHeight: 1.4, display: "flex" }}>Complete brand identity — colors, fonts, logo concepts, and guidelines in seconds.</div>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {["Colors", "Fonts", "Logo", "Guidelines", "Templates"].map((t) => (
            <div key={t} style={{ background: "#EC489920", border: "1px solid #EC489940", borderRadius: "12px", padding: "8px 20px", fontSize: "18px", color: "#EC4899", fontWeight: 600, display: "flex" }}>{t}</div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "18px", color: "#4B5563", display: "flex" }}>brandsnap-eight.vercel.app</div>
          <div style={{ fontSize: "18px", color: "#4B5563", display: "flex" }}>automatik.studio</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
