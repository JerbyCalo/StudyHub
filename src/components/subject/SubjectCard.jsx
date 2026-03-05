"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Copy, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

/**
 * SubjectCard — card for a single subject.
 * Props: subject, onDelete, currentUserId
 */
export default function SubjectCard({ subject, onDelete, currentUserId }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOwner = subject.ownerId === currentUserId;
  const memberCount = subject.memberIds?.length || 0;

  const handleCopyShareCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(subject.shareCode || "");
    toast.success("Share code copied!");
    setMenuOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onDelete) {
      onDelete(subject.id);
    }
  };

  const handleCardClick = () => {
    router.push(`/subject/${subject.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex cursor-pointer overflow-hidden rounded-xl border border-brand-brown bg-surface-card shadow-sm transition-shadow hover:shadow-md animate-fade-in"
    >
      {/* Color accent bar */}
      <div
        className="w-1.5 shrink-0"
        style={{ backgroundColor: subject.color }}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {subject.name}
            </h3>
            <p className="mt-0.5 text-sm text-surface-muted">{subject.code}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Member count badge */}
            <span className="rounded-full bg-brand-teal px-2.5 py-0.5 text-xs font-medium text-brand-teal-dark">
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>

            {/* Dropdown menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
                className="rounded-lg p-1 text-surface-muted transition-all hover:bg-surface hover:text-gray-700 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Subject options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-brand-brown bg-white py-1 shadow-lg animate-fade-in">
                  <button
                    onClick={handleCopyShareCode}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-surface"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Share Code
                  </button>
                  {isOwner && (
                    <button
                      onClick={handleDelete}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-surface-muted">
          <span>Click to view notes & files</span>
        </div>
      </div>
    </div>
  );
}
