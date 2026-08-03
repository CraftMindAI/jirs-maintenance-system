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

/** Live-subscribes to the `feedback` collection, newest first. If <= 3 items exist, appends custom curated feedback items. */
export function useFeedbackFeed() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const feedbackQuery = query(collection(db, "feedback"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      feedbackQuery,
      (snapshot) => {
        setFeedback(snapshot.docs.map(mapFeedbackDoc));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching feedback:", error);
        setFeedback([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { feedback, loading };
}
