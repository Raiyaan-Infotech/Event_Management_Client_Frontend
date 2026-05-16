import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toPublicSlug } from "@/lib/utils";

export interface ClientSubscriptionPlan {
  id: number;
  name: string;
  description: string | null;
  price: string;
  discounted_price: string | null;
  validity: number | null;
  features: string | null;
  is_custom: number;
  vendor_id: number | null;
}

export interface ClientSubscriptionResponse {
  type: "custom_plus_common" | "common";
  custom_plans: ClientSubscriptionPlan[];
  common_plans: ClientSubscriptionPlan[];
  plans: ClientSubscriptionPlan[];
}

const normalizePlan = (plan: any): ClientSubscriptionPlan => ({
  id: Number(plan.id),
  name: String(plan.name ?? "Untitled Plan"),
  description: plan.description ?? null,
  price: String(plan.price ?? "0"),
  discounted_price: plan.discounted_price ?? null,
  validity: plan.validity ?? null,
  features: plan.features ?? null,
  is_custom: Number(plan.is_custom ?? 0),
  vendor_id: plan.vendor_id ?? null,
});

const loadClientSubscriptionPlans = async (): Promise<ClientSubscriptionResponse> => {
  try {
    const response = await apiClient.get("/vendors/client/subscription/plans");
    const payload = response.data?.data ?? response.data ?? {};
    const custom_plans = Array.isArray(payload.custom_plans) ? payload.custom_plans.map(normalizePlan) : [];
    const common_plans = Array.isArray(payload.common_plans) ? payload.common_plans.map(normalizePlan) : [];
    const plans = Array.isArray(payload.plans) ? payload.plans.map(normalizePlan) : [...custom_plans, ...common_plans];

    return {
      type: payload.type ?? "common",
      custom_plans,
      common_plans,
      plans,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) throw error;

    const meResponse = await apiClient.get("/vendors/client/auth/me");
    const vendorName = meResponse.data?.data?.client?.vendor?.company_name;
    const slug = vendorName ? toPublicSlug(vendorName) : "";
    if (!slug) throw error;

    const publicResponse = await apiClient.get(`/public/vendors/${encodeURIComponent(slug)}/website-data`);
    const common_plans = Array.isArray(publicResponse.data?.data?.plans)
      ? publicResponse.data.data.plans.map((plan: any) => normalizePlan({ ...plan, is_custom: 0, vendor_id: null }))
      : [];

    return {
      type: "common",
      custom_plans: [],
      common_plans,
      plans: common_plans,
    };
  }
};

export const useClientSubscriptionPlans = () =>
  useQuery({
    queryKey: ["client-subscription-plans"],
    queryFn: loadClientSubscriptionPlans,
    staleTime: 5 * 60 * 1000,
  });
