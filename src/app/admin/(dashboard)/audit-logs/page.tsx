"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Loader2, Shield, Calendar, User, Activity } from "lucide-react";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/admin/audit-logs");
                const json = await res.json();
                if (json.success) {
                    setLogs(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-primary">Audit Logs</h1>
                <p className="text-muted-foreground">Track system activities and accountability.</p>
            </div>

            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-4 w-4 text-primary opacity-70" />
                                                <span className="font-medium text-sm">{log.action}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground opacity-70" />
                                                <div className="text-sm">
                                                    <div className="font-medium">{log.userEmail || "System"}</div>
                                                    <div className="text-xs text-muted-foreground">{log.userId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {log.details}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(log.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        <Shield className="h-12 w-12 mx-auto opacity-20 mb-3" />
                                        No logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
