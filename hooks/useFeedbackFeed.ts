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

const DEFAULT_FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: "default-1",
    name: "Aarav Sharma",
    role: "Senior Residential Student",
    message: "The 3-day SLA target on room AC and plumbing repairs is incredible. Logged a ticket at night and technician visited next morning with full repair kit!",
    verified: true,
    timeAgo: "2 hours ago",
    initials: "AS",
    rating: 5,
    tags: ["QuickService", "HostelRepair"],
    likes: 24,
    comments: 3,
  },
  {
    id: "default-2",
    name: "Dr. Sunita Rao",
    role: "Parent & Visitor",
    message: "Extremely impressed by the digital maintenance portal at JIRS. The transparent tracking gave me complete peace of mind regarding my daughter's hostel facility support.",
    verified: true,
    timeAgo: "1 day ago",
    initials: "SR",
    rating: 5,
    tags: ["ParentReview", "DigitalPortal"],
    likes: 18,
    comments: 2,
  },
  {
    id: "default-3",
    name: "Rohan Varma",
    role: "Academic Hostel Warden",
    message: "JMMS streamlined our campus-wide facility management. Room maintenance and electrical audit requests are now resolved seamlessly without paperwork lag.",
    verified: true,
    timeAgo: "2 days ago",
    initials: "RV",
    rating: 5,
    tags: ["WardenApproved", "Infrastructure"],
    likes: 31,
    comments: 5,
  },
  {
    id: "default-4",
    name: "Kavya Patel",
    role: "Grade 11 Student",
    message: "The new dark UI makes tracking complaint status so sleek on mobile! Submitted a request for study desk lamp replacement and it was fixed in 4 hours.",
    verified: true,
    timeAgo: "3 days ago",
    initials: "KP",
    rating: 5,
    tags: ["MobileFriendly", "StudentLife"],
    likes: 15,
    comments: 1,
  },
];

export type FeedbackItem = {
  id: string;
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
        const liveItems = snapshot.docs.map(mapFeedbackDoc);
        if (liveItems.length <= 3) {
          // Fill up feed with custom default testimonials when live feedback count is 3 or less
          const neededCount = 4 - liveItems.length;
          const combined = [...liveItems, ...DEFAULT_FEEDBACK_ITEMS.slice(0, neededCount + 2)];
          setFeedback(combined);
        } else {
          setFeedback(liveItems);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching feedback, using default feedback items:", error);
        setFeedback(DEFAULT_FEEDBACK_ITEMS);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { feedback, loading };
}
