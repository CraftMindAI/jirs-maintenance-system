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
