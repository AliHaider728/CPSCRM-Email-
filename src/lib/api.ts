import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Axios Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  pcnNumber: string;
  surgeryName?: string;
  email?: string;
  phone?: string;
  accountManagerId?: string;
  accountManagerName?: string;
  emailCount?: number;
  unreadCount?: number;
  lastContactedAt?: string;
  createdAt: string;
}

export interface Email {
  id: string;
  subject: string;
  direction: "inbound" | "outbound";
  fromEmail: string;
  fromName?: string;
  toEmail: string;
  toName?: string;
  bodyPreview?: string;
  clientId?: string;
  clientName?: string;
  accountManagerId?: string;
  accountManagerName?: string;
  openCount?: number;
  clickCount?: number;
  isRead?: boolean;
  bccTracked?: boolean;
  sentAt?: string;
  receivedAt?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarInitials?: string;
  bccAddress?: string;
  outlookConnected?: boolean;
  emailCount?: number;
  clientCount?: number;
  lastSyncAt?: string;
}

export interface TimelineEntry {
  id: string;
  type: "email_sent" | "email_received" | "note" | "engagement";
  clientId: string;
  emailId?: string;
  subject?: string;
  preview?: string;
  content?: string;
  fromName?: string;
  fromEmail?: string;
  accountManagerId?: string;
  accountManagerName?: string;
  isRead?: boolean;
  openCount?: number;
  clickCount?: number;
  hasAttachments?: boolean;
  occurredAt: string;
}

export interface Notification {
  id: string;
  type: string;
  isRead: boolean;
  title: string;
  message: string;
  clientId?: string;
  clientName?: string;
  emailId?: string;
  createdAt: string;
}

export interface StatsOverview {
  totalEmailsSent: number;
  totalEmailsReceived: number;
  openRate: number;
  clickRate: number;
  teamMembersActive: number;
  recentActivity: TimelineEntry[];
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
export function useGetStatsOverview() {
  return useQuery<StatsOverview>({
    queryKey: ["stats", "overview"],
    queryFn: async () => {
      const { data } = await api.get("/stats/overview");
      return data;
    },
  });
}

// ─── Clients ───────────────────────────────────────────────────────────────────
export function useListClients(params?: { search?: string }) {
  return useQuery<{ clients: Client[] }>({
    queryKey: ["clients", params],
    queryFn: async () => {
      const { data } = await api.get("/clients", { params });
      return data;
    },
  });
}

export function useGetClient(id: string) {
  return useQuery<Client>({
    queryKey: ["clients", id],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: Partial<Client> }) => {
      const res = await api.post("/clients", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
export function useGetClientTimeline(clientId: string, params?: { type?: string }) {
  return useQuery<{ entries: TimelineEntry[]; total: number }>({
    queryKey: ["timeline", clientId, params],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${clientId}/timeline`, { params });
      return data;
    },
    enabled: !!clientId,
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: { clientId: string; content: string } }) => {
      const res = await api.post("/notes", data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timeline", variables.data.clientId] });
    },
  });
}

// ─── Emails ───────────────────────────────────────────────────────────────────
export function useListEmails(params?: { clientId?: string; direction?: string }) {
  return useQuery<{ emails: Email[] }>({
    queryKey: ["emails", params],
    queryFn: async () => {
      const { data } = await api.get("/emails", { params });
      return data;
    },
  });
}

// ─── Team ─────────────────────────────────────────────────────────────────────
export function useListTeamMembers() {
  return useQuery<{ members: TeamMember[] }>({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await api.get("/team");
      return data;
    },
  });
}

export function useTriggerOutlookSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: { memberId: string } }) => {
      const res = await api.post("/outlook/sync", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────
export function useListNotifications() {
  return useQuery<{ notifications: Notification[] }>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId }: { notificationId: string }) => {
      const res = await api.patch(`/notifications/${notificationId}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}