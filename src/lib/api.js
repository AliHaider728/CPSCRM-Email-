import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Axios Instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Helper: normalize MongoDB _id → id ─────────────────────────────────────
function normalize(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(normalize);
  const { _id, __v, ...rest } = obj;
  return { id: String(_id ?? rest.id), ...rest };
}

function normalizeResponse(data) {
  if (Array.isArray(data)) return data.map(normalize);
  const result = {};
  for (const key of Object.keys(data)) {
    result[key] = Array.isArray(data[key])
      ? data[key].map(normalize)
      : typeof data[key] === "object" && data[key] !== null && key !== "recentActivity"
      ? normalize(data[key])
      : data[key];
  }
  if (data.recentActivity) {
    result.recentActivity = data.recentActivity.map(normalize);
  }
  return result;
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export function useGetStatsOverview() {
  return useQuery({
    queryKey: ["stats", "overview"],
    queryFn: async () => {
      const { data } = await api.get("/stats/overview");
      return normalizeResponse(data);
    },
  });
}

// ─── Clients ─────────────────────────────────────────────────────────────────
export function useListClients(params) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: async () => {
      const { data } = await api.get("/clients", { params });
      return normalizeResponse(data);
    },
  });
}

export function useGetClient(id) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${id}`);
      return normalize(data.client ?? data);
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await api.post("/clients", data);
      return normalize(res.data.client ?? res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

// ─── Timeline ────────────────────────────────────────────────────────────────
export function useGetClientTimeline(clientId, params) {
  return useQuery({
    queryKey: ["timeline", clientId, params],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${clientId}/timeline`, { params });
      return normalizeResponse(data);
    },
    enabled: !!clientId,
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await api.post("/notes", data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timeline", variables.data.clientId] });
    },
  });
}

// ─── Emails ──────────────────────────────────────────────────────────────────
export function useListEmails(params) {
  return useQuery({
    queryKey: ["emails", params],
    queryFn: async () => {
      const { data } = await api.get("/emails", { params });
      return normalizeResponse(data);
    },
  });
}

// ─── NEW: Send Email ──────────────────────────────────────────────────────────
export function useSendEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      // data = { to, subject, body, clientId?, accountManagerId? }
      const res = await api.post("/emails/send", data);
      return normalize(res.data.email ?? res.data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      // Also refresh timeline if clientId was provided
      if (variables.data?.clientId) {
        queryClient.invalidateQueries({ queryKey: ["timeline", variables.data.clientId] });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ─── Team ─────────────────────────────────────────────────────────────────────
export function useListTeamMembers() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await api.get("/team");
      return normalizeResponse(data);
    },
  });
}

export function useTriggerOutlookSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
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
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return normalizeResponse(data);
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId }) => {
      const res = await api.patch(`/notifications/${notificationId}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}