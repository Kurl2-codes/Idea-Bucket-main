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
    const pageSize = 20;

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">System Audit Logs</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Track all critical system actions.
                    </p>
                </div>
                <button
                    onClick={() => mutate()}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Refresh"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                            <th className="px-6 py-4 font-medium">Timestamp</th>
                            <th className="px-6 py-4 font-medium">Action</th>
                            <th className="px-6 py-4 font-medium">Actor</th>
                            <th className="px-6 py-4 font-medium">Target</th>
                            <th className="px-6 py-4 font-medium">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                                </tr>
                            ))
                        ) : data?.items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No audit logs found.
                                </td>
                            </tr>
                        ) : (
                            data?.items.map((log, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                        {dayjs(log.timestamp).format("MMM D, HH:mm:ss")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                ${getActionColor(log.action)}
                            `}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-medium">{log.actor.name}</div>
                                        <div className="text-xs text-gray-500">{log.actor.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {log.target.name || "N/A"}
                                        {log.target.id && <div className="text-xs text-gray-500">{log.target.id}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                                        <pre className="whitespace-pre-wrap max-w-xs">{JSON.stringify(log.details, null, 2)}</pre>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {data && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="text-sm text-gray-500">
                        Page <span className="font-medium text-gray-900">{data.meta.page}</span> of <span className="font-medium text-gray-900">{data.meta.pages}</span> <span className="mx-1">•</span> Total <span className="font-medium text-gray-900">{data.meta.total}</span> logs
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={!data.meta.has_prev}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!data.meta.has_next}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const getActionColor = (action: string) => {
    if (action.includes("create") || action.includes("register") || action.includes("added")) return "bg-green-50 text-green-700 border-green-200";
    if (action.includes("updated") || action.includes("shared") || action.includes("link")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (action.includes("deleted") || action.includes("remove") || action.includes("unshared")) return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
};

export default AuditLogTable;
