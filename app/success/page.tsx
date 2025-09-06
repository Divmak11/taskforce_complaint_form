import type { Metadata } from "next";
import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "Complaint Submitted Successfully | StopVoteChori",
  description: "Your complaint has been successfully submitted to our Legal Task Force. Thank you for helping protect India's electoral democracy.",
  openGraph: {
    title: "Complaint Submitted Successfully | StopVoteChori",
    description: "Your complaint has been successfully submitted to our Legal Task Force. Thank you for helping protect India's electoral democracy.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complaint Submitted Successfully | StopVoteChori",
    description: "Your complaint has been successfully submitted to our Legal Task Force. Thank you for helping protect India's electoral democracy.",
  },
};

export default function SuccessPage() {
  return <SuccessClient />;
}
