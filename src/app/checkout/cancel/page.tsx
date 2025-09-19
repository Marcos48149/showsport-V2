import { Suspense } from "react";
import PaymentCancelPage from "@/components/PaymentCancelPage"; // mueve tu código aquí

export const dynamic = "force-dynamic";   // 🔑 evita el prerender en build
export const fetchCache = "force-no-store";
export default function CancelPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PaymentCancelPage />
    </Suspense>
  );
}