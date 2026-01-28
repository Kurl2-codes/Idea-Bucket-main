import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { AuditLogResponse, fetchAuditLogs } from "../../services/auditService";
import dayjs from "dayjs";
import { User } from "../../types";

interface AuditLogTableProps {
    currentUser: User;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ currentUser }) => {
    // Simple URL Sync: In a real app, use useSearchParams from react-router-dom
    // For now, we'll use local state initialized from URL if possible, or just state
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const { data, error, isLoading, mutate } = useSWR<AuditLogResponse>(
        currentUser.userLevel === 1 ? ["audit-logs", page] : null,
        () => fetchAuditLogs(page, pageSize),
        {
            revalidateOnFocus: false
        }
    );

    const handleNext = () => {
        if (data?.meta.has_next) setPage((p) => p + 1);
    };

    const handlePrev = () => {
        if (data?.meta.has_prev) setPage((p) => p - 1);
    };

    if (!currentUser || currentUser.userLevel !== 1) {
        return <div className="p-8 text-center text-red-500">Access Denied: Super Admin Only</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error loading logs: {error.message}</div>;
    }

    return (
        <div className="p-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-100 mb-2">System Audit Logs</h2>
                <p className="text-slate-400 text-sm">Track all critical system actions.</p>
            </div>

            <div className="glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                    <div>
                        {/* Optional extra header info or filters could go here */}
                    </div>
                    <button
                        onClick={() => mutate()}
                        className="p-2 text-slate-400 hover:text-blue-400 transition-colors bg-slate-800/50 rounded-lg"
                        title="Refresh"
                    >
                        <i className="fas fa-sync-alt"></i>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-white/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#fd7912]">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#fd7912]">Action</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#fd7912]">Actor</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#fd7912]">Target</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#fd7912]">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-48"></div></td>
                                    </tr>
                                ))
                            ) : data?.items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No audit logs found.
                                    </td>
                                </tr>
                            ) : (
                                data?.items.map((log, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                                            {dayjs(log.timestamp).format("MMM D, HH:mm:ss")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border
                                    ${getActionColor(log.action)}
                                `}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-200">
                                            <div className="font-bold">{log.actor.name}</div>
                                            <div className="text-[11px] text-slate-500">{log.actor.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-200">
                                            {log.target.name || "N/A"}
                                            {log.target.id && <div className="text-[11px] text-slate-500">{log.target.id}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono text-xs">
                                            <span className="text-slate-300">{formatDetails(log.details)}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {data && (
                    <div className="p-4 border-t border-white/5 flex items-center justify-between bg-slate-900/30">
                        <div className="text-sm text-slate-500">
                            Page <span className="font-medium text-slate-300">{data.meta.page}</span> of <span className="font-medium text-slate-300">{data.meta.pages}</span> <span className="mx-1">•</span> Total <span className="font-medium text-slate-300">{data.meta.total}</span> logs
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={!data.meta.has_prev}
                                className="px-4 py-2 text-sm font-bold text-slate-300 bg-slate-800 border border-white/10 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!data.meta.has_next}
                                className="px-4 py-2 text-sm font-bold text-slate-300 bg-slate-800 border border-white/10 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const formatDetails = (details: any) => {
    if (!details || Object.keys(details).length === 0) return "N/A";

    // Handle specific fields for better readability
    const parts = [];

    if (details.newLevel !== undefined) {
        parts.push(`Role → ${details.newLevel === 1 ? 'Admin' : 'User'}`);
    }

    // Generic formatted list for other keys
    Object.entries(details).forEach(([key, value]) => {
        if (key === 'newLevel') return; // Handled above
        if (key === 'password') return; // Hide specific sensitive fields if any

        // Format key names to be nicer (e.g. "ideaId" -> "Idea ID")
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        parts.push(`${formattedKey}: ${value}`);
    });

    return parts.join(" • ");
};

const getActionColor = (action: string) => {
    if (action.includes("create") || action.includes("register") || action.includes("added")) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (action.includes("updated") || action.includes("shared") || action.includes("link")) return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    if (action.includes("deleted") || action.includes("remove") || action.includes("unshared")) return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    return "text-slate-400 bg-slate-400/10 border-slate-400/20";
};

export default AuditLogTable;
