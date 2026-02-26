import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-muted/40 py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} CCC Central Cathedral Abuja. All rights reserved.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Education Trust Fund</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link
                            href="/privacy"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            Terms of Use
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
