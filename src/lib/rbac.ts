import type { AuthenticatedUserDTO } from "@/api-client/auth";

export const ROLES = [
  "visitor",
  "member",
  "volunteer",
  "groupLeader",
  "ministryLeader",
  "deacon",
  "elder",
  "pastor",
  "seniorPastor",
  "admin",
  "devAdmin",
] as const;

export type Role = (typeof ROLES)[number];

export const ADMIN_ROLES: Role[] = ["admin", "devAdmin"];

export const MINISTRY_VOLUNTEER_COUNT_ROLES: Role[] = ["admin", "devAdmin", "pastor", "elder", "deacon"];

export function hasRole(user: AuthenticatedUserDTO | null, role: Role): boolean {
  return !!user?.roles.includes(role);
}

export function hasAnyRole(user: AuthenticatedUserDTO | null, roles: Role[]): boolean {
  return !!user && roles.some((role) => user.roles.includes(role));
}

export function isAdmin(user: AuthenticatedUserDTO | null): boolean {
  return hasAnyRole(user, ADMIN_ROLES);
}

export function isDevAdmin(user: AuthenticatedUserDTO | null): boolean {
  return hasRole(user, "devAdmin");
}

export function canViewMinistryVolunteerCount(
  user: AuthenticatedUserDTO | null,
  ministryId: string,
): boolean {
  if (hasAnyRole(user, MINISTRY_VOLUNTEER_COUNT_ROLES)) return true;
  return !!user?.leaderMinistryIds.includes(ministryId);
}

export function canManageMinistrySchedule(user: AuthenticatedUserDTO | null, ministryId: string): boolean {
  if (isAdmin(user)) return true;
  return !!user?.leaderMinistryIds.includes(ministryId);
}
