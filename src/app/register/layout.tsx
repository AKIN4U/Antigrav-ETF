import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create an account",
    description: "Create an account to get started.",
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
