/**
 * Helper utility to generate encrypted token for technician profile v2 endpoints.
 * Formula: base64url encode of (technicianId + ":" + technicianName/role)
 */

export function encryptTechToken(technicianId?: string | null, technicianName?: string | null): string {
  const id = technicianId || "tech";
  const name = (technicianName || "technician").toLowerCase().replace(/\s+/g, "");
  const raw = `${id}:${name}`;
  if (typeof window !== "undefined") {
    return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(raw).toString("base64url");
}

export function decryptTechToken(token: string): { id: string; name: string } {
  try {
    let base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const decoded = typeof window !== "undefined" ? atob(base64) : Buffer.from(base64, "base64").toString("utf-8");
    const [id, name] = decoded.split(":");
    return { id: id || "tech", name: name || "technician" };
  } catch (e) {
    return { id: "tech", name: "technician" };
  }
}

/**
 * Helper utility to generate encrypted token for student/staff profile v1 endpoints.
 * Formula: base64url encode of (userId + ":" + userRole)
 */
export function encryptUserToken(userId?: string | null, userRole?: string | null): string {
  const id = userId || "user";
  const role = (userRole || "student").toLowerCase().replace(/\s+/g, "");
  const raw = `${id}:${role}`;
  if (typeof window !== "undefined") {
    return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(raw).toString("base64url");
}

export function decryptUserToken(token: string): { id: string; role: string } {
  try {
    let base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const decoded = typeof window !== "undefined" ? atob(base64) : Buffer.from(base64, "base64").toString("utf-8");
    const [id, role] = decoded.split(":");
    return { id: id || "user", role: role || "student" };
  } catch (e) {
    return { id: "user", role: "student" };
  }
}

/**
 * Helper utility to generate encrypted token for admin profile v3 endpoints.
 * Formula: base64url encode of (userId + ":" + userRole)
 */
export function encryptAdminToken(userId?: string | null, userRole?: string | null): string {
  const id = userId || "admin";
  const role = (userRole || "admin").toLowerCase().replace(/\s+/g, "");
  const raw = `${id}:${role}`;
  if (typeof window !== "undefined") {
    return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(raw).toString("base64url");
}

export function decryptAdminToken(token: string): { id: string; role: string } {
  try {
    let base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const decoded = typeof window !== "undefined" ? atob(base64) : Buffer.from(base64, "base64").toString("utf-8");
    const [id, role] = decoded.split(":");
    return { id: id || "admin", role: role || "admin" };
  } catch (e) {
    return { id: "admin", role: "admin" };
  }
}
