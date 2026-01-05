interface PersonalInfoStepProps {
    updateData: (data: any) => void;
    data: any;
}

export function PersonalInfoStep({ updateData, data }: PersonalInfoStepProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center border-b pb-4 mb-6">
                <h2 className="text-xl font-bold text-primary">NORTHERN STATES FCT ZONAL HEADQUARTERS</h2>
                <h3 className="text-lg font-semibold">CENTRAL PARISH AREA 10 GARKI ABUJA</h3>
                <h4 className="text-md font-medium text-muted-foreground">EDUCATIONAL TRUST FUND SCHOLARSHIP APPLICATION FORM</h4>
            </div>

            <h2 className="text-xl font-semibold mb-4">Child&apos;s Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Surname</label>
                    <input
                        name="surname"
                        value={data.surname || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                        name="firstName"
                        value={data.firstName || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Middle Name</label>
                    <input
                        name="middleName"
                        value={data.middleName || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <input
                        name="age"
                        type="number"
                        value={data.age || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <input
                        name="dob"
                        type="date"
                        value={data.dob || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Sex</label>
                    <select
                        name="sex"
                        value={data.sex || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">State of Origin</label>
                    <input
                        name="stateOrigin"
                        value={data.stateOrigin || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Local Government</label>
                    <input
                        name="lga"
                        value={data.lga || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Town</label>
                    <input
                        name="town"
                        value={data.town || ""}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Have you been granted a CCC ETF Scholarship before?</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="prevScholarship"
                                value="Yes"
                                checked={data.prevScholarship === "Yes"}
                                onChange={handleChange}
                            />
                            Yes
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="prevScholarship"
                                value="No"
                                checked={data.prevScholarship === "No"}
                                onChange={handleChange}
                            />
                            No
                        </label>
                    </div>
                </div>
                {data.prevScholarship === "Yes" && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">If yes, when?</label>
                        <input
                            name="prevScholarshipDate"
                            value={data.prevScholarshipDate || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="e.g. 2023"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
