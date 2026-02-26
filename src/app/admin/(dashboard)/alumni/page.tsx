"use client";

import { useEffect, useState } from "react";
import { Loader2, GraduationCap, Briefcase, Linkedin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AlumniForm from "@/components/AlumniForm";
import { Input } from "@/components/ui/input";

export default function AlumniPage() {
    const [alumni, setAlumni] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchAlumni = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);

            const res = await fetch(`/api/admin/alumni?${params}`);
            const json = await res.json();
            if (json.success) {
                setAlumni(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch alumni:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
    }, [search]); // Debounce usually better, but keeping simple

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Alumni Tracking</h1>
                    <p className="text-muted-foreground">Monitor career progress of past scholars.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Search alumni..."
                        className="max-w-xs"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* In a real app, you'd select a beneficiary to promote. 
                        For now, we just list existing alumni. 
                        Use the 'Applications' page to find someone to promote? 
                        Or add a 'Add Alumni' button that lets you pick a user? 
                        Let's keep it simple: List only for now. To add, you'd go to deep integration.
                        Actually, let's just show the list.
                    */}
                </div>
            </div>

            {loading ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alumni.length > 0 ? (
                        alumni.map((alum) => (
                            <div key={alum.id} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{alum.applicant.surname} {alum.applicant.firstName}</h3>
                                            <p className="text-sm text-muted-foreground">{alum.graduationYear} • {alum.institution}</p>
                                        </div>
                                    </div>
                                    {alum.linkedInUrl && (
                                        <a href={alum.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{alum.currentStatus}</span>
                                    </div>
                                    {alum.jobTitle && (
                                        <p className="text-sm ml-6 text-muted-foreground">
                                            {alum.jobTitle} at <span className="text-foreground">{alum.employer}</span>
                                        </p>
                                    )}
                                </div>

                                {alum.successStory && (
                                    <div className="bg-muted/30 p-3 rounded-md text-xs italic text-muted-foreground line-clamp-3">
                                        "{alum.successStory}"
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t flex justify-end">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">Edit Profile</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Edit Alumni Profile</DialogTitle>
                                            </DialogHeader>
                                            <AlumniForm
                                                initialData={alum}
                                                onSuccess={() => { setIsDialogOpen(false); fetchAlumni(); }}
                                                onCancel={() => setIsDialogOpen(false)}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-card border rounded-xl">
                            <GraduationCap className="h-12 w-12 mx-auto opacity-20 mb-3" />
                            <p>No alumni profiles found.</p>
                            <p className="text-sm">Go to an Application, approve it, and then mark as Disbursed to see the option to add to Alumni (Implementation Pending).</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
