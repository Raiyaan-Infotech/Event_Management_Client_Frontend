import { LayoutDashboard } from "lucide-react";
import { ClientModulePage } from "@/components/client/ClientModulePage";
import { clientModuleCards } from "@/config/client-nav";

export default function DashboardPage() {
  return (
    <ClientModulePage
      title="Dashboard"
      description="Overview of your event activity, subscription, payments, and support updates."
      icon={LayoutDashboard}
      stats={clientModuleCards}
    />
  );
}
