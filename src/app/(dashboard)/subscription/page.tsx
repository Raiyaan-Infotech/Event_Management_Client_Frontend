"use client";

import { Clock, CreditCard, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type ClientSubscriptionPlan, useClientSubscriptionPlans } from "@/hooks/use-client-subscription";

const formatPrice = (price: string | null) => {
  if (!price || Number(price) === 0) return "Free";
  return `INR ${Number(price).toLocaleString("en-IN")}`;
};

function PlanCard({ plan }: { plan: ClientSubscriptionPlan }) {
  const isCustom = plan.is_custom === 1;
  const hasDiscount = plan.discounted_price && Number(plan.discounted_price) > 0;

  return (
    <div className={`relative overflow-hidden rounded-sm border bg-card shadow-sm ${isCustom ? "border-violet-200 dark:border-violet-500/30" : "border-border"}`}>
      <div className={`h-1 w-full ${isCustom ? "bg-violet-500" : "bg-primary"}`} />
      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-sm ${isCustom ? "bg-violet-500/10 text-violet-600" : "bg-primary/10 text-primary"}`}>
              {isCustom ? <Star className="size-5" /> : <CreditCard className="size-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black uppercase tracking-tight text-foreground">{plan.name}</h3>
              {plan.description && <p className="mt-1 line-clamp-2 text-xs font-medium text-muted-foreground">{plan.description}</p>}
            </div>
          </div>
          <Badge variant="outline" className={`shrink-0 rounded-sm text-[10px] font-black uppercase tracking-widest ${isCustom ? "border-violet-200 text-violet-600" : "border-primary/20 text-primary"}`}>
            {isCustom ? "Vendor Custom" : "Common"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <span className={`text-3xl font-black tracking-tight ${isCustom ? "text-violet-600" : "text-primary"}`}>
            {formatPrice(plan.discounted_price ?? plan.price)}
          </span>
          {hasDiscount && <span className="mb-1 text-sm font-bold text-muted-foreground line-through">{formatPrice(plan.price)}</span>}
          {plan.validity && <span className="mb-1 text-xs font-bold text-muted-foreground">/ {plan.validity} days</span>}
        </div>

        {plan.validity && (
          <div className="inline-flex items-center gap-2 rounded-sm bg-muted px-3 py-1.5">
            <Clock className="size-3.5 text-muted-foreground" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Valid for {plan.validity} days</span>
          </div>
        )}

        {plan.features && (
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Features Included</p>
            <div
              className="prose prose-sm max-w-none text-foreground [&_li]:text-sm [&_p]:my-1 [&_p]:text-sm [&_ul]:space-y-1"
              dangerouslySetInnerHTML={{ __html: plan.features }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const { data, isLoading, isError } = useClientSubscriptionPlans();

  if (isLoading) {
    return (
      <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
        <div className="client-page-shell space-y-6">
          <Skeleton className="h-14 w-72 rounded-sm" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-72 rounded-sm" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Zap className="mx-auto mb-3 size-10 text-muted-foreground" />
          <p className="text-sm font-bold text-muted-foreground">Failed to load subscription plans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
      <div className="client-page-shell space-y-6">
        <div className="flex flex-col gap-1 border-b border-border pb-5">
          <Badge variant="outline" className="w-fit rounded-sm px-2 py-1 text-[11px] uppercase tracking-[0.16em]">
            Client Portal
          </Badge>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <CreditCard className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Subscription</h1>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            View common plans and custom plans assigned by your vendor.
          </p>
        </div>

        {(data.custom_plans ?? []).length > 0 && (
          <div className="flex items-center gap-3 rounded-sm border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-500/20 dark:bg-violet-500/10">
            <Star className="size-4 shrink-0 text-violet-600" />
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
              Custom vendor plans are shown first. Common plans are also available below.
            </p>
          </div>
        )}

        {(data.plans ?? []).length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(data.plans ?? []).map((plan) => <PlanCard key={plan.id} plan={plan} />)}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-border bg-card p-10 text-center">
            <CreditCard className="mx-auto mb-3 size-8 text-muted-foreground" />
            <p className="text-sm font-bold text-muted-foreground">No subscription plans available</p>
          </div>
        )}
      </div>
    </div>
  );
}


