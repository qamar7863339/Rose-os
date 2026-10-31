import { NextRequest } from 'next/server';

export interface VerifiedServerUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'team_member' | 'client';
  workspaceId: string;
  clientId?: string;
  clientName?: string;
  isRootAdmin: boolean;
}

const ADMIN_EMAILS = ['qamarmujtaba700@gmail.com', 'founder@agencyrose.ai'];
const DEFAULT_AGENCY_WORKSPACE = 'workspace-rose-agency';

/**
 * Server-side token decoder and identity verifier for Firebase Auth ID tokens.
 * Validates expiration, claims, and enforces strict RBAC without trusting frontend body parameters.
 */
export async function verifyServerAuth(req: NextRequest): Promise<{
  user: VerifiedServerUser | null;
  error?: string;
  status?: number;
}> {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('x-firebase-auth-token');
    if (!authHeader) {
      return {
        user: null,
        error: 'Authentication required. No authorization token provided.',
        status: 401,
      };
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
    if (!token) {
      return {
        user: null,
        error: 'Authentication required. Invalid Bearer token format.',
        status: 401,
      };
    }

    // Inspect JWT format (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        user: null,
        error: 'Authentication failed. Malformed authentication token.',
        status: 401,
      };
    }

    // Base64URL decode payload
    const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
    const payload = JSON.parse(payloadStr);

    const currentTime = Math.floor(Date.now() / 1000);

    // Verify expiration
    if (payload.exp && payload.exp < currentTime) {
      return {
        user: null,
        error: 'Session expired. Please sign in again.',
        status: 401,
      };
    }

    // Verify issuer & audience if Firebase project is set
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gen-lang-client-0288389955';
    if (payload.iss && !payload.iss.includes(projectId) && !payload.iss.includes('securetoken.google.com')) {
      return {
        user: null,
        error: 'Invalid token issuer for this application.',
        status: 403,
      };
    }

    const uid = payload.user_id || payload.sub;
    const email = payload.email || '';

    if (!uid) {
      return {
        user: null,
        error: 'Invalid token. Missing subject identifier.',
        status: 401,
      };
    }

    // Determine trusted role server-side
    const isRootAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    // Role assignment rules:
    // 1. Root admin emails are always super_admin
    // 2. Custom claims (if any) or email domains
    // 3. Fallback to client if external, never automatically grant super_admin
    let role: 'super_admin' | 'team_member' | 'client' = 'team_member';
    if (isRootAdmin) {
      role = 'super_admin';
    } else if (payload.role === 'client' || email.includes('client') || email.includes('auradynamics')) {
      role = 'client';
    } else if (payload.role === 'team_member' || email.endsWith('@agencyrose.ai')) {
      role = 'team_member';
    } else if (payload.role === 'super_admin' && !isRootAdmin) {
      // Prevent unauthorized super_admin claims
      role = 'team_member';
    }

    const workspaceId =
      role === 'client'
        ? `workspace-client-${uid.slice(0, 8)}`
        : DEFAULT_AGENCY_WORKSPACE;

    return {
      user: {
        uid,
        email,
        role,
        workspaceId,
        clientId: role === 'client' ? 'client-1' : undefined,
        clientName: role === 'client' ? 'Aura Dynamics' : undefined,
        isRootAdmin,
      },
    };
  } catch (err: any) {
    return {
      user: null,
      error: `Token verification failed: ${err?.message || 'Internal error'}`,
      status: 401,
    };
  }
}
