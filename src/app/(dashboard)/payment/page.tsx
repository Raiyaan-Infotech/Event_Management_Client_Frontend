import { Receipt } from "lucide-react";
import { ClientModulePage } from "@/components/client/ClientModulePage";

export default function PaymentPage() {
  return (
    <ClientModulePage
      title="Payment"
      description="Track payment history, invoices, and transaction status."
      icon={Receipt}
    />
  );
}
