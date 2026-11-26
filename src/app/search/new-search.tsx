"use client";
import { useParams } from "next/navigation";
import FilteredProducts from "@/app/components/FilteredProducts";

export default function SearchResultsPage() {
  const params = useParams();
  const searchQuery = String(params.results).replace(/%20/g, " ");

  return <FilteredProducts filterType="search" searchQuery={searchQuery} />;
}
