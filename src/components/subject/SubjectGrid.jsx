"use client";

import SubjectCard from "./SubjectCard";
import EmptyState from "@/components/ui/EmptyState";

/**
 * SubjectGrid — responsive grid of SubjectCards.
 * Props: subjects, currentUserId, onDelete, onAddSubject
 */
export default function SubjectGrid({
  subjects,
  currentUserId,
  onDelete,
  onAddSubject,
}) {
  if (!subjects || subjects.length === 0) {
    return (
      <EmptyState
        icon="BookOpen"
        title="No subjects yet"
        description="Create your first subject or join one with a share code."
        actionLabel="Add Subject"
        onAction={onAddSubject}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          currentUserId={currentUserId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
