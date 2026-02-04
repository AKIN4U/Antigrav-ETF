"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Loader2, TrendingUp, Users, MapPin, DollarSign } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch("/api/admin/analytics");
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return <div>Failed to load data.</div>;

    const { genderData, stateData, statusData, financialData, trendData, metrics } = data;

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Deep dive into applicants, funding, and trends.</p>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Applicants</p>
                            <h3 className="text-2xl font-bold">{metrics.totalApplicants}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Approval Rate</p>
                            <h3 className="text-2xl font-bold">{metrics.approvalRate}%</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Applications</p>
                            <h3 className="text-2xl font-bold">{metrics.totalApplications}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Monthly Trends */}
                <div className="bg-card p-6 rounded-2xl border shadow-sm col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Application Trends (Last 6 Months)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" name="Applications" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Gender Distribution */}
                <div className="bg-card p-6 rounded-2xl border shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Gender Distribution
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {genderData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Status Distribution */}
                <div className="bg-card p-6 rounded-2xl border shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Application Status
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#82ca9d" name="Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. State Distribution */}
                <div className="bg-card p-6 rounded-2xl border shadow-sm col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Top 10 States of Origin
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stateData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" name="Applicants" barSize={20} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
