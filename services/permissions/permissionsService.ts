import { UserRole } from '@/types';

export type SystemRole = 'super_admin' | 'team_member' | 'client';

export interface UserSessionProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: SystemRole;
  workspaceId: string;
  clientId?: string;
  clientName?: string;
}

export const Permissions = {
  isSuperAdmin(profile: UserSessionProfile | null): boolean {
    if (!profile) return false;
    return profile.role === 'super_admin';
  },

  isTeamMember(profile: UserSessionProfile | null): boolean {
    if (!profile) return false;
    return profile.role === 'team_member' || profile.role === 'super_admin';
  },

  isClient(profile: UserSessionProfile | null): boolean {
    if (!profile) return false;
    return profile.role === 'client';
  },

  canManageClients(profile: UserSessionProfile | null): boolean {
    return this.isSuperAdmin(profile) || this.isTeamMember(profile);
  },

  canManageAgents(profile: UserSessionProfile | null): boolean {
    return this.isSuperAdmin(profile) || this.isTeamMember(profile);
  },

  canManageBilling(profile: UserSessionProfile | null): boolean {
    return this.isSuperAdmin(profile);
  },

  canConfigureWorkspace(profile: UserSessionProfile | null): boolean {
    return this.isSuperAdmin(profile);
  },

  canAccessWorkspace(profile: UserSessionProfile | null, targetWorkspaceId: string): boolean {
    if (!profile) return false;
    if (this.isSuperAdmin(profile)) return true;
    return profile.workspaceId === targetWorkspaceId;
  },

  canViewClientRecord(profile: UserSessionProfile | null, targetClientId: string): boolean {
    if (!profile) return false;
    if (this.isSuperAdmin(profile) || this.isTeamMember(profile)) return true;
    return profile.clientId === targetClientId;
  },
};
