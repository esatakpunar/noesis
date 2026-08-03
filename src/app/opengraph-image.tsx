import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "noesis — 15 dakika araştır, 2 dakikada diksiyonla anlat.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#14110d",
          color: "#ede4d3",
          padding: 96,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#a89a80",
            marginBottom: 32,
          }}
        >
          noesis · zihin arşivi
        </div>
        <div style={{ fontSize: 68, fontStyle: "italic", lineHeight: 1.15, display: "flex" }}>
          <span>Zihnini&nbsp;</span>
          <span style={{ color: "#c1442e" }}>Yapay Zekadan</span>
        </div>
        <div style={{ fontSize: 68, fontStyle: "italic", lineHeight: 1.15 }}>Önce Sen Kullan</div>
        <div style={{ fontSize: 26, color: "#a89a80", marginTop: 40 }}>
          15 dakika araştır · 2 dakikada diksiyonla anlat
        </div>
      </div>
    ),
    { ...size },
  );
}
