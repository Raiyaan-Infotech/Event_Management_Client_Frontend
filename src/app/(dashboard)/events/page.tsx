import { CalendarDays } from "lucide-react";
import { ClientModulePage } from "@/components/client/ClientModulePage";

export default function EventsPage() {
  return (
    <ClientModulePage
      title="Event"
      description="View invitations, event schedules, and event-related updates shared by your vendor."
      icon={CalendarDays}
    />
  );
}
