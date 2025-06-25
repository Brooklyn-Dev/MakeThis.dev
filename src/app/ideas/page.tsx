import { Suspense } from "react";
import IdeasPageClient from "./page.client";

export default function IdeasPage() {
  return (
    <Suspense fallback={<p>Loading ideas...</p>}>
      <IdeasPageClient />;
    </Suspense>
  );
}
