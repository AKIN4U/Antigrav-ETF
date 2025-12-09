import Link from "next/link";
import { UserNav } from "./UserNav";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">CCC ETF</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                        About
                    </Link>
                    <Link href="/apply" className="text-sm font-medium hover:text-primary transition-colors">
                        Apply
                    </Link>
                    <Link href="/admin/login" className="text-sm font-medium hover:text-primary transition-colors">
                        Committee
                    </Link>
                </nav>
                <UserNav />
            </div>
        </header>
    );
}
