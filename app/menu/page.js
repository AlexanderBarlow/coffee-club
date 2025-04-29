"use client"

import { Suspense } from "react";
import MenuContent from "@/components/MenuContent";
import LoadingFallback from "@/components/Loader"; // optional

export default function MenuPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MenuContent />
    </Suspense>
  );
}
