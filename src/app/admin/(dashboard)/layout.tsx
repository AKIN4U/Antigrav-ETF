import Link from "next/link";
import { LayoutDashboard, Users, FileText, CreditCard, Settings, LogOut, BarChart3, Wallet, Heart } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r hidden md:flex flex-col fixed h-full">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-primary">ETF Admin</h1>
                    <p className="text-xs text-muted-foreground">Committee Portal</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/applications"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <FileText className="h-5 w-5" />
                        Applications
                    </Link>
                    <Link
                        href="/admin/beneficiaries"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Users className="h-5 w-5" />
                        Beneficiaries
                    </Link>
                    <Link
                        href="/admin/disbursements"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <CreditCard className="h-5 w-5" />
                        Disbursements
                    </Link>
                    <Link
                        href="/admin/reports"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <BarChart3 className="h-5 w-5" />
                        Reports
                    </Link>
                    <Link
                        href="/admin/finance"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Wallet className="h-5 w-5" />
                        Finance
                    </Link>
                    <Link
                        href="/admin/donations"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Heart className="h-5 w-5" />
                        Donations
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
