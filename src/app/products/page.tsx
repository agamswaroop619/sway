"use client";
import { Suspense } from "react";
import FilteredProducts from "@/app/components/FilteredProducts";

export const dynamic = "force-dynamic";

function ProductsContent() {
  return <FilteredProducts filterType="products" />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
