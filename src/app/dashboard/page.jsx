"use client";

import { useState, useRef, useEffect } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useSubjects } from "@/hooks/useSubjects";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import SubjectGrid from "@/components/subject/SubjectGrid";
import AddSubjectModal from "@/components/subject/AddSubjectModal";
import { UserPlus, X } from "lucide-react";

export default function DashboardPage() {
  const { user, loading, userProfile } = useRequireAuth();
  const {
    subjects,
    loading: subjectsLoading,
    addSubject,
    deleteSubject,
    joinByCode,
  } = useSubjects(user?.uid);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const joinRef = useRef(null);

  // Close join popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (joinRef.current && !joinRef.current.contains(e.target)) {
        setJoinOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  const displayName = userProfile?.displayName || user.displayName || "Student";

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      await joinByCode(joinCode);
      setJoinCode("");
      setJoinOpen(false);
    } catch {
      // Error toast handled in hook
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        subjects={subjects}
        onAddSubject={() => setAddModalOpen(true)}
      />

      <div className="flex flex-1 flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-6 space-y-6">
          {/* Header row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {displayName} 👋
            </h1>

            {/* Join by Code button */}
            <div className="relative" ref={joinRef}>
              <button
                onClick={() => setJoinOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-surface"
              >
                <UserPlus className="h-4 w-4" />
                Join by Code
              </button>

              {joinOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-brand-brown bg-white p-4 shadow-lg animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-900">
                      Enter Share Code
                    </p>
                    <button
                      onClick={() => setJoinOpen(false)}
                      className="rounded p-0.5 text-surface-muted hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC123"
                    maxLength={6}
                    className="mb-3 w-full rounded-lg border border-brand-brown bg-white px-3 py-2 text-center text-lg font-bold tracking-widest text-gray-900 uppercase placeholder-gray-400 outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30 mono"
                  />
                  <button
                    onClick={handleJoinByCode}
                    disabled={joinCode.trim().length !== 6 || joining}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {joining && <LoadingSpinner variant="button" />}
                    {joining ? "Joining..." : "Join Subject"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Subjects */}
          {subjectsLoading ? (
            <LoadingSpinner fullPage={false} size="md" />
          ) : (
            <SubjectGrid
              subjects={subjects}
              currentUserId={user.uid}
              onDelete={deleteSubject}
              onAddSubject={() => setAddModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={addSubject}
      />
    </div>
  );
}
