import type { Metadata } from "next";
import StopVoteChoriClient from "./StopVoteChoriClient";

export const metadata: Metadata = {
  title: "Stop Vote Chori - Save Democracy in India | StopVoteChori Campaign",
  description: "Join the StopVoteChori campaign to protect India's electoral democracy. Learn how every citizen can become a sentinel of democracy and report electoral irregularities.",
  openGraph: {
    title: "Stop Vote Chori - Save Democracy in India | StopVoteChori Campaign",
    description: "Join the StopVoteChori campaign to protect India's electoral democracy. Learn how every citizen can become a sentinel of democracy and report electoral irregularities.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stop Vote Chori - Save Democracy in India | StopVoteChori Campaign",
    description: "Join the StopVoteChori campaign to protect India's electoral democracy. Learn how every citizen can become a sentinel of democracy and report electoral irregularities.",
  },
};

export default function StopVoteChoriPage() {
  return <StopVoteChoriClient />;
}
