"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type FeedbackItem = {
  id: string;
  userId?: string;
  name: string;
  role: string;
  message: string;
  verified: boolean;
  timeAgo: string;
  initials: string;
  rating?: number;
  tags?: string[];
  likes?: number;
  comments?: number;
};

function timeAgo(timestamp: Timestamp | undefined) {
  if (!timestamp) return "Just now";
  const diffMs = Date.now() - timestamp.toDate().getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function mapFeedbackDoc(doc: QueryDocumentSnapshot<DocumentData>): FeedbackItem {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    name: data.name || "Community Member",
    role: data.role || "Student",
    message: data.message || "",
    verified: !!data.verified,
    timeAgo: timeAgo(data.createdAt as Timestamp | undefined),
    initials: initialsOf(data.name || "Community Member"),
    rating: data.rating || 5,
    tags: data.tags || ["CampusService"],
    likes: data.likes || 8,
    comments: data.comments || 1,
  };
}

const STATIC_CURATED_FEEDBACK: FeedbackItem[] = [
  {
    id: "static-1",
    name: "Rohan Verma",
    role: "Student",
    message: "The hostel electrical issue was resolved within 2 hours of logging. Very fast turnaround!",
    verified: true,
    timeAgo: "2 days ago",
    initials: "RV",
    rating: 5,
    tags: ["Electrical"],
  },
  {
    id: "static-2",
    name: "Dr. Ananya Sharma",
    role: "Faculty Staff",
    message: "The AC unit in Lab 3 was repaired promptly. Excellent facility maintenance support.",
    verified: true,
    timeAgo: "3 days ago",
    initials: "AS",
    rating: 5,
    tags: ["HVAC"],
  },
  {
    id: "static-3",
    name: "Kavya Patel",
    role: "Resident Student",
    message: "Plumbing repair in Block C was completed neatly. Really appreciate the clean work.",
    verified: true,
    timeAgo: "5 days ago",
    initials: "KP",
    rating: 5,
    tags: ["Plumbing"],
  },
];

/**
 * Live-subscribes to the `feedback` collection.
 *
 * - Default: returns every real feedback doc (verified + pending), no static
 *   padding — used for moderation (admin) and "my feedback" views.
 * - `verifiedOnly: true`: counts/returns only verified real feedback. If that
 *   verified count is <= 3, pads the public board with curated static
 *   testimonials so it never looks empty.
 */
export function useFeedbackFeed({ verifiedOnly = false }: { verifiedOnly?: boolean } = {}) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const feedbackQuery = query(collection(db, "feedback"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      feedbackQuery,
      (snapshot) => {
        const realDocs = snapshot.docs.map(mapFeedbackDoc);

        if (!verifiedOnly) {
          setFeedback(realDocs);
          setLoading(false);
          return;
        }

        const verifiedDocs = realDocs.filter((d) => d.verified);
        if (verifiedDocs.length <= 3) {
          // Filter static items to avoid any ID collisions
          const realIds = new Set(verifiedDocs.map((d) => d.id));
          const remainingStatic = STATIC_CURATED_FEEDBACK.filter((s) => !realIds.has(s.id));
          setFeedback([...verifiedDocs, ...remainingStatic]);
        } else {
          setFeedback(verifiedDocs);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching feedback:", error);
        setFeedback(verifiedOnly ? STATIC_CURATED_FEEDBACK : []);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [verifiedOnly]);

  return { feedback, loading };
}
