import type { Metadata } from "next";
import VoterAuditChatbot from '@/components/VoterAuditChatbot';

export const metadata: Metadata = {
  title: "Voter Audit Chatbot | Electoral Complaints | StopVoteChori",
  description: "Get help with electoral complaints and voter registration issues through our interactive chatbot. Report voting irregularities and get guidance on protecting your democratic rights.",
  openGraph: {
    title: "Voter Audit Chatbot | Electoral Complaints | StopVoteChori",
    description: "Get help with electoral complaints and voter registration issues through our interactive chatbot. Report voting irregularities and get guidance on protecting your democratic rights.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voter Audit Chatbot | Electoral Complaints | StopVoteChori",
    description: "Get help with electoral complaints and voter registration issues through our interactive chatbot. Report voting irregularities and get guidance on protecting your democratic rights.",
  },
};

export default function VoterAuditPage() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <VoterAuditChatbot />
    </div>
  );
}
