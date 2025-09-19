import { Suspense } from "react";
import PaymentSuccessPage from "@/components/PaymentSuccessPage";

export const dynamic = "force-dynamic"; 
export const fetchCache = "force-no-store";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
