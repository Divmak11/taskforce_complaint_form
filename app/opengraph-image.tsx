import React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OGImage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const title = (searchParams.title || "VoteChori").toString();
  const subtitle = (searchParams.subtitle || "Legal Taskforce").toString();
  const logoParam = (searchParams.logo || "").toString();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const defaultLogo = siteUrl
    ? new URL("/og.png", siteUrl).toString()
    : "/og.png";
  const logoUrl = logoParam || defaultLogo;

  const red = "#AD1818";

  return new ImageResponse(
    (
      <div
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
          border: "1px solid #e5e7eb",
          padding: "48px",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src={logoUrl}
            alt="Logo"
            width={160}
            height={160}
            style={{ borderRadius: 12, border: "1px solid #e5e7eb", objectFit: "cover" }}
          />
          <div
            style={{
              padding: "6px 12px",
              border: `2px solid ${red}`,
              color: red,
              borderRadius: 9999,
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            #StopVoteChori
          </div>
        </div>

        {/* Title and subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 60, fontWeight: 800, color: "#111827" }}>{title}</div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#374151" }}>{subtitle}</div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{ width: 14, height: 14, background: red, borderRadius: 9999 }}
            />
            <div style={{ fontSize: 22, color: "#374151" }}>
              Campaign to protect the electoral democracy in Bihar
            </div>
          </div>
          <div style={{ fontSize: 20, color: "#6b7280" }}>stopvotechori.in</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
