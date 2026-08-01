"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, Timestamp, Bytes } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Complaint } from "@/app/dashboard/page";

export type ComplaintPoster = {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  userId?: string;
};

export function useComplaintDetail(complaintId: string) {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [poster, setPoster] = useState<ComplaintPoster | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!complaintId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError(null);

        // Fetch complaint document
        const complaintRef = doc(db, "complaints", complaintId);
        const complaintSnap = await getDoc(complaintRef);

        if (!complaintSnap.exists()) {
          if (isMounted) {
            setError(`Complaint ticket "${complaintId}" not found.`);
            setLoading(false);
          }
          return;
        }

        const data = complaintSnap.data();
        const createdAt = data.createdAt as Timestamp | undefined;
        const formattedDate = createdAt
          ? createdAt.toDate().toISOString().split("T")[0]
          : data.date || new Date().toISOString().split("T")[0];

        const fetchedComplaint: Complaint = {
          id: complaintSnap.id,
          category: data.category || "General",
          location: data.location || "N/A",
          priority: data.priority || "Medium",
          status: data.status || "Pending",
          date: formattedDate,
          description: data.description || "",
          technicianName: data.technicianName,
          technicianPhone: data.technicianPhone,
          assignedDate: data.assignedDate,
          remarks: data.remarks,
          userId: data.userId,
          completionPhotoUrl: data.completionPhotoUrl,
        };

        if (isMounted) {
          setComplaint(fetchedComplaint);
        }

        // Process complaint images if any (supports both the current
        // { data: Bytes, type, name } shape and legacy raw-Bytes entries)
        if (data.images && Array.isArray(data.images)) {
          const processedImages = data.images
            .map((img: unknown) => {
              if (typeof img === "string") return img;

              const isLegacy = img instanceof Bytes;
              const bytes: Bytes | undefined = isLegacy
                ? img
                : (img as { data?: Bytes })?.data;
              if (!bytes || typeof bytes.toBase64 !== "function") return "";

              const type = isLegacy ? "image/jpeg" : (img as { type?: string })?.type || "image/jpeg";
              return `data:${type};base64,${bytes.toBase64()}`;
            })
            .filter(Boolean);

          if (isMounted) {
            setImages(processedImages);
          }
        }

        // Fetch user ("Posted by") info if userId is present
        if (data.userId) {
          try {
            const userRef = doc(db, "users", data.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              if (isMounted) {
                setPoster({
                  name: userData.name || userData.displayName || "Community Member",
                  email: userData.email || "",
                  phone: userData.phone || "",
                  role: userData.role || "User",
                  userId: data.userId,
                });
              }
            } else {
              if (isMounted) {
                setPoster({
                  name: data.submittedBy || "Community Member",
                  userId: data.userId,
                });
              }
            }
          } catch (userErr) {
            console.error("Error fetching user details:", userErr);
            if (isMounted) {
              setPoster({
                name: data.submittedBy || "Community Member",
                userId: data.userId,
              });
            }
          }
        } else {
          if (isMounted) {
            setPoster({
              name: data.submittedBy || "Anonymous / Unspecified",
            });
          }
        }
      } catch (err: any) {
        console.error("Error fetching complaint details:", err);
        if (isMounted) {
          setError("Failed to load complaint details. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [complaintId]);

  return { complaint, poster, images, loading, error };
}
