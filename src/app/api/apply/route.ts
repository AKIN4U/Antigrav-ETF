import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendApplicantNotification, sendAdminNotification } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Destructure body to separate Applicant, Family, and Application data
        const {
            // Personal Info
            surname, firstName, middleName, age, dob, sex, stateOrigin, lga, town,
            // Contact
            address = "See Family Info", phone = "See Family Info", email,
            parish, // Allow parish to be passed, or default will be used
            prevScholarship, prevScholarshipDate,

            // Academic Info
            schoolName, schoolAddress, presentClass, classPosition, classSize,
            schoolFees, textBooksCost, enoughBooks, libraryAccess, sentAway, repeatedClass, lastResult,

            // Family Info
            fatherSurname, fatherFirstName, fatherMiddleName, fatherAddress, fatherPhone, fatherState, fatherLga, fatherTown,
            fatherOccupation, fatherEmployer, fatherSalaryGrade, fatherIncome, fatherObligations, fatherSpouse, fatherNumChildren, fatherChildrenAges,
            fatherYearsServed, fatherChurchPosition, fatherChurchDuties,

            motherSurname, motherFirstName, motherMiddleName, motherAddress, motherPhone, motherState, motherLga, motherTown,
            motherOccupation, motherEmployer, motherSalaryGrade, motherIncome, motherObligations, motherSpouse, motherNumChildren, motherChildrenAges,
            motherYearsServed, motherChurchPosition, motherChurchDuties,

            // Documents (keys match the frontend state)
            schoolFeesBill, birthCertificate, primaryCertificate, schoolResults, assistanceLetter
        } = body;

        // Basic validation
        if (!surname || !firstName || !dob || !schoolName) {
            return NextResponse.json({ success: false, error: "Missing required fields: surname, firstName, dob, or schoolName" }, { status: 400 });
        }

        // Validate Date
        const dateOfBirth = new Date(dob);
        if (isNaN(dateOfBirth.getTime())) {
            return NextResponse.json({ success: false, error: "Invalid Date of Birth format" }, { status: 400 });
        }

        // Check if user is a committee member (AdminUser)
        if (email) {
            const adminUser = await prisma.adminUser.findFirst({
                where: {
                    email: { equals: email, mode: "insensitive" }
                },
            });

            if (adminUser) {
                return NextResponse.json({
                    success: false,
                    error: "Committee members are not eligible to apply for scholarships."
                }, { status: 403 });
            }
        }

        // ONE CHILD PER FAMILY VALIDATION
        // Check if any sibling from the same family already has an active application
        // We match families using parent phone numbers (father or mother)
        if (fatherPhone || motherPhone) {
            const existingFamilyApplications = await prisma.familyInfo.findMany({
                where: {
                    OR: [
                        fatherPhone ? { fatherPhone: fatherPhone } : {},
                        motherPhone ? { motherPhone: motherPhone } : {},
                    ]
                },
                include: {
                    applicant: {
                        include: {
                            applications: {
                                where: {
                                    status: {
                                        in: ['Approved', 'Disbursed', 'Pending', 'Under Review']
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // Check if any of these families have active applications
            const hasActiveApplication = existingFamilyApplications.some(
                family => family.applicant?.applications && family.applicant.applications.length > 0
            );

            if (hasActiveApplication) {
                return NextResponse.json({
                    success: false,
                    error: "One Child Per Family Policy: Another child from your family already has an active bursary application. Only one child per family may receive support at a time."
                }, { status: 400 });
            }
        }

        // Helper to safe parse Int
        const safeInt = (val: any) => {
            if (!val || val === "") return null;
            const parsed = parseInt(val);
            return isNaN(parsed) ? null : parsed;
        };

        // Create Applicant with nested relations
        const applicant = await prisma.applicant.create({
            data: {
                surname: surname || "",
                firstName: firstName || "",
                middleName: middleName || "",
                age: safeInt(age) || 0,
                dob: dateOfBirth,
                sex: sex || "Not Specified",
                stateOrigin: stateOrigin || "",
                lga: lga || "",
                town: town || "",
                address: address || "",
                phone: phone || "",
                email: email === "" ? null : email, // Convert empty string to null to avoid unique constraint violations
                parish: parish || undefined, // undefined triggers default value
                prevScholarship: prevScholarship === "Yes",
                prevScholarshipDate: prevScholarshipDate || null,
                familyInfo: {
                    create: {
                        fatherSurname, fatherFirstName, fatherMiddleName, fatherAddress, fatherPhone, fatherState, fatherLga, fatherTown,
                        fatherOccupation, fatherEmployer, fatherSalaryGrade, fatherIncome, fatherObligations, fatherSpouse,
                        fatherNumChildren: safeInt(fatherNumChildren),
                        fatherChildrenAges, fatherYearsServed, fatherChurchPosition, fatherChurchDuties,

                        motherSurname, motherFirstName, motherMiddleName, motherAddress, motherPhone, motherState, motherLga, motherTown,
                        motherOccupation, motherEmployer, motherSalaryGrade, motherIncome, motherObligations, motherSpouse,
                        motherNumChildren: safeInt(motherNumChildren),
                        motherChildrenAges, motherYearsServed, motherChurchPosition, motherChurchDuties,
                    }
                },
                applications: {
                    create: {
                        schoolName: schoolName || "",
                        schoolAddress: schoolAddress || "",
                        presentClass: presentClass || "",
                        classPosition,
                        classSize: safeInt(classSize),
                        schoolFees: schoolFees || "0",
                        textBooksCost,
                        enoughBooks: enoughBooks === "Yes",
                        libraryAccess: libraryAccess === "Yes",
                        sentAway: sentAway === "Yes",
                        repeatedClass: repeatedClass === "Yes",
                        lastResult,
                        // Map frontend document keys to schema fields
                        schoolBillUrl: schoolFeesBill,
                        birthCertUrl: birthCertificate,
                        primaryCertUrl: primaryCertificate,
                        schoolResultUrl: schoolResults,
                        assistanceLetterUrl: assistanceLetter,
                    }
                }
            }
        });

        // Send notifications
        if (email) {
            await sendApplicantNotification(email, `${firstName} ${surname}`, applicant.id);
        }
        await sendAdminNotification(`${firstName} ${surname}`, applicant.id);

        return NextResponse.json({ success: true, applicantId: applicant.id });
    } catch (error: any) {
        console.error("Error submitting application:", error);
        // Clean up prisma error message for client if possible, or just return it
        const errorMessage = error.message || "Failed to submit application";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
