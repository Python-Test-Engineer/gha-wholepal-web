"use client";

import * as React from "react";
import {
  Pagination as RootPagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const getPageNumbers = (
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
): (number | "...")[] => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const delta = 1;
  const range: (number | "...")[] = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  range.push(1);

  if (left > 2) {
    range.push("...");
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) {
    range.push("...");
  }

  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
};

const Pagination: FunctionComponent<{
  paginationConfig?: App.PaginationConfig;
}> = ({ paginationConfig }) => {
  const { currentPage, perPage, total, onChangePage } = paginationConfig;
  const pageNumbers = getPageNumbers(currentPage, total, perPage);
  const totalPages = Math.ceil(total / perPage);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <RootPagination className="w-max mx-0">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              "cursor-pointer",
              isFirstPage && "pointer-events-none"
            )}
            onClick={() => onChangePage(currentPage - 1)}
          />
        </PaginationItem>
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                className={cn(
                  "cursor-pointer",
                  currentPage === page &&
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                )}
                onClick={() => onChangePage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            className={cn(
              "cursor-pointer",
              isLastPage && "pointer-events-none"
            )}
            onClick={() => onChangePage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </RootPagination>
  );
};

export default Pagination;
