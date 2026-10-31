/**
 * ROSE AI OS — Security Invariants & Multi-Tenant Isolation Test Suite
 * Validates RBAC, Cross-Tenant Boundaries, Dirty Dozen Payloads, and Authentication Security
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

console.log('====================================================');
console.log('ROSE AI OS — FIREBASE SECURITY AUDIT & VERIFICATION');
console.log('====================================================\n');

// 1. Load firestore.rules and storage.rules
const firestoreRules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');
const storageRules = readFileSync(resolve(process.cwd(), 'storage.rules'), 'utf8');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName}: ${details}`);
  }
}

console.log('--- 1. AUDITING FIRESTORE SECURITY RULES SOURCE ---');

// Invariant 1: Default Deny catch-all exists
assert(
  firestoreRules.includes('match /{document=**} {\n      allow read, write: if false;\n    }') ||
    firestoreRules.includes('allow read, write: if false;'),
  'Default Deny Catch-all present at root',
  'All unhandled paths must default to deny'
);

// Invariant 2: Root Admin identity explicitly enforced
assert(
  firestoreRules.includes('request.auth.token.email == \'qamarmujtaba700@gmail.com\''),
  'Root Admin email whitelist strictly checks verified token email',
  'Must require verified root admin email'
);

// Invariant 3: Privilege escalation prevention in /users/{userId}
assert(
  firestoreRules.includes('incoming().diff(existing()).affectedKeys().hasOnly([\'displayName\', \'photoURL\'])'),
  'User document updates prevent self-role and workspaceId escalation',
  'Regular users must only be allowed to update displayName and photoURL'
);

// Invariant 4: No arbitrary public access to agency workspace
assert(
  !firestoreRules.includes("workspaceId == 'workspace-rose-agency' ||\n          exists"),
  'Agency workspace vulnerability removed (no blanket access to workspace-rose-agency)',
  'Arbitrary authenticated users must NOT automatically be members of the agency workspace'
);

// Invariant 5: CRM Leads strictly denied to clients
assert(
  firestoreRules.includes('CRM Leads Subcollection (Strictly Agency Only - Zero Client Access)') &&
    firestoreRules.includes('match /leads/{leadId} {\n        allow read: if isWorkspaceMember(workspaceId);'),
  'CRM Leads restricted strictly to verified agency members (Zero Client Access)',
  'Clients must not be able to read agency CRM leads'
);

// Invariant 6: Client A vs Client B isolation in client records
assert(
  firestoreRules.includes('clientId == getUserData().clientId') &&
    firestoreRules.includes('resource.data.email == request.auth.token.email'),
  'Client documents strictly isolated to matched clientId or token email',
  'Client A cannot read Client B client document'
);

// Invariant 7: Lead scoring bounds and non-negative value
assert(
  firestoreRules.includes('incoming().value >= 0') &&
    firestoreRules.includes('incoming().score >= 0 && incoming().score <= 100'),
  'Lead score bounds (0-100) and non-negative deal value strictly validated',
  'Denial of wallet / dirty payload injection blocked'
);

// Invariant 8: Task title non-empty validation
assert(
  firestoreRules.includes('incoming().title is string && incoming().title.size() > 0'),
  'Task validation prevents empty titles and enforces valid statuses',
  'Task integrity invariant'
);

// Invariant 9: Storage rules exist with multi-tenant isolation and 25MB limit
assert(
  storageRules.includes('rules_version = \'2\';') &&
    storageRules.includes('match /workspaces/{workspaceId}/{allPaths=**}') &&
    storageRules.includes('request.resource.size < 25 * 1024 * 1024'),
  'Cloud Storage rules enforce workspace isolation and 25MB upload limit',
  'Storage security invariant'
);

console.log('\n--- 2. SIMULATING RBAC MATRIX & CLIENT ISOLATION ---');

// Mock User Database & Workspaces
const users = {
  'uid-superadmin': {
    email: 'qamarmujtaba700@gmail.com',
    role: 'super_admin',
    workspaceId: 'workspace-rose-agency',
  },
  'uid-teammember': {
    email: 'sarah@agencyrose.ai',
    role: 'team_member',
    workspaceId: 'workspace-rose-agency',
  },
  'uid-client-a': {
    email: 'elena@auradynamics.com',
    role: 'client',
    workspaceId: 'workspace-client-aura',
    clientId: 'client-aura-1',
    clientName: 'Aura Dynamics',
  },
  'uid-client-b': {
    email: 'marcus@acmecorp.com',
    role: 'client',
    workspaceId: 'workspace-client-acme',
    clientId: 'client-acme-2',
    clientName: 'Acme Corp',
  },
};

const workspaceMembers = {
  'workspace-rose-agency': ['uid-superadmin', 'uid-teammember'],
  'workspace-client-aura': ['uid-client-a'],
  'workspace-client-acme': ['uid-client-b'],
};

// Simulation Security Evaluator
function evaluateAccess({ auth, operation, path, resourceData = {}, incomingData = {} }) {
  if (!auth) return false; // Unauthenticated -> always false

  const user = users[auth.uid];
  if (!user) return false;

  const isRootAdmin = auth.email === 'qamarmujtaba700@gmail.com' || auth.email === 'founder@agencyrose.ai';
  const isAdmin = isRootAdmin || user.role === 'super_admin';

  // Rule: /users/{userId}
  if (path.startsWith('users/')) {
    const targetUserId = path.split('/')[1];
    if (operation === 'get') return auth.uid === targetUserId || isAdmin;
    if (operation === 'update') {
      if (isAdmin) return true;
      if (auth.uid !== targetUserId) return false;
      // Check affected keys
      const disallowedKeys = ['role', 'workspaceId', 'clientId', 'isAdmin'];
      const hasDisallowed = Object.keys(incomingData).some((k) => disallowedKeys.includes(k));
      return !hasDisallowed;
    }
  }

  // Rule: /workspaces/{workspaceId}/...
  const match = path.match(/^workspaces\/([^\/]+)(?:\/([^\/]+)(?:\/([^\/]+))?)?$/);
  if (match) {
    const [, workspaceId, subcollection, docId] = match;

    const isMember =
      isAdmin ||
      (workspaceMembers[workspaceId] && workspaceMembers[workspaceId].includes(auth.uid)) ||
      (user.workspaceId === workspaceId && user.role !== 'client');

    // CRM Leads
    if (subcollection === 'leads') {
      if (operation === 'read') return isMember;
      if (operation === 'create' || operation === 'update') {
        if (!isMember) return false;
        if (incomingData.value < 0) return false;
        if (incomingData.score < 0 || incomingData.score > 100) return false;
        return true;
      }
      if (operation === 'delete') return isAdmin;
    }

    // Clients Subcollection
    if (subcollection === 'clients') {
      if (operation === 'read') {
        if (isMember) return true;
        if (user.role === 'client') {
          return docId === user.clientId || resourceData.email === auth.email;
        }
        return false;
      }
      return isAdmin;
    }

    // Projects Subcollection
    if (subcollection === 'projects') {
      if (operation === 'read') {
        if (isMember) return true;
        if (user.role === 'client') {
          return resourceData.clientId === user.clientId || resourceData.client === user.clientName;
        }
        return false;
      }
      return isMember;
    }

    // Default workspace document
    if (!subcollection) {
      return isMember || user.workspaceId === workspaceId;
    }
  }

  return false;
}

// TEST CASES
// 1. Unauthenticated User Access
assert(
  !evaluateAccess({
    auth: null,
    operation: 'read',
    path: 'workspaces/workspace-rose-agency/leads',
  }),
  'Scenario 1: Unauthenticated request to CRM leads is strictly DENIED'
);

assert(
  !evaluateAccess({
    auth: null,
    operation: 'read',
    path: 'workspaces/workspace-rose-agency/clients',
  }),
  'Scenario 2: Unauthenticated request to clients is strictly DENIED'
);

// 2. Normal Team Member Access & Privileges
assert(
  evaluateAccess({
    auth: { uid: 'uid-teammember', email: 'sarah@agencyrose.ai' },
    operation: 'read',
    path: 'workspaces/workspace-rose-agency/leads',
  }),
  'Scenario 3: Team member CAN read agency leads'
);

assert(
  !evaluateAccess({
    auth: { uid: 'uid-teammember', email: 'sarah@agencyrose.ai' },
    operation: 'update',
    path: 'users/uid-teammember',
    incomingData: { role: 'super_admin' },
  }),
  'Scenario 4: Team member CANNOT self-escalate role to super_admin'
);

// 3. Client A vs Client B Isolation
assert(
  evaluateAccess({
    auth: { uid: 'uid-client-a', email: 'elena@auradynamics.com' },
    operation: 'read',
    path: 'workspaces/workspace-client-aura/projects/proj-aura-1',
    resourceData: { clientId: 'client-aura-1', client: 'Aura Dynamics' },
  }),
  'Scenario 5: Client A CAN read Client A projects'
);

assert(
  !evaluateAccess({
    auth: { uid: 'uid-client-a', email: 'elena@auradynamics.com' },
    operation: 'read',
    path: 'workspaces/workspace-client-acme/projects/proj-acme-1',
    resourceData: { clientId: 'client-acme-2', client: 'Acme Corp' },
  }),
  'Scenario 6: Client A CANNOT read Client B projects (Cross-Tenant blocked)'
);

assert(
  !evaluateAccess({
    auth: { uid: 'uid-client-a', email: 'elena@auradynamics.com' },
    operation: 'read',
    path: 'workspaces/workspace-rose-agency/clients/client-acme-2',
    resourceData: { id: 'client-acme-2', email: 'marcus@acmecorp.com' },
  }),
  'Scenario 7: Client A CANNOT read Client B client profile'
);

assert(
  !evaluateAccess({
    auth: { uid: 'uid-client-a', email: 'elena@auradynamics.com' },
    operation: 'read',
    path: 'workspaces/workspace-rose-agency/leads/lead-secret-1',
  }),
  'Scenario 8: Client A CANNOT read Agency CRM Leads'
);

assert(
  !evaluateAccess({
    auth: { uid: 'uid-client-b', email: 'marcus@acmecorp.com' },
    operation: 'read',
    path: 'workspaces/workspace-client-aura/projects/proj-aura-1',
    resourceData: { clientId: 'client-aura-1', client: 'Aura Dynamics' },
  }),
  'Scenario 9: Client B CANNOT access Client A workspace data'
);

// 4. Dirty Dozen Payload Rejections
assert(
  !evaluateAccess({
    auth: { uid: 'uid-teammember', email: 'sarah@agencyrose.ai' },
    operation: 'create',
    path: 'workspaces/workspace-rose-agency/leads/lead-1',
    incomingData: { value: -50000, score: 80, company: 'Malicious Corp' },
  }),
  'Scenario 10: Payload rejection — Negative lead value is REJECTED'
);

assert(
  !evaluateAccess({
    auth: { uid: 'uid-teammember', email: 'sarah@agencyrose.ai' },
    operation: 'create',
    path: 'workspaces/workspace-rose-agency/leads/lead-1',
    incomingData: { value: 10000, score: 150, company: 'Malicious Corp' },
  }),
  'Scenario 11: Payload rejection — Score > 100 is REJECTED'
);

// 5. Super Admin Access
assert(
  evaluateAccess({
    auth: { uid: 'uid-superadmin', email: 'qamarmujtaba700@gmail.com' },
    operation: 'read',
    path: 'workspaces/workspace-rose-agency/leads',
  }),
  'Scenario 12: Super Admin has full administrative read access'
);

assert(
  evaluateAccess({
    auth: { uid: 'uid-superadmin', email: 'qamarmujtaba700@gmail.com' },
    operation: 'update',
    path: 'users/uid-teammember',
    incomingData: { role: 'super_admin' },
  }),
  'Scenario 13: Super Admin CAN legitimately assign administrator roles'
);

console.log('\n====================================================');
console.log(`AUDIT RESULTS: ${passedTests}/${totalTests} TESTS PASSED (${failedTests} FAILED)`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
