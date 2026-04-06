"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  FolderOpen,
  Tag,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import { type AdminCategory } from "@/lib/mock-admin";
import { slugify, buildPath } from "@/lib/categories-firestore";
import { useCategoriesListener } from "@/lib/hooks/use-categories-listener";
import { useAdminStore } from "@/store/admin";
import { AdminConfirmDialog } from "./admin-confirm-dialog";
import { cn } from "@/lib/utils";

/* ─── Layout constants ───────────────────────────────────────── */
const INDENT  = 32;  // px per depth level
const ROW_H   = 44;  // px — consistent row height

/* ─── Helpers ────────────────────────────────────────────────── */
function getChildren(cats: AdminCategory[], parentId: string | null) {
  return cats
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.order - b.order);
}

/** Flatten the tree into a display-order list, skipping collapsed subtrees. */
interface FlatItem extends AdminCategory {
  depth: number;
  hasChildren: boolean;
  isLastChild: boolean; // used for the tree-line connector
}

function flattenVisible(
  cats: AdminCategory[],
  collapsed: Set<string>,
  parentId: string | null = null,
  depth: number = 0,
): FlatItem[] {
  const children = getChildren(cats, parentId);
  return children.flatMap((cat, idx) => {
    const grandchildren = getChildren(cats, cat.id);
    const hasChildren   = grandchildren.length > 0;
    const isLastChild   = idx === children.length - 1;
    const row: FlatItem = { ...cat, depth, hasChildren, isLastChild };
    if (collapsed.has(cat.id) || !hasChildren) return [row];
    return [row, ...flattenVisible(cats, collapsed, cat.id, depth + 1)];
  });
}

/* ─── Inline edit / add form ─────────────────────────────────── */
interface InlineFormProps {
  initial?: { name: string; icon: string };
  depth:    number;
  onSave:   (name: string, icon: string) => void;
  onClose:  () => void;
}

function InlineForm({ initial, depth, onSave, onClose }: InlineFormProps) {
  const [name, setName]       = React.useState(initial?.name ?? "");
  const [icon, setIcon]       = React.useState(initial?.icon ?? "📁");
  const [touched, setTouched] = React.useState(false);
  const nameRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { nameRef.current?.focus(); }, []);

  /* Esc to cancel */
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const slug    = slugify(name);
  const isValid = name.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) { nameRef.current?.focus(); return; }
    onSave(name.trim(), icon);
  }

  /* Match exactly the same left-content offset as TreeRow */
  const contentLeft = 8 + INDENT * depth; // same as TreeRow paddingLeft

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-1.5 py-1.5 pr-3 bg-indigo-50/60 border-y border-indigo-100"
        style={{ paddingLeft: `${contentLeft}px` }}
      >
        <div className="flex items-center gap-2">
          {/* Icon input — larger touch target */}
          <div className="relative shrink-0">
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={2}
              className="w-10 h-8 text-center rounded-lg border border-gray-200 bg-white text-base leading-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all cursor-pointer"
              title="Emoji icon"
            />
          </div>

          {/* Name input */}
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => { setName(e.target.value); setTouched(false); }}
            placeholder="Category name…"
            className={cn(
              "flex-1 h-8 rounded-lg border bg-white px-3 text-[13px] text-gray-900 placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all",
              touched && !isValid ? "border-red-300 bg-red-50" : "border-gray-200",
            )}
          />

          {/* Save */}
          <button
            type="submit"
            className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shrink-0"
          >
            <Check className="h-3.5 w-3.5" />
            Save
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Live slug preview */}
        <div className="flex items-center gap-1.5 pl-12">
          <span className="text-[11px] text-gray-400">Slug:</span>
          <code className="text-[11px] font-mono text-gray-500 bg-white rounded px-1.5 py-0.5 border border-gray-100">
            {slug || "—"}
          </code>
          <span className="text-[10px] text-gray-400 ml-1">· Esc to cancel</span>
        </div>
      </form>
    </motion.div>
  );
}

/* ─── Tree row (single item, DnD-aware) ─────────────────────── */
interface TreeRowProps {
  item:          FlatItem;
  isExpanded:    boolean;
  isEditing:     boolean;
  isAdding:      boolean; // "add child" form open below this row
  isDragOverlay: boolean;
  showDropAbove: boolean;
  showDropBelow: boolean;
  activeDepth:   number | null; // depth of the item being dragged
  onToggle:      () => void;
  onEditStart:   () => void;
  onEditSave:    (name: string, icon: string) => void;
  onEditClose:   () => void;
  onDelete:      () => void;
  onAddChild:    () => void;
  onAddSave:     (name: string, icon: string) => void;
  onAddClose:    () => void;
}

function TreeRow({
  item,
  isExpanded,
  isEditing,
  isAdding,
  isDragOverlay,
  showDropAbove,
  showDropBelow,
  onToggle,
  onEditStart,
  onEditSave,
  onEditClose,
  onDelete,
  onAddChild,
  onAddSave,
  onAddClose,
}: TreeRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = isDragOverlay
    ? {}
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      };

  const depth      = item.depth;
  const contentLeft = 8 + INDENT * depth;

  /* Visual weight by depth */
  const nameCls = cn(
    "flex-1 min-w-0 truncate leading-none select-none",
    depth === 0 && "text-[13px] font-bold text-gray-900 tracking-tight",
    depth === 1 && "text-[13px] font-semibold text-gray-800",
    depth >= 2  && "text-[13px] font-medium text-gray-600",
    !item.isActive && "text-gray-400 line-through",
  );

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "opacity-40 pointer-events-none",
      )}
    >
      {/* ── Drop-above indicator ────────────────────────── */}
      {showDropAbove && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 z-10 rounded-full"
          style={{ left: `${contentLeft}px` }}
        />
      )}

      {/* ── Tree connector lines (vertical guides) ─────── */}
      {depth > 0 && !isDragOverlay && Array.from({ length: depth }, (_, i) => (
        <span
          key={i}
          className="absolute top-0 bottom-0 w-px bg-gray-200 pointer-events-none"
          style={{ left: `${8 + INDENT * i + INDENT / 2 - 0.5}px` }}
        />
      ))}

      {/* ── Row content ────────────────────────────────── */}
      {isEditing ? (
        <InlineForm
          initial={{ name: item.name, icon: item.icon }}
          depth={depth}
          onSave={onEditSave}
          onClose={onEditClose}
        />
      ) : (
        <div
          className={cn(
            "group flex items-center gap-1.5 pr-2 transition-colors duration-75",
            isDragOverlay
              ? "bg-white border border-indigo-200 shadow-xl rounded-lg ring-1 ring-indigo-100"
              : cn(
                  "rounded-md",
                  isOver
                    ? "bg-indigo-50"
                    : depth === 0
                      ? "hover:bg-gray-100/80"
                      : "hover:bg-gray-50",
                ),
          )}
          style={{
            height:      `${ROW_H}px`,
            paddingLeft: `${contentLeft}px`,
          }}
        >
          {/* Drag handle */}
          <button
            className={cn(
              "flex h-6 w-5 shrink-0 items-center justify-center rounded",
              "text-gray-300 transition-colors duration-100",
              isDragOverlay
                ? "text-indigo-400"
                : "opacity-0 group-hover:opacity-100 hover:text-gray-600 cursor-grab active:cursor-grabbing",
            )}
            {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
            tabIndex={-1}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>

          {/* Expand / leaf indicator */}
          <button
            onClick={onToggle}
            className={cn(
              "flex h-6 w-5 shrink-0 items-center justify-center rounded transition-colors",
              item.hasChildren
                ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                : "cursor-default",
            )}
            disabled={!item.hasChildren}
            tabIndex={-1}
          >
            {item.hasChildren ? (
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-150",
                  isExpanded && "rotate-90",
                )}
              />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-gray-200 block" />
            )}
          </button>

          {/* Emoji icon */}
          <span
            className="shrink-0 w-5 text-center text-[15px] leading-none select-none"
            aria-hidden
          >
            {item.icon}
          </span>

          {/* Name */}
          <span className={nameCls}>{item.name}</span>

          {/* ── Right-side meta ───────────────────────── */}
          {!isDragOverlay && (
            <>
              {/* Service count */}
              <span className="ml-auto shrink-0 text-[11px] text-gray-400 tabular-nums">
                {item.serviceCount > 0 ? `${item.serviceCount} services` : "—"}
              </span>

              {/* Depth badge */}
              <span className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                depth === 0 && "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-100",
                depth === 1 && "bg-gray-100 text-gray-500",
                depth >= 2  && "bg-gray-50 text-gray-400",
              )}>
                L{depth}
              </span>

              {/* Hover actions */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100 shrink-0">
                <button
                  onClick={onAddChild}
                  title="Add sub-category"
                  className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={onEditStart}
                  title="Edit"
                  className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={onDelete}
                  title="Delete"
                  className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Drop-below indicator ────────────────────────── */}
      {showDropBelow && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 z-10 rounded-full"
          style={{ left: `${contentLeft}px` }}
        />
      )}

      {/* ── "Add child" inline form ─────────────────────── */}
      <AnimatePresence>
        {isAdding && (
          <InlineForm
            depth={depth + 1}
            onSave={onAddSave}
            onClose={onAddClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── DragOverlay ghost card ─────────────────────────────────── */
function GhostCard({ item }: { item: FlatItem }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-0 rounded-lg bg-white border border-indigo-200 shadow-2xl ring-1 ring-indigo-100/50"
      style={{ height: `${ROW_H}px`, minWidth: "260px" }}>
      <GripVertical className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
      <span className="shrink-0 text-[15px] leading-none">{item.icon}</span>
      <span className="text-[13px] font-medium text-gray-800 truncate">{item.name}</span>
      <span className="ml-auto text-[10px] font-semibold rounded-md bg-indigo-100 text-indigo-600 px-1.5 py-0.5 shrink-0">
        L{item.depth}
      </span>
    </div>
  );
}

/* ─── Main CategoryTree ──────────────────────────────────────── */
interface CategoryTreeProps {
  initial: AdminCategory[];
}

export function CategoryTree({ initial }: CategoryTreeProps) {
  const { toast } = useAdminStore();

  /* ── Firestore listener — falls back to mock when offline ─── */
  const { categories: liveCategories, status } = useCategoriesListener(initial);
  const [categories, setCategories] = React.useState<AdminCategory[]>(liveCategories);

  /* Sync listener updates into local state (handles real-time changes from other tabs) */
  React.useEffect(() => {
    setCategories(liveCategories);
  }, [liveCategories]);

  const [collapsed,    setCollapsed]    = React.useState<Set<string>>(new Set());
  const [editingId,    setEditingId]    = React.useState<string | null>(null);
  const [addingUnder,  setAddingUnder]  = React.useState<string | null | "root">(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [saving,       setSaving]       = React.useState(false);

  /* ── DnD state ────────────────────────────────────────────── */
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId,   setOverId]   = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /* ── Derived data ─────────────────────────────────────────── */
  const flatItems = React.useMemo(
    () => flattenVisible(categories, collapsed),
    [categories, collapsed],
  );
  const flatIds = flatItems.map((f) => f.id);

  const activeItem = activeId ? flatItems.find((f) => f.id === activeId) ?? null : null;
  const overItem   = overId   ? flatItems.find((f) => f.id === overId)   ?? null : null;

  /* ── Tree expansion ───────────────────────────────────────── */
  const allRootsExpanded = categories
    .filter((c) => c.parentId === null)
    .every((c) => !collapsed.has(c.id));

  function toggleAll() {
    setCollapsed(
      allRootsExpanded
        ? new Set(categories.map((c) => c.id))
        : new Set(),
    );
  }

  function toggleNode(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /* ── API helpers ──────────────────────────────────────────── */
  async function apiPatch(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/categories/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
  }

  async function apiPost(body: Record<string, unknown>): Promise<AdminCategory> {
    const res = await fetch("/api/categories", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json() as { category: AdminCategory };
    return json.category;
  }

  async function apiDelete(id: string) {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
  }

  /* ── DnD handlers ─────────────────────────────────────────── */
  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id));
    setEditingId(null);
    setAddingUnder(null);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over ? String(over.id) : null);
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const fromIdx = flatIds.indexOf(String(active.id));
    const toIdx   = flatIds.indexOf(String(over.id));
    if (fromIdx === -1 || toIdx === -1) return;

    const draggedItem = flatItems[fromIdx];
    const targetItem  = flatItems[toIdx];

    /* Only reorder within the same parent */
    if (draggedItem.parentId !== targetItem.parentId) return;

    /* Optimistic update */
    let reordered: AdminCategory[] = [];
    setCategories((prev) => {
      const siblings = prev
        .filter((c) => c.parentId === draggedItem.parentId)
        .sort((a, b) => a.order - b.order);

      const fromSibIdx = siblings.findIndex((s) => s.id === draggedItem.id);
      const toSibIdx   = siblings.findIndex((s) => s.id === targetItem.id);
      if (fromSibIdx === -1 || toSibIdx === -1) return prev;

      reordered = arrayMove(siblings, fromSibIdx, toSibIdx).map((c, i) => ({ ...c, order: i }));
      const rest = prev.filter((c) => c.parentId !== draggedItem.parentId);
      return [...rest, ...reordered];
    });

    /* Persist */
    try {
      setSaving(true);
      await apiPatch(draggedItem.id, {
        reorder: reordered.map(({ id, order }) => ({ id, order })),
      });
      toast("Order saved", "success");
    } catch {
      toast("Failed to save order", "error");
      /* Revert */
      setCategories(liveCategories);
    } finally {
      setSaving(false);
    }
  }

  /* ── Mutations ────────────────────────────────────────────── */
  async function handleEditSave(id: string, name: string, icon: string) {
    const prev = categories;
    /* Optimistic */
    setCategories((cats) =>
      cats.map((c) => c.id === id ? { ...c, name, icon, slug: slugify(name) } : c),
    );
    setEditingId(null);

    try {
      setSaving(true);
      await apiPatch(id, { name, icon });
      toast("Category updated", "success");
    } catch {
      toast("Failed to save", "error");
      setCategories(prev);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSave(parentId: string | null, name: string, icon: string) {
    const siblings = categories
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.order - b.order);
    const parent = parentId ? categories.find((c) => c.id === parentId) : null;
    const level  = parent ? parent.level + 1 : 0;
    const id     = `cat-${Date.now()}`;
    const path   = buildPath(id, parentId, categories);

    /* Optimistic */
    const newCat: AdminCategory = {
      id, name, icon, parentId, path, level,
      slug:         slugify(name),
      order:        siblings.length,
      serviceCount: 0,
      isActive:     true,
    };
    setCategories((prev) => [...prev, newCat]);
    setAddingUnder(null);
    if (parentId) {
      setCollapsed((prev) => { const n = new Set(prev); n.delete(parentId); return n; });
    }

    try {
      setSaving(true);
      /* Server generates its own id; reconcile if listener is live */
      await apiPost({ name, icon, parentId });
      toast(`"${name}" created`, "success");
    } catch {
      toast("Failed to create category", "error");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    function descendants(pid: string): string[] {
      return categories
        .filter((c) => c.parentId === pid)
        .flatMap((c) => [c.id, ...descendants(c.id)]);
    }
    const toRemove = new Set([id, ...descendants(id)]);
    const snapshot = categories;

    /* Optimistic */
    setCategories((prev) => prev.filter((c) => !toRemove.has(c.id)));
    setDeleteTarget(null);

    try {
      setSaving(true);
      await apiDelete(id);
      toast("Category deleted", "success");
    } catch {
      toast("Failed to delete", "error");
      setCategories(snapshot);
    } finally {
      setSaving(false);
    }
  }

  /* ── Drop line direction ──────────────────────────────────── */
  const activeIdx = activeId ? flatIds.indexOf(activeId) : -1;
  const overIdx   = overId   ? flatIds.indexOf(overId)   : -1;
  const isSamePar = activeItem && overItem && activeItem.parentId === overItem.parentId;

  /* ── Summary counts ───────────────────────────────────────── */
  const roots    = categories.filter((c) => c.parentId === null).length;
  const total    = categories.length;
  const inactive = categories.filter((c) => !c.isActive).length;

  return (
    <div className="flex flex-col h-full select-none">

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-3 text-[12px]">
            <span className="font-semibold text-gray-700 tabular-nums">{total} total</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500 tabular-nums">{roots} root</span>
            {inactive > 0 && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-amber-600 tabular-nums">{inactive} inactive</span>
              </>
            )}
          </div>

          <button
            onClick={toggleAll}
            className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors"
          >
            {allRootsExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Connection badge */}
          {status === "connecting" && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin" /> Connecting…
            </span>
          )}
          {status === "live" && (
            <span className="flex items-center gap-1 text-[11px] text-green-600">
              <Wifi className="h-3 w-3" /> Live
            </span>
          )}
          {status === "offline" && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <WifiOff className="h-3 w-3" /> Offline
            </span>
          )}
          {saving && (
            <span className="flex items-center gap-1 text-[11px] text-indigo-500">
              <Loader2 className="h-3 w-3 animate-spin" /> Saving…
            </span>
          )}

          <button
            onClick={() => { setEditingId(null); setAddingUnder("root"); }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add category
          </button>
        </div>
      </div>

      {/* ── Column headers ──────────────────────────────────── */}
      <div className="flex items-center px-5 py-2 border-b border-gray-100 bg-gray-50 shrink-0">
        <span className="flex-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Name
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-14">
          Services
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-14">
          Level
        </span>
      </div>

      {/* ── Tree body ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* Root-level "add" form */}
        <AnimatePresence>
          {addingUnder === "root" && (
            <InlineForm
              depth={0}
              onSave={(name, icon) => handleAddSave(null, name, icon)}
              onClose={() => setAddingUnder(null)}
            />
          )}
        </AnimatePresence>

        {flatItems.length === 0 && addingUnder !== "root" ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <FolderOpen className="h-7 w-7 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No categories yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Click &ldquo;Add category&rdquo; to create your first.
            </p>
          </div>
        ) : (
          /* DnD sortable list — single DndContext for the entire tree */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={flatIds} strategy={verticalListSortingStrategy}>
              <div className="py-2 px-3">
                {flatItems.map((item) => {
                  const isExpanded  = !collapsed.has(item.id);
                  const isEditing   = editingId === item.id;
                  const isAdding    = addingUnder === item.id;

                  /* Drop indicators — only for same-parent items */
                  const showDropAbove = !!(
                    isSamePar &&
                    overId === item.id &&
                    activeId !== item.id &&
                    overIdx  <= activeIdx
                  );

                  const showDropBelow = !!(
                    isSamePar &&
                    overId === item.id &&
                    activeId !== item.id &&
                    overIdx > activeIdx
                  );

                  return (
                    <TreeRow
                      key={item.id}
                      item={item}
                      isExpanded={isExpanded}
                      isEditing={isEditing}
                      isAdding={isAdding}
                      isDragOverlay={false}
                      showDropAbove={showDropAbove}
                      showDropBelow={showDropBelow}
                      activeDepth={activeItem?.depth ?? null}
                      onToggle={() => toggleNode(item.id)}
                      onEditStart={() => { setAddingUnder(null); setEditingId(item.id); }}
                      onEditSave={(name, icon) => handleEditSave(item.id, name, icon)}
                      onEditClose={() => setEditingId(null)}
                      onDelete={() => setDeleteTarget(item.id)}
                      onAddChild={() => {
                        setEditingId(null);
                        setAddingUnder(item.id);
                        setCollapsed((prev) => {
                          const n = new Set(prev);
                          n.delete(item.id);
                          return n;
                        });
                      }}
                      onAddSave={(name, icon) => handleAddSave(item.id, name, icon)}
                      onAddClose={() => setAddingUnder(null)}
                    />
                  );
                })}
              </div>
            </SortableContext>

            {/* Elevated ghost shown while dragging */}
            <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.22,1,0.36,1)" }}>
              {activeItem ? <GhostCard item={activeItem} /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* ── Footer hint ─────────────────────────────────────── */}
      <div className="border-t border-gray-100 bg-gray-50 px-5 py-2 shrink-0 flex items-center gap-3">
        <Tag className="h-3.5 w-3.5 text-gray-300 shrink-0" />
        <p className="text-[11px] text-gray-400">
          Drag the <GripVertical className="inline h-3 w-3 -mt-0.5" /> handle to reorder within a level.
          Click <Plus className="inline h-3 w-3 -mt-0.5" /> to add a sub-category. Esc cancels editing.
        </p>
      </div>

      {/* ── Delete confirm ───────────────────────────────────── */}
      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Delete category"
        message="All sub-categories will also be deleted. Services in this category will become uncategorised. This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
