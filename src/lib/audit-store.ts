import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "ROLE_CHANGE"
  | "NOTICE_CREATED"
  | "NOTICE_DELETED"
  | "ASSIGNMENT_CREATED"
  | "NOTE_UPLOADED"
  | "ATTENDANCE_SAVED"
  | "EVENT_CREATED"
  | "BRANDING_UPDATED"
  | "SETTINGS_CHANGED"
  | "UNAUTHORIZED_ACCESS";

export type AuditSeverity = "info" | "warning" | "critical" | "success";

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  severity: AuditSeverity;
  actor: string;
  role: string;
  target?: string;
  details?: string;
  ipFingerprint: string;
}

interface AuditState {
  entries: AuditEntry[];
  log: (entry: Omit<AuditEntry, "id" | "timestamp" | "ipFingerprint">) => void;
  clearOlderThan: (days: number) => void;
}

function generateFingerprint(): string {
  if (typeof window === "undefined") return "server";
  const nav = window.navigator;
  const raw = `${nav.userAgent}|${nav.language}|${screen.width}x${screen.height}|${new Date().getTimezoneOffset()}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `fp_${Math.abs(hash).toString(16)}`;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      entries: [],
      log: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              timestamp: new Date().toISOString(),
              ipFingerprint: generateFingerprint(),
            },
            ...state.entries,
          ].slice(0, 200), // Keep max 200 entries
        })),
      clearOlderThan: (days) =>
        set((state) => {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - days);
          return {
            entries: state.entries.filter(
              (e) => new Date(e.timestamp) > cutoff
            ),
          };
        }),
    }),
    {
      name: "collegehub-audit",
    }
  )
);
