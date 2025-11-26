export function Footer() {
    return (
        <footer className="border-t bg-muted/40 py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} CCC Central Cathedral Abuja. All rights reserved.</p>
                <p className="mt-2 text-xs">Education Trust Fund</p>
            </div>
        </footer>
    );
}
