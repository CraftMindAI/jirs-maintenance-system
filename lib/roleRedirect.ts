import { encryptTechToken, encryptUserToken, encryptAdminToken } from "@/lib/encryption";

export function dashboardPathForRole(role: string | undefined, userId?: string, userNameOrRole?: string): string {
  switch ((role ?? "").toLowerCase()) {
    case "technician": {
      const token = encryptTechToken(userId, userNameOrRole || "technician");
      return `/profile/v2/${token}/dashboard`;
    }
    case "admin": {
      const token = encryptAdminToken(userId, role || "admin");
      return `/profile/v3/${token}/dashboard`;
    }
    default: {
      const token = encryptUserToken(userId, role || "student");
      return `/profile/v1/${token}/dashboard`;
    }
  }
}
