import { encryptTechToken } from "@/lib/encryption";

export function dashboardPathForRole(role: string | undefined, userId?: string, userName?: string): string {
  switch ((role ?? "").toLowerCase()) {
    case "technician": {
      const token = encryptTechToken(userId, userName || "technician");
      return `/profile/v2/${token}/dashboard`;
    }
    case "admin":
      return "/admin";
    default:
      return "/dashboard";
  }
}
