# ROSE AI OS — Security Specification & Invariants

## 1. Data Invariants
1. **Multi-Tenant Boundary:** No client user may read or write any documents inside another workspace (`/workspaces/{otherWorkspaceId}/...`).
2. **Client Portal Isolation:** Client users may only access documents associated with their assigned workspace and their own client record.
3. **RBAC Integrity:** Normal users cannot set or elevate their own role to `super_admin`. Super Admin access requires an explicit entry in `/admins/{userId}` or matching runtime root admin.
4. **Relational Sync:** Every entity (clients, agents, leads, projects, tasks, workflows) must exist within an authorized `/workspaces/{workspaceId}` parent hierarchy.
5. **PII Protection:** User email, phone, and client financial details are only readable by verified workspace members or super admins.
6. **Task Integrity:** Tasks inside `/workspaces/{workspaceId}/tasks/{taskId}` must have a non-empty title and valid status (`todo`, `in_progress`, `done`).
7. **Lead Scoring Bounds:** Lead scores must be a number between 0 and 100.
8. **Immutability:** Critical system IDs (`id`, `workspaceId`) cannot be altered during updates.

## 2. The Dirty Dozen Payloads (Targeting Rejection)
1. **Payload 1 (Privilege Escalation):** Non-admin user writes `{ "role": "super_admin" }` to `/users/{uid}`.
2. **Payload 2 (Cross-Tenant Snooping):** User from Workspace A attempts `get` or `list` on `/workspaces/{workspaceB}/clients`.
3. **Payload 3 (Orphaned Task Write):** Creating a task in a non-existent workspace ID without membership.
4. **Payload 4 (Unauthenticated Read):** Unauthenticated request fetching `/workspaces/{workspaceId}/leads`.
5. **Payload 5 (Oversized Payload / Denial of Wallet):** Attempting to write a 2MB string into `task.title` or `agent.name`.
6. **Payload 6 (Invalid Lead Status):** Writing `{ "status": "malicious_status" }` to `/leads/{leadId}`.
7. **Payload 7 (Negative Lead Value):** Writing `{ "value": -50000 }` to a CRM lead.
8. **Payload 8 (Arbitrary Client Assignment):** Client role user attempting to re-assign an agent to another client account.
9. **Payload 9 (Malicious Path Traversal ID):** Writing to document ID `../../admins/hacker`.
10. **Payload 10 (Ghost Field Injection):** Writing `{ "isAdmin": true, "bypassSecurity": true }` to `/users/{uid}`.
11. **Payload 11 (Unverified Email Write):** Unverified email user attempting privileged workspace updates.
12. **Payload 12 (Admin Collection Tampering):** Non-admin attempting to create a record in `/admins/{uid}`.
