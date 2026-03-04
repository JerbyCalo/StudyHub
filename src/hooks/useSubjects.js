"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

/**
 * Generate a 6-character uppercase alphanumeric share code.
 */
const generateShareCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * useSubjects — manages subjects for the logged-in user.
 * @param {string} userId — the current user's UID
 */
export const useSubjects = (userId) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for subjects where user is a member
  useEffect(() => {
    if (!userId) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "subjects"),
      where("memberIds", "array-contains", userId),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const subjectList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort by createdAt descending (newest first)
        subjectList.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });
        setSubjects(subjectList);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to subjects:", error);
        toast.error("Failed to load subjects.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  /**
   * Add a new subject.
   * @param {object} subjectData — { name, code, color, icon }
   * @returns {Promise<string>} — the new subject ID
   */
  const addSubject = async (subjectData) => {
    try {
      const subjectId = uuidv4();
      const shareCode = generateShareCode();

      await setDoc(doc(db, "subjects", subjectId), {
        id: subjectId,
        ownerId: userId,
        name: subjectData.name,
        code: subjectData.code,
        color: subjectData.color || "#6366f1",
        icon: subjectData.icon || "BookOpen",
        memberIds: [userId],
        shareCode,
        createdAt: serverTimestamp(),
      });

      toast.success(`"${subjectData.name}" created!`);
      return subjectId;
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to create subject.");
      throw error;
    }
  };

  /**
   * Delete a subject by ID.
   * @param {string} subjectId
   */
  const deleteSubject = async (subjectId) => {
    try {
      await deleteDoc(doc(db, "subjects", subjectId));
      toast.success("Subject deleted.");
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject.");
      throw error;
    }
  };

  /**
   * Join a subject by its 6-character share code.
   * @param {string} shareCode
   */
  const joinByCode = async (shareCode) => {
    try {
      const normalized = shareCode.trim().toUpperCase();
      if (normalized.length !== 6) {
        toast.error("Share code must be 6 characters.");
        return;
      }

      const q = query(
        collection(db, "subjects"),
        where("shareCode", "==", normalized),
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error("No subject found with that code.");
        return;
      }

      const subjectDoc = snapshot.docs[0];
      const subjectData = subjectDoc.data();

      // Check if user is already a member
      if (subjectData.memberIds?.includes(userId)) {
        toast.error("You're already in this subject.");
        return;
      }

      await updateDoc(doc(db, "subjects", subjectDoc.id), {
        memberIds: arrayUnion(userId),
      });

      toast.success(`Joined "${subjectData.name}"!`);
    } catch (error) {
      console.error("Error joining subject:", error);
      toast.error("Failed to join subject.");
      throw error;
    }
  };

  return {
    subjects,
    loading,
    addSubject,
    deleteSubject,
    joinByCode,
  };
};
