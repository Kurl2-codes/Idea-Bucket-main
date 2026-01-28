import { User } from "../types";

const API_URL = process.env.VITE_API_URL || "";

// Type Definitions
export interface AuditActor {
    id: string;
    name: string;
}

export interface AuditTarget {
    id?: string;
    name?: string;
}

export interface AuditLogEntry {
    timestamp: string;
    action: string;
    actor: AuditActor;
    target: AuditTarget;
    details: Record<string, any>;
}

export interface AuditLogPagination {
    total: number;
    page: number;
    size: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
}

export interface AuditLogResponse {
    items: AuditLogEntry[];
    meta: AuditLogPagination;
}

export const fetchAuditLogs = async (page: number = 1, size: number = 20): Promise<AuditLogResponse> => {
    try {
        const response = await fetch(`${API_URL}/api/v1/audit/audit-logs?page=${page}&size=${size}`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("Access denied. Super Admin privileges required.");
            }
            throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch audit logs failed:", error);
        throw error;
    }
};
