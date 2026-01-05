interface FamilyInfoStepProps {
    updateData: (data: any) => void;
    data: any;
}

export function FamilyInfoStep({ updateData, data }: FamilyInfoStepProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    const renderParentSection = (parentType: "Father" | "Mother") => {
        const prefix = parentType.toLowerCase();
        return (
            <div className="space-y-4 border p-4 rounded-lg bg-muted/10">
                <h3 className="text-lg font-semibold text-primary">{parentType}&apos;s Biodata</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Surname</label>
                        <input
                            name={`${prefix}Surname`}
                            value={data[`${prefix}Surname`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <input
                            name={`${prefix}FirstName`}
                            value={data[`${prefix}FirstName`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Middle Name</label>
                        <input
                            name={`${prefix}MiddleName`}
                            value={data[`${prefix}MiddleName`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Residential Address</label>
                    <input
                        name={`${prefix}Address`}
                        value={data[`${prefix}Address`] || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Telephone Number</label>
                        <input
                            name={`${prefix}Phone`}
                            value={data[`${prefix}Phone`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">State of Origin</label>
                        <input
                            name={`${prefix}State`}
                            value={data[`${prefix}State`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">LGA</label>
                        <input
                            name={`${prefix}Lga`}
                            value={data[`${prefix}Lga`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Town</label>
                        <input
                            name={`${prefix}Town`}
                            value={data[`${prefix}Town`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Occupation</label>
                        <input
                            name={`${prefix}Occupation`}
                            value={data[`${prefix}Occupation`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Employer</label>
                        <input
                            name={`${prefix}Employer`}
                            value={data[`${prefix}Employer`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Salary Grade</label>
                        <input
                            name={`${prefix}SalaryGrade`}
                            value={data[`${prefix}SalaryGrade`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Estimated Annual Income</label>
                        <input
                            name={`${prefix}Income`}
                            value={data[`${prefix}Income`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Outstanding Obligations (if any)</label>
                    <textarea
                        name={`${prefix}Obligations`}
                        value={data[`${prefix}Obligations`] || ""}
                        onChange={handleChange}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="List any outstanding obligations..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name of Spouse</label>
                        <input
                            name={`${prefix}Spouse`}
                            value={data[`${prefix}Spouse`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Number of Children</label>
                        <input
                            name={`${prefix}NumChildren`}
                            value={data[`${prefix}NumChildren`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ages of Children</label>
                        <input
                            name={`${prefix}ChildrenAges`}
                            value={data[`${prefix}ChildrenAges`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="e.g. 5, 8, 12"
                        />
                    </div>
                </div>

                <h4 className="text-sm font-semibold mt-4 text-muted-foreground">Church Service</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Years Served</label>
                        <input
                            name={`${prefix}YearsServed`}
                            value={data[`${prefix}YearsServed`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Position</label>
                        <input
                            name={`${prefix}ChurchPosition`}
                            value={data[`${prefix}ChurchPosition`] || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium">Duties/Roles</label>
                        <textarea
                            name={`${prefix}ChurchDuties`}
                            value={data[`${prefix}ChurchDuties`] || ""}
                            onChange={handleChange}
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Family Information</h2>
            {renderParentSection("Father")}
            {renderParentSection("Mother")}
        </div>
    );
}
