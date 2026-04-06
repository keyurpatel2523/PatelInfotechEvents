"use client";

import { CategoryTree } from "@/components/admin/category-tree";
import { ADMIN_CATEGORIES } from "@/lib/mock-admin";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage the category hierarchy used across all marketplace services.
              Drag rows to reorder within each level.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-white">
        <CategoryTree initial={ADMIN_CATEGORIES} />
      </div>
    </div>
  );
}
