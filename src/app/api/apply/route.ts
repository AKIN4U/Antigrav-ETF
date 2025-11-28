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
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Create Applicant with nested relations
        const applicant = await prisma.applicant.create({
            data: {
                surname,
                firstName,
                middleName,
                age: age ? parseInt(age) : 0,
                dob: new Date(dob),
                sex: sex || "Not Specified",
                stateOrigin: stateOrigin || "",
                lga: lga || "",
                town: town || "",
                address,
                phone,
                email,
                prevScholarship: prevScholarship === "Yes",
                prevScholarshipDate,
                familyInfo: {
                    create: {
                        fatherSurname, fatherFirstName, fatherMiddleName, fatherAddress, fatherPhone, fatherState, fatherLga, fatherTown,
                        fatherOccupation, fatherEmployer, fatherSalaryGrade, fatherIncome, fatherObligations, fatherSpouse,
                        fatherNumChildren: fatherNumChildren ? parseInt(fatherNumChildren) : null,
                        fatherChildrenAges, fatherYearsServed, fatherChurchPosition, fatherChurchDuties,

                        motherSurname, motherFirstName, motherMiddleName, motherAddress, motherPhone, motherState, motherLga, motherTown,
                        motherOccupation, motherEmployer, motherSalaryGrade, motherIncome, motherObligations, motherSpouse,
                        motherNumChildren: motherNumChildren ? parseInt(motherNumChildren) : null,
                        motherChildrenAges, motherYearsServed, motherChurchPosition, motherChurchDuties,
                    }
                },
                applications: {
                    create: {
                        schoolName,
                        schoolAddress: schoolAddress || "",
                        presentClass: presentClass || "",
                        classPosition,
                        classSize: classSize ? parseInt(classSize) : null,
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
    } catch (error) {
        console.error("Error submitting application:", error);
        return NextResponse.json({ success: false, error: "Failed to submit application" }, { status: 500 });
    }
}
