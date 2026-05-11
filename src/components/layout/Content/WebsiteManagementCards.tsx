import {
  CalendarDays,
  Users,
  Globe,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

const stats = [
  {
    id: 1,
    title: "EVENTS",
    value: "1,587",
    icon: CalendarDays,
    iconColor: "text-[#4F46E5]",
    bgColor: "bg-[#4F46E5]/10",
    trend: "increase",
  },
  {
    id: 2,
    title: "CLIENTS",
    value: "46,782",
    icon: Users,
    iconColor: "text-[#EF4444]",
    bgColor: "bg-[#EF4444]/10",
    trend: "increase",
  },
  {
    id: 3,
    title: "VISITORS",
    value: "1,890",
    icon: Globe,
    iconColor: "text-[#10B981]",
    bgColor: "bg-[#10B981]/10",
    trend: "increase",
  },
];

export default function WebsiteManagementCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stats.map((s) => (
        <StatCard key={s.id} title={s.title} value={s.value} icon={s.icon} iconColor={s.iconColor} bgColor={s.bgColor} trend={s.trend as "increase" | "decrease"} />
      ))}
    </div>
  );
}
