"use client";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import FilteredProducts from "@/app/components/FilteredProducts";

export const dynamic = "force-dynamic";

function CategoryContent() {
  const params = useParams();
  const categoryName = String(params.category);

  return <FilteredProducts filterType="category" categoryName={categoryName} />;
}

export default function ShopCategoryPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading products...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
