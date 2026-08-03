"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ADMIN_ROLES, TECHNICIAN_ROLES } from "@/lib/roles";

export type UserRoleState = {
  userId: string | null;
  role: string;
  isAdmin: boolean;
  isTechnician: boolean;
  loading: boolean;
};

/**
 * Resolves the signed-in user's uid and role (from their `users/{uid}` doc),
 * shared by any page that needs to gate actions or queries by role.
 */
export function useUserRole(): UserRoleState {
  const [state, setState] = useState<UserRoleState>({
    userId: null,
    role: "",
    isAdmin: false,
    isTechnician: false,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ userId: null, role: "", isAdmin: false, isTechnician: false, loading: false });
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        const role = (docSnap.exists() ? docSnap.data().role : "") || "";
        setState({
          userId: user.uid,
          role,
          isAdmin: ADMIN_ROLES.includes(role.toLowerCase()),
          isTechnician: TECHNICIAN_ROLES.includes(role.toLowerCase()),
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching user role:", error);
        setState({ userId: user.uid, role: "", isAdmin: false, isTechnician: false, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}
