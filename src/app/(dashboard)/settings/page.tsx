import { Settings } from "lucide-react";
import { ClientModulePage } from "@/components/client/ClientModulePage";

export default function SettingsPage() {
  return (
    <ClientModulePage
      title="Setting"
      description="Update account preferences and security settings."
      icon={Settings}
    />
  );
}
