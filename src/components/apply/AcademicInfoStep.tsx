interface AcademicInfoStepProps {
    updateData: (data: any) => void;
    data: any;
}

export function AcademicInfoStep({ updateData, data }: AcademicInfoStepProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Academic Status</h2>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name of School</label>
                        <input
                            name="schoolName"
                            value={data.schoolName || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Address of School</label>
                        <input
                            name="schoolAddress"
                            value={data.schoolAddress || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Present Class</label>
                        <input
                            name="presentClass"
                            value={data.presentClass || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Position in Class</label>
                        <input
                            name="classPosition"
                            value={data.classPosition || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">No. of Children in Class</label>
                        <input
                            name="classSize"
                            type="number"
                            value={data.classSize || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Present School Fees (Amount)</label>
                        <input
                            name="schoolFees"
                            value={data.schoolFees || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cost of Text Books (Per Year)</label>
                        <input
                            name="textBooksCost"
                            value={data.textBooksCost || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Do you have enough text books?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="enoughBooks"
                                    value="Yes"
                                    checked={data.enoughBooks === "Yes"}
                                    onChange={handleChange}
                                />
                                Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="enoughBooks"
                                    value="No"
                                    checked={data.enoughBooks === "No"}
                                    onChange={handleChange}
                                />
                                No
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Do you have unhindered access to libraries?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="libraryAccess"
                                    value="Yes"
                                    checked={data.libraryAccess === "Yes"}
                                    onChange={handleChange}
                                />
                                Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="libraryAccess"
                                    value="No"
                                    checked={data.libraryAccess === "No"}
                                    onChange={handleChange}
                                />
                                No
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Have you ever been sent away from school because of non-payment of fees?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="sentAway"
                                    value="Yes"
                                    checked={data.sentAway === "Yes"}
                                    onChange={handleChange}
                                />
                                Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="sentAway"
                                    value="No"
                                    checked={data.sentAway === "No"}
                                    onChange={handleChange}
                                />
                                No
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Have you ever repeated a class?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="repeatedClass"
                                    value="Yes"
                                    checked={data.repeatedClass === "Yes"}
                                    onChange={handleChange}
                                />
                                Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="repeatedClass"
                                    value="No"
                                    checked={data.repeatedClass === "No"}
                                    onChange={handleChange}
                                />
                                No
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
