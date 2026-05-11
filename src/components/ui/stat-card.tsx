import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  trend?: "increase" | "decrease";
}

export function StatCard({ title, value, icon: Icon, iconColor, bgColor, trend }: StatCardProps) {
  return (
    <Card className="border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl bg-white overflow-hidden">
      <CardContent className="p-7">
        <div className="flex items-center justify-between">
          <div className="relative">
            <div className={`${bgColor} p-0 rounded-full size-20 flex items-center justify-center`}>
              <div className={`${iconColor} bg-white rounded-full size-12 flex items-center justify-center shadow-lg`}>
                 <Icon className="size-5" />
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end z-10">
            <span className="text-[11px] font-extrabold text-[#64748b] tracking-[0.15em] mb-1.5 uppercase">
              {title}
            </span>
            <span className="text-3xl font-[1000] text-[#1e293b] tracking-tight mb-2 font-poppins">
              {value}
            </span>
            {trend && (
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                trend === 'increase' 
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' 
                  : 'bg-red-500/10 text-red-600 border-red-500/10'
              }`}>
                <div className="flex items-center justify-center animate-bounce-subtle">
                  {trend === 'increase' ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                </div>
                <span className="text-[11px] font-black leading-none capitalize">
                  {trend}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
