import { MessageCircle } from "lucide-react";
import { ClientModulePage } from "@/components/client/ClientModulePage";

export default function SupportChatPage() {
  return (
    <ClientModulePage
      title="Chat"
      eyebrow="Support"
      description="Chat with support when live messaging is enabled."
      icon={MessageCircle}
    />
  );
}
