import type { Metadata } from "next";
import ElectoralDemocracyClient from "./ElectoralDemocracyClient";

export const metadata: Metadata = {
  title: "Join Electoral Democracy Taskforce | StopVoteChori",
  description: "Join the Electoral Democracy Taskforce across district court premises in India. Independent advocates, bar associations and law students invited to safeguard electoral democracy.",
  openGraph: {
    title: "Join Electoral Democracy Taskforce | StopVoteChori",
    description: "Join the Electoral Democracy Taskforce across district court premises in India. Independent advocates, bar associations and law students invited to safeguard electoral democracy.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Electoral Democracy Taskforce | StopVoteChori",
    description: "Join the Electoral Democracy Taskforce across district court premises in India. Independent advocates, bar associations and law students invited to safeguard electoral democracy.",
  },
};

export default function ElectoralDemocracyPage() {
  return <ElectoralDemocracyClient />;
}
