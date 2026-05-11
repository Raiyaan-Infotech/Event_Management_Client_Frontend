import { Smartphone } from "lucide-react";
import { ClientModulePage } from "@/components/client/ClientModulePage";

export default function MobileThemePage() {
  return (
    <ClientModulePage
      title="Mobile Theme"
      description="Manage mobile display preferences for your client portal experience."
      icon={Smartphone}
    />
  );
}
