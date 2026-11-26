"use client";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import FilteredProducts from "@/app/components/FilteredProducts";

export const dynamic = "force-dynamic";

function SearchContent() {
  const params = useParams();
  const searchQuery = String(params.results).replace(/%20/g, " ");

  return <FilteredProducts filterType="search" searchQuery={searchQuery} />;
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
