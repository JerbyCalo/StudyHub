"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, X } from "lucide-react";

/**
 * Sidebar — subject list sidebar.
 * Props: isOpen, onClose, subjects (from useSubjects), onAddSubject
 */
export default function Sidebar({
  isOpen,
  onClose,
  subjects = [],
  onAddSubject,
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-brand-brown bg-brand-teal-dark transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header (mobile only — close button) */}
        <div className="flex h-16 items-center justify-between border-b border-brand-brown px-4 lg:hidden">
          <span className="text-lg font-bold text-white">Subjects</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar title (desktop only) */}
        <div className="hidden lg:flex h-16 items-center border-b border-brand-brown px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
            My Subjects
          </span>
        </div>

        {/* Subject list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {subjects.map((subject) => {
            const isActive = pathname === `/subject/${subject.id}`;
            return (
              <Link
                key={subject.id}
                href={`/subject/${subject.id}`}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${
                    isActive
                    ? "bg-brand-yellow text-brand-teal-dark"
                    : "text-white/80 hover:bg-white/10"
                  }
                `}
              >
                {/* Color accent bar */}
                <span
                  className="h-8 w-1 rounded-full shrink-0"
                  style={{ backgroundColor: subject.color }}
                />
                <div className="min-w-0">
                  <p className="truncate">{subject.name}</p>
                  <p
                    className={`text-xs ${
                      isActive ? "text-brand-teal-dark" : "text-white/50"
                    }`}
                  >
                    {subject.code}
                  </p>
                </div>
              </Link>
            );
          })}

          {subjects.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-white/50">
              No subjects yet
            </p>
          )}
        </nav>

        {/* Add Subject button — pinned at bottom */}
        <div className="border-t border-brand-brown p-3">
          <button
            onClick={() => {
              if (onAddSubject) onAddSubject();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-yellow px-4 py-2.5 text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-brand-gold"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>
      </aside>
    </>
  );
}
