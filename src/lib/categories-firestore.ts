/**
 * Shared helpers for the "categories" Firestore collection.
 *
 * Firestore document shape (collection: "categories", doc id = category id):
 *   name, slug, icon, parentId, path, level, order, serviceCount, isActive,
 *   createdAt (server timestamp), updatedAt (server timestamp)
 *
 * Query patterns enabled by the `path` array field:
 *   • All descendants of X  : where("path", "array-contains", X)
 *   • Direct children of X  : where("parentId", "==", X).orderBy("order")
 *   • Subtree delete of X   : where("path", "array-contains", X) → batch delete
 *   • Full tree (client render): getDocs(collection) → client sorts by level + order
 *
 * Composite indexes required in firestore.indexes.json:
 *   • parentId ASC + order ASC
 *   • path (array) ASC + order ASC   (for ordered subtree queries)
 */

import type { AdminCategory } from "@/lib/mock-admin";

/* ── Slugify ──────────────────────────────────────────────────── */
export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Build the `path` array for a new category.
 * The path is the parent's path extended by this category's own id.
 *
 * @param id       The new category's id (already generated)
 * @param parentId Null for root categories
 * @param all      Current full category list (used to look up parent's path)
 */
export function buildPath(
  id: string,
  parentId: string | null,
  all: AdminCategory[],
): string[] {
  if (!parentId) return [id];
  const parent = all.find((c) => c.id === parentId);
  if (!parent) return [id];
  return [...parent.path, id];
}

/**
 * After renaming/moving a node, rebuild paths for the entire subtree.
 * Returns a map of { id → newPath } for every affected node (including the node itself).
 */
export function rebuildSubtreePaths(
  rootId: string,
  all: AdminCategory[],
): Map<string, string[]> {
  const result = new Map<string, string[]>();

  function walk(id: string, parentPath: string[]) {
    const newPath = [...parentPath, id];
    result.set(id, newPath);
    for (const child of all.filter((c) => c.parentId === id)) {
      walk(child.id, newPath);
    }
  }

  const node = all.find((c) => c.id === rootId);
  if (!node) return result;

  const parentPath = node.parentId
    ? (all.find((c) => c.id === node.parentId)?.path ?? [])
    : [];

  walk(rootId, parentPath);
  return result;
}

/** Serialize an AdminCategory into a plain Firestore-writable object (no id field). */
export function serializeCategory(
  cat: AdminCategory,
): Record<string, unknown> {
  return {
    name:         cat.name,
    slug:         cat.slug,
    icon:         cat.icon,
    parentId:     cat.parentId,
    path:         cat.path,
    level:        cat.level,
    order:        cat.order,
    serviceCount: cat.serviceCount,
    isActive:     cat.isActive,
  };
}

/** Deserialize a Firestore document (with id injected) into AdminCategory. */
export function deserializeCategory(
  id: string,
  data: Record<string, unknown>,
): AdminCategory {
  return {
    id,
    name:         String(data.name ?? ""),
    slug:         String(data.slug ?? ""),
    icon:         String(data.icon ?? "📁"),
    parentId:     (data.parentId as string | null) ?? null,
    path:         Array.isArray(data.path) ? (data.path as string[]) : [id],
    level:        Number(data.level ?? 0),
    order:        Number(data.order ?? 0),
    serviceCount: Number(data.serviceCount ?? 0),
    isActive:     Boolean(data.isActive ?? true),
  };
}
