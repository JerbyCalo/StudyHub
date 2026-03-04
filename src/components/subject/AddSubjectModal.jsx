"use client";

import { useState } from "react";
import { X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const PRESET_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
];

const PRESET_ICONS = [
  "Code",
  "BookOpen",
  "FlaskConical",
  "Calculator",
  "Globe",
  "Music",
];

/**
 * AddSubjectModal — modal to create a new subject.
 * Props: isOpen, onClose, onAdd
 */
export default function AddSubjectModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !code.trim()) return;

    setSubmitting(true);
    try {
      await onAdd({ name: name.trim(), code: code.trim(), color, icon });
      // Reset form
      setName("");
      setCode("");
      setColor(PRESET_COLORS[0]);
      setIcon(PRESET_ICONS[0]);
      onClose();
    } catch {
      // Error toast is handled in useSubjects
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Add New Subject</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-surface hover:text-gray-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subject Name */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Subject Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Data Structures"
            className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-muted"
          />
        </div>

        {/* Subject Code */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Subject Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. CS 201"
            className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-muted"
          />
        </div>

        {/* Color Picker */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Color
          </label>
          <div className="flex gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full transition-all ${
                  color === c
                    ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Icon Picker */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Icon
          </label>
          <div className="flex gap-2">
            {PRESET_ICONS.map((iconName) => {
              const IconComp = LucideIcons[iconName] || LucideIcons.BookOpen;
              return (
                <button
                  key={iconName}
                  onClick={() => setIcon(iconName)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                    icon === iconName
                      ? "border-brand bg-brand-muted text-brand-dark"
                      : "border-surface-border bg-white text-surface-muted hover:border-gray-300 hover:text-gray-700"
                  }`}
                  aria-label={`Select icon ${iconName}`}
                >
                  <IconComp className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-surface"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !code.trim() || submitting}
            className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <LoadingSpinner variant="button" />}
            {submitting ? "Creating..." : "Create Subject"}
          </button>
        </div>
      </div>
    </div>
  );
}
