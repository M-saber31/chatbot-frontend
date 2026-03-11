"use client";

import { Search, Loader, CheckCircle, AlertCircle } from "lucide-react";

type SearchResultsProps = {
  query: string;
  status: "executing" | "inProgress" | "complete" | "error";
};

export function SearchResults({ query, status }: SearchResultsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 my-2">
      <div className="flex items-center gap-2 mb-2">
        <Search className="h-4 w-4 text-blue-500" />
        <h3 className="text-sm font-medium text-gray-800">Searching...</h3>
      </div>

      <p className="text-xs text-gray-500 mb-2">Query: {query}</p>

      {(status === "executing" || status === "inProgress") && (
        <div className="flex items-center gap-2 text-xs text-blue-500">
          <Loader className="h-3 w-3 animate-spin" />
          <span>{status === "executing" ? "Searching..." : "Processing..."}</span>
        </div>
      )}

      {status === "complete" && (
        <div className="flex items-center gap-2 text-xs text-green-500">
          <CheckCircle className="h-3 w-3" />
          <span>Complete</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" />
          <span>Error</span>
        </div>
      )}
    </div>
  );
}
