import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientModulePageProps {
  title: string;
  eyebrow?: string;
  description: string;
  icon: LucideIcon;
  actions?: { label: string; icon?: LucideIcon }[];
  stats?: { title: string; value: string; detail: string; icon: LucideIcon }[];
}

export function ClientModulePage({
  title,
  eyebrow = "Client Portal",
  description,
  icon: Icon,
  actions = [],
  stats = [],
}: ClientModulePageProps) {
  return (
    <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
      <div className="client-page-shell flex w-full flex-col gap-6">
        <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 space-y-2">
            <Badge variant="outline" className="w-fit rounded-sm px-2 py-1 text-[11px] uppercase tracking-[0.16em]">
              {eyebrow}
            </Badge>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
          </div>

          {actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {actions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Button key={action.label} variant="outline" className="h-9 gap-2">
                    {ActionIcon && <ActionIcon className="size-4" />}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <Card key={stat.title} className="rounded-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <StatIcon className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="rounded-sm">
          <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-2">
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">
                This client-facing module is wired into the portal shell and ready for live backend data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
