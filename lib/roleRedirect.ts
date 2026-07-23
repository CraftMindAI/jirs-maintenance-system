export function dashboardPathForRole(role: string | undefined): string {
  switch ((role ?? "").toLowerCase()) {
    case "technician":
      return "/technician";
    case "admin":
      return "/admin";
    default:
      return "/dashboard";
  }
}
