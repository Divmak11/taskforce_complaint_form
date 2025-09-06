import type { Metadata } from "next";
import LegalTaskforceClient from "./LegalTaskforceClient";

export const metadata: Metadata = {
  title: "File Electoral Complaint | Legal Task Force | StopVoteChori",
  description: "Report electoral irregularities and complaints through our Legal Task Force. File your complaint about election malpractices and help protect India's democracy.",
  openGraph: {
    title: "File Electoral Complaint | Legal Task Force | StopVoteChori",
    description: "Report electoral irregularities and complaints through our Legal Task Force. File your complaint about election malpractices and help protect India's democracy.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "File Electoral Complaint | Legal Task Force | StopVoteChori",
    description: "Report electoral irregularities and complaints through our Legal Task Force. File your complaint about election malpractices and help protect India's democracy.",
  },
};

export default function LegalTaskforcePage() {
  return <LegalTaskforceClient />;
}
