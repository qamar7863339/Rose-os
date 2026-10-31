import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/config';
import { SystemRole, UserSessionProfile } from '../permissions/permissionsService';
import { WorkspaceService } from '../database/workspaceService';

const ADMIN_EMAILS = ['qamarmujtaba700@gmail.com', 'founder@agencyrose.ai'];
const DEFAULT_AGENCY_WORKSPACE = 'workspace-rose-agency';

// Mandatory Google Workspace OAuth scopes configured via set_up_oauth
export const GOOGLE_WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.freebusy',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
];

// In-memory OAuth access token cache (NEVER persisted to localStorage/sessionStorage per security rules)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const AuthService = {
  /**
   * Subscribes to Firebase auth state and resolves the user's RBAC profile from Firestore
   */
  subscribeToAuth(onProfile: (profile: UserSessionProfile | null, rawUser: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (!user) {
        cachedAccessToken = null;
        onProfile(null, null);
        return;
      }
      if (!isSigningIn && !cachedAccessToken) {
        cachedAccessToken = null;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userDocRef);

        let profile: UserSessionProfile;

        if (snap.exists()) {
          const data = snap.data();
          profile = {
            uid: user.uid,
            email: user.email,
            displayName: data.displayName || user.displayName || user.email?.split('@')[0] || 'User',
            role: data.role as SystemRole,
            workspaceId: data.workspaceId || DEFAULT_AGENCY_WORKSPACE,
            clientId: data.clientId,
            clientName: data.clientName,
          };
        } else {
          // Provision initial profile with strict role boundaries
          const emailLower = (user.email || '').toLowerCase();
          const isAdmin = ADMIN_EMAILS.includes(emailLower);
          const isAgencyStaff = emailLower.endsWith('@agencyrose.ai');
          
          // Strict RBAC: only root admins get super_admin, agency staff get team_member, external users get client role
          const role: SystemRole = isAdmin ? 'super_admin' : isAgencyStaff ? 'team_member' : 'client';
          const workspaceId = role === 'client' ? `workspace-client-${user.uid.slice(0, 8)}` : DEFAULT_AGENCY_WORKSPACE;

          profile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            role,
            workspaceId,
            clientId: role === 'client' ? `client-${user.uid.slice(0, 8)}` : undefined,
            clientName: role === 'client' ? user.displayName || 'Client Account' : undefined,
          };

          await setDoc(userDocRef, {
            id: user.uid,
            email: user.email,
            displayName: profile.displayName,
            role,
            workspaceId,
            clientId: profile.clientId,
            clientName: profile.clientName,
            createdAt: new Date().toISOString(),
          });

          if (isAdmin) {
            await setDoc(doc(db, 'admins', user.uid), {
              email: user.email,
              addedAt: new Date().toISOString(),
            });
          }
        }

        // Ensure workspace container exists
        await WorkspaceService.ensureWorkspaceExists(
          profile.workspaceId,
          profile.role === 'client' ? `${profile.displayName}'s Workspace` : 'ROSE AI Agency',
          profile.uid,
          profile.role === 'client' ? 'client' : 'agency'
        );

        onProfile(profile, user);
      } catch (err) {
        console.error('Failed to load user session profile:', err);
        // Security constraint: Never grant admin or team privileges on error
        onProfile(null, null);
      }
    });
  },

  /**
   * Register with Email & Password
   */
  async registerWithEmail(
    email: string,
    pass: string,
    displayName: string,
    requestedRole: SystemRole = 'team_member'
  ): Promise<UserSessionProfile> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    // Safety constraint: New public registrations must NEVER automatically receive super_admin unless in ADMIN_EMAILS
    const isAdmin = ADMIN_EMAILS.includes(email);
    const role: SystemRole = isAdmin ? 'super_admin' : requestedRole === 'super_admin' ? 'team_member' : requestedRole;
    const workspaceId = role === 'client' ? `workspace-client-${user.uid.slice(0, 8)}` : DEFAULT_AGENCY_WORKSPACE;

    const profile: UserSessionProfile = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || email.split('@')[0],
      role,
      workspaceId,
    };

    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: user.email,
      displayName: profile.displayName,
      role,
      workspaceId,
      createdAt: new Date().toISOString(),
    });

    if (isAdmin) {
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        addedAt: new Date().toISOString(),
      });
    }

    await WorkspaceService.ensureWorkspaceExists(workspaceId, `${displayName}'s Workspace`, user.uid, role === 'client' ? 'client' : 'agency');

    return profile;
  },

  /**
   * Log in with Email & Password
   */
  async loginWithEmail(email: string, pass: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, pass);
  },

  /**
   * Sign in with Google and request Google Workspace OAuth scopes
   */
  async signInWithGoogle(): Promise<UserSessionProfile | void> {
    try {
      isSigningIn = true;
      const provider = new GoogleAuthProvider();
      for (const scope of GOOGLE_WORKSPACE_SCOPES) {
        provider.addScope(scope);
      }
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
      }
      return;
    } catch (err: any) {
      console.error('[AuthService] Google Sign-In failed:', err);
      // Strictly remove any fallback that authenticates users as administrator when Google Sign-In fails!
      // Return accurate, actionable error messages without creating an authenticated session.
      const errorMsg =
        err?.code === 'auth/popup-blocked'
          ? 'Google Sign-In popup was blocked by browser settings. Please allow popups for this site and retry.'
          : err?.code === 'auth/popup-closed-by-user'
          ? 'Google Sign-In popup was closed before authentication completed.'
          : err?.code === 'auth/network-request-failed' || err?.message?.includes('validateOrigin')
          ? 'Google popup origin validation restricted in this preview container. Please authenticate using email and password, or open the app in a standalone browser tab.'
          : err?.message || 'Google Sign-In failed. Please try again or use email sign-in.';
      throw new Error(errorMsg);
    } finally {
      isSigningIn = false;
    }
  },

  /**
   * Explicitly authorize Google Workspace (Gmail, Calendar, Drive) OAuth access token
   */
  async connectGoogleWorkspace(): Promise<{ email: string | null; accessToken: string | null; mode: 'oauth' | 'sandbox_unavailable'; error?: string }> {
    try {
      isSigningIn = true;
      const provider = new GoogleAuthProvider();
      for (const scope of GOOGLE_WORKSPACE_SCOPES) {
        provider.addScope(scope);
      }
      provider.setCustomParameters({ prompt: 'consent' });
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        return {
          email: result.user.email,
          accessToken: null,
          mode: 'sandbox_unavailable',
          error: 'OAuth completed, but Google did not return a Workspace access token.',
        };
      }
      cachedAccessToken = credential.accessToken;
      return {
        email: result.user.email,
        accessToken: cachedAccessToken,
        mode: 'oauth',
      };
    } catch (err: any) {
      return {
        email: null,
        accessToken: null,
        mode: 'sandbox_unavailable',
        error:
          err?.code === 'auth/network-request-failed' || err?.message?.includes('validateOrigin')
            ? 'Google OAuth popup origin validation blocked by preview container. Open the app in a top-level browser tab or add the preview domain to Firebase Authorized Domains to obtain a live Google OAuth token.'
            : err?.message || 'Google Workspace OAuth authorization was cancelled or failed.',
      };
    } finally {
      isSigningIn = false;
    }
  },

  /**
   * Returns the in-memory Google Workspace OAuth access token (or null if not authorized)
   */
  getAccessToken(): string | null {
    return cachedAccessToken;
  },

  /**
   * 1-Click fast authentication for demo & iframe sandbox evaluation
   */
  /**
   * Dedicated sandbox authentication for testing and evaluation
   * Uses distinct test identities and authenticates through Firebase Auth.
   * NEVER impersonates production founder or administrator accounts.
   * Throws an error on authentication failure and NEVER returns an unauthenticated fallback session.
   */
  async signInAsDemoUser(role: SystemRole = 'super_admin'): Promise<UserSessionProfile> {
    const sandboxEmail =
      role === 'super_admin'
        ? 'sandbox-admin@test.roseos.internal'
        : role === 'team_member'
        ? 'sandbox-team@test.roseos.internal'
        : 'sandbox-client@test.roseos.internal';
    const sandboxPass = 'RoseOS-Sandbox-2025!Security';
    const sandboxName =
      role === 'super_admin' ? 'Sandbox Admin' : role === 'team_member' ? 'Sandbox Specialist' : 'Aura Dynamics Client';
    const workspaceId = role === 'client' ? 'workspace-client-auradynamics' : DEFAULT_AGENCY_WORKSPACE;

    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, sandboxEmail, sandboxPass);
    } catch (loginErr: any) {
      if (
        loginErr?.code === 'auth/user-not-found' ||
        loginErr?.code === 'auth/invalid-credential' ||
        loginErr?.code === 'auth/wrong-password'
      ) {
        try {
          cred = await createUserWithEmailAndPassword(auth, sandboxEmail, sandboxPass);
        } catch (createErr: any) {
          console.error('[AuthService] Sandbox account provisioning failed:', createErr);
          throw new Error(`Sandbox user creation failed: ${createErr?.message || 'Firebase error'}`);
        }
      } else {
        throw new Error(`Sandbox authentication failed: ${loginErr?.message || 'Authentication error'}`);
      }
    }

    if (!cred?.user) {
      throw new Error('Authentication failed: No valid Firebase session established.');
    }

    const profile: UserSessionProfile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: sandboxName,
      role,
      workspaceId,
      clientId: role === 'client' ? 'client-1' : undefined,
      clientName: role === 'client' ? 'Aura Dynamics' : undefined,
    };

    try {
      await setDoc(
        doc(db, 'users', cred.user.uid),
        {
          id: cred.user.uid,
          email: cred.user.email,
          displayName: sandboxName,
          role,
          workspaceId,
          clientId: profile.clientId,
          clientName: profile.clientName,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      if (role === 'super_admin') {
        await setDoc(
          doc(db, 'admins', cred.user.uid),
          {
            email: cred.user.email,
            addedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      await WorkspaceService.ensureWorkspaceExists(
        workspaceId,
        role === 'client' ? `${sandboxName}'s Workspace` : 'ROSE AI Agency',
        cred.user.uid,
        role === 'client' ? 'client' : 'agency'
      );
    } catch (dbErr) {
      console.warn('[AuthService] Firestore sync for sandbox user:', dbErr);
    }

    return profile;
  },

  /**
   * Retrieves the active Firebase ID token for trusted server-side authentication
   */
  async getIdToken(): Promise<string | null> {
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken(false);
    } catch {
      return null;
    }
  },

  /**
   * Send Password Reset Email
   */
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  /**
   * Sign out current user and clear cached access token
   */
  async logout(): Promise<void> {
    cachedAccessToken = null;
    await signOut(auth);
  },
};
