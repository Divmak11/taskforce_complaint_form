import React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 600,
  height: 600,
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
    ? new URL("/og.png?v=2", siteUrl).toString()
    : "/og.png?v=2";
  const logoUrl = logoParam || defaultLogo;

  return new ImageResponse(
    (
      <div
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          boxSizing: "border-box",
          padding: 24,
        }}
      >
        <img
          src={logoUrl}
          alt="Logo"
          width={552}
          height={552}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
