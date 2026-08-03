export const ADMIN_ROLES = ["admin", "super admin"];
export const TECHNICIAN_ROLES = ["technician"];

export type RoleGroup = "admin" | "technician" | "student";

export function roleGroup(role: string | undefined | null): RoleGroup {
  const normalized = (role ?? "").toLowerCase();
  if (ADMIN_ROLES.includes(normalized)) return "admin";
  if (TECHNICIAN_ROLES.includes(normalized)) return "technician";
  return "student";
}
