import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import {
  Client,
  Agent,
  Lead,
  LeadStatus,
  Project,
  TaskItem,
  AutomationWorkflow,
  Integration,
  KnowledgeDocument,
  WorkspaceMemoryItem,
  ApprovalRequest,
  ExecutionLog,
} from '@/types';
import {
  INITIAL_CLIENTS,
  INITIAL_AGENTS,
  INITIAL_LEADS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_WORKFLOWS,
  INITIAL_INTEGRATIONS,
  INITIAL_KNOWLEDGE,
  INITIAL_MEMORIES,
  INITIAL_APPROVALS,
  INITIAL_EXECUTION_LOGS,
} from '@/lib/mock-data';

export const WorkspaceService = {
  /**
   * Ensures the root workspace document exists
   */
  async ensureWorkspaceExists(
    workspaceId: string,
    name: string,
    ownerId: string,
    type: 'agency' | 'client' = 'agency'
  ): Promise<void> {
    const path = `workspaces/${workspaceId}`;
    try {
      const snap = await getDoc(doc(db, 'workspaces', workspaceId));
      if (!snap.exists()) {
        await setDoc(doc(db, 'workspaces', workspaceId), {
          id: workspaceId,
          name,
          ownerId,
          type,
          createdAt: new Date().toISOString(),
        });

        // Add owner as super_admin member
        await setDoc(doc(db, `workspaces/${workspaceId}/members`, ownerId), {
          userId: ownerId,
          role: type === 'client' ? 'client' : 'super_admin',
          joinedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  /**
   * Seeds demo data into a freshly provisioned workspace in Firestore
   */
  async seedInitialWorkspaceData(workspaceId: string, ownerUid: string): Promise<void> {
    try {
      await this.ensureWorkspaceExists(workspaceId, 'ROSE AI Agency', ownerUid, 'agency');

      // Check if clients already exist
      const clientsPath = `workspaces/${workspaceId}/clients`;
      const clientSnap = await getDocs(collection(db, clientsPath));
      if (clientSnap.size > 0) return; // already seeded

      // Seed clients
      for (const client of INITIAL_CLIENTS) {
        await setDoc(doc(db, clientsPath, client.id), client);
      }

      // Seed agents
      const agentsPath = `workspaces/${workspaceId}/agents`;
      for (const agent of INITIAL_AGENTS) {
        await setDoc(doc(db, agentsPath, agent.id), agent);
      }

      // Seed leads
      const leadsPath = `workspaces/${workspaceId}/leads`;
      for (const lead of INITIAL_LEADS) {
        await setDoc(doc(db, leadsPath, lead.id), lead);
      }

      // Seed projects
      const projectsPath = `workspaces/${workspaceId}/projects`;
      for (const proj of INITIAL_PROJECTS) {
        await setDoc(doc(db, projectsPath, proj.id), proj);
      }

      // Seed tasks
      const tasksPath = `workspaces/${workspaceId}/tasks`;
      for (const task of INITIAL_TASKS) {
        await setDoc(doc(db, tasksPath, task.id), task);
      }

      // Seed workflows
      const workflowsPath = `workspaces/${workspaceId}/automations`;
      for (const wf of INITIAL_WORKFLOWS) {
        await setDoc(doc(db, workflowsPath, wf.id), wf);
      }

      // Seed integrations
      const intPath = `workspaces/${workspaceId}/integrations`;
      for (const intg of INITIAL_INTEGRATIONS) {
        await setDoc(doc(db, intPath, intg.id), intg);
      }

      // Seed documents
      const docsPath = `workspaces/${workspaceId}/documents`;
      for (const docItem of INITIAL_KNOWLEDGE) {
        await setDoc(doc(db, docsPath, docItem.id), docItem);
      }

      // Seed memories
      const memPath = `workspaces/${workspaceId}/memories`;
      for (const mem of INITIAL_MEMORIES) {
        await setDoc(doc(db, memPath, mem.id), mem);
      }

      // Seed approvals
      const apprPath = `workspaces/${workspaceId}/approvals`;
      for (const appr of INITIAL_APPROVALS) {
        await setDoc(doc(db, apprPath, appr.id), appr);
      }

      // Seed logs
      const logsPath = `workspaces/${workspaceId}/logs`;
      for (const logItem of INITIAL_EXECUTION_LOGS) {
        await setDoc(doc(db, logsPath, logItem.id), logItem);
      }
    } catch (err) {
      console.warn('Error during workspace seeding:', err);
    }
  },

  // --- REAL-TIME LISTENERS ---

  subscribeToClients(
    workspaceId: string,
    onData: (clients: Client[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/clients`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: Client[] = [];
        snap.forEach((d) => list.push(d.data() as Client));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToAgents(
    workspaceId: string,
    onData: (agents: Agent[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/agents`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: Agent[] = [];
        snap.forEach((d) => list.push(d.data() as Agent));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToLeads(
    workspaceId: string,
    onData: (leads: Lead[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/leads`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: Lead[] = [];
        snap.forEach((d) => list.push(d.data() as Lead));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToProjects(
    workspaceId: string,
    onData: (projects: Project[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/projects`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: Project[] = [];
        snap.forEach((d) => list.push(d.data() as Project));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToTasks(
    workspaceId: string,
    onData: (tasks: TaskItem[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/tasks`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: TaskItem[] = [];
        snap.forEach((d) => list.push(d.data() as TaskItem));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToWorkflows(
    workspaceId: string,
    onData: (workflows: AutomationWorkflow[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/automations`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: AutomationWorkflow[] = [];
        snap.forEach((d) => list.push(d.data() as AutomationWorkflow));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToIntegrations(
    workspaceId: string,
    onData: (integrations: Integration[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/integrations`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: Integration[] = [];
        snap.forEach((d) => list.push(d.data() as Integration));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToDocuments(
    workspaceId: string,
    onData: (docs: KnowledgeDocument[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/documents`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: KnowledgeDocument[] = [];
        snap.forEach((d) => list.push(d.data() as KnowledgeDocument));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToMemories(
    workspaceId: string,
    onData: (memories: WorkspaceMemoryItem[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/memories`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: WorkspaceMemoryItem[] = [];
        snap.forEach((d) => list.push(d.data() as WorkspaceMemoryItem));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToApprovals(
    workspaceId: string,
    onData: (approvals: ApprovalRequest[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/approvals`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: ApprovalRequest[] = [];
        snap.forEach((d) => list.push(d.data() as ApprovalRequest));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribeToLogs(
    workspaceId: string,
    onData: (logs: ExecutionLog[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const path = `workspaces/${workspaceId}/logs`;
    return onSnapshot(
      collection(db, path),
      (snap) => {
        const list: ExecutionLog[] = [];
        snap.forEach((d) => list.push(d.data() as ExecutionLog));
        onData(list);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  // --- CRUD MUTATIONS ---

  // Clients
  async createClient(workspaceId: string, client: Client): Promise<void> {
    const path = `workspaces/${workspaceId}/clients/${client.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/clients`, client.id), client);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  async updateClient(workspaceId: string, clientId: string, updates: Partial<Client>): Promise<void> {
    const path = `workspaces/${workspaceId}/clients/${clientId}`;
    try {
      await updateDoc(doc(db, `workspaces/${workspaceId}/clients`, clientId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  async deleteClient(workspaceId: string, clientId: string): Promise<void> {
    const path = `workspaces/${workspaceId}/clients/${clientId}`;
    try {
      await deleteDoc(doc(db, `workspaces/${workspaceId}/clients`, clientId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // Agents
  async createAgent(workspaceId: string, agent: Agent): Promise<void> {
    const path = `workspaces/${workspaceId}/agents/${agent.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/agents`, agent.id), agent);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  async updateAgent(workspaceId: string, agentId: string, updates: Partial<Agent>): Promise<void> {
    const path = `workspaces/${workspaceId}/agents/${agentId}`;
    try {
      await updateDoc(doc(db, `workspaces/${workspaceId}/agents`, agentId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  async deleteAgent(workspaceId: string, agentId: string): Promise<void> {
    const path = `workspaces/${workspaceId}/agents/${agentId}`;
    try {
      await deleteDoc(doc(db, `workspaces/${workspaceId}/agents`, agentId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // Leads
  async createLead(workspaceId: string, lead: Lead): Promise<void> {
    const path = `workspaces/${workspaceId}/leads/${lead.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/leads`, lead.id), lead);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  async updateLeadStatus(workspaceId: string, leadId: string, newStatus: LeadStatus): Promise<void> {
    const path = `workspaces/${workspaceId}/leads/${leadId}`;
    try {
      await updateDoc(doc(db, `workspaces/${workspaceId}/leads`, leadId), {
        status: newStatus,
        lastContact: 'Just now',
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  async deleteLead(workspaceId: string, leadId: string): Promise<void> {
    const path = `workspaces/${workspaceId}/leads/${leadId}`;
    try {
      await deleteDoc(doc(db, `workspaces/${workspaceId}/leads`, leadId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // Projects
  async createProject(workspaceId: string, project: Project): Promise<void> {
    const path = `workspaces/${workspaceId}/projects/${project.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/projects`, project.id), project);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  // Tasks
  async createTask(workspaceId: string, task: TaskItem): Promise<void> {
    const path = `workspaces/${workspaceId}/tasks/${task.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/tasks`, task.id), task);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  async toggleTaskStatus(workspaceId: string, taskId: string, currentStatus: string): Promise<void> {
    const path = `workspaces/${workspaceId}/tasks/${taskId}`;
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    try {
      await updateDoc(doc(db, `workspaces/${workspaceId}/tasks`, taskId), { status: nextStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  // Workflows
  async createWorkflow(workspaceId: string, workflow: AutomationWorkflow): Promise<void> {
    const path = `workspaces/${workspaceId}/automations/${workflow.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/automations`, workflow.id), workflow);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  async toggleWorkflowStatus(workspaceId: string, workflowId: string, currentStatus: string): Promise<void> {
    const path = `workspaces/${workspaceId}/automations/${workflowId}`;
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateDoc(doc(db, `workspaces/${workspaceId}/automations`, workflowId), { status: nextStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  // Integrations
  async updateIntegration(workspaceId: string, integrationId: string, updates: Partial<Integration>): Promise<void> {
    const path = `workspaces/${workspaceId}/integrations/${integrationId}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/integrations`, integrationId), updates, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  async toggleIntegrationStatus(workspaceId: string, integrationId: string, currentStatus: string): Promise<void> {
    const path = `workspaces/${workspaceId}/integrations/${integrationId}`;
    const nextStatus = currentStatus === 'connected' ? 'disconnected' : 'connected';
    try {
      await updateDoc(doc(db, `workspaces/${workspaceId}/integrations`, integrationId), {
        status: nextStatus,
        lastSync: nextStatus === 'connected' ? 'Just now' : undefined,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  // Documents
  async createDocument(workspaceId: string, docItem: KnowledgeDocument): Promise<void> {
    const path = `workspaces/${workspaceId}/documents/${docItem.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/documents`, docItem.id), docItem);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  // Memories
  async createMemory(workspaceId: string, memory: WorkspaceMemoryItem): Promise<void> {
    const path = `workspaces/${workspaceId}/memories/${memory.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/memories`, memory.id), memory);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  async deleteMemory(workspaceId: string, memoryId: string): Promise<void> {
    const path = `workspaces/${workspaceId}/memories/${memoryId}`;
    try {
      await deleteDoc(doc(db, `workspaces/${workspaceId}/memories`, memoryId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // Approvals
  async createApproval(workspaceId: string, approval: ApprovalRequest): Promise<void> {
    const path = `workspaces/${workspaceId}/approvals/${approval.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/approvals`, approval.id), approval);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  async updateApprovalStatus(
    workspaceId: string,
    approvalId: string,
    status: 'approved' | 'rejected'
  ): Promise<void> {
    const path = `workspaces/${workspaceId}/approvals/${approvalId}`;
    try {
      await updateDoc(doc(db, `workspaces/${workspaceId}/approvals`, approvalId), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  // Execution Logs
  async createLog(workspaceId: string, logItem: ExecutionLog): Promise<void> {
    const path = `workspaces/${workspaceId}/logs/${logItem.id}`;
    try {
      await setDoc(doc(db, `workspaces/${workspaceId}/logs`, logItem.id), logItem);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },
};

