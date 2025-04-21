import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading order...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
