import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { draftId, ...formData } = body;

        // Check if user already has a draft
        const existingApplicant = await prisma.applicant.findFirst({
            where: { email: user.email },
            include: {
                applications: {
                    where: { status: 'Draft' },
                    orderBy: { updatedAt: 'desc' },
                    take: 1
                },
                familyInfo: true
            }
        });

        let savedDraft;

        if (draftId || (existingApplicant?.applications && existingApplicant.applications.length > 0)) {
            // Update existing draft
            const applicationId = draftId || (existingApplicant ? existingApplicant.applications[0].id : null);

            if (!applicationId) {
                return NextResponse.json(
                    { success: false, error: 'Application ID is required' },
                    { status: 400 }
                );
            }

            savedDraft = await prisma.application.update({
                where: { id: applicationId },
                data: {
                    // Update only the fields that are provided
                    ...(formData.schoolName && { schoolName: formData.schoolName }),
                    ...(formData.schoolAddress && { schoolAddress: formData.schoolAddress }),
                    ...(formData.presentClass && { presentClass: formData.presentClass }),
                    ...(formData.classPosition !== undefined && { classPosition: formData.classPosition }),
                    ...(formData.classSize !== undefined && { classSize: parseInt(formData.classSize) || null }),
                    ...(formData.schoolFees && { schoolFees: formData.schoolFees }),
                    ...(formData.textBooksCost !== undefined && { textBooksCost: formData.textBooksCost }),
                    ...(formData.enoughBooks !== undefined && { enoughBooks: formData.enoughBooks }),
                    ...(formData.libraryAccess !== undefined && { libraryAccess: formData.libraryAccess }),
                    ...(formData.sentAway !== undefined && { sentAway: formData.sentAway }),
                    ...(formData.repeatedClass !== undefined && { repeatedClass: formData.repeatedClass }),
                    ...(formData.lastResult !== undefined && { lastResult: formData.lastResult }),
                    ...(formData.schoolBillUrl && { schoolBillUrl: formData.schoolBillUrl }),
                    ...(formData.birthCertUrl && { birthCertUrl: formData.birthCertUrl }),
                    ...(formData.primaryCertUrl && { primaryCertUrl: formData.primaryCertUrl }),
                    ...(formData.schoolResultUrl && { schoolResultUrl: formData.schoolResultUrl }),
                    ...(formData.assistanceLetterUrl && { assistanceLetterUrl: formData.assistanceLetterUrl }),
                    ...(formData.admissionLetterUrl && { admissionLetterUrl: formData.admissionLetterUrl }),
                    ...(formData.passportUrl && { passportUrl: formData.passportUrl }),
                    updatedAt: new Date()
                }
            });

            // Update applicant info if provided
            if (existingApplicant) {
                await prisma.applicant.update({
                    where: { id: existingApplicant.id },
                    data: {
                        ...(formData.surname && { surname: formData.surname }),
                        ...(formData.firstName && { firstName: formData.firstName }),
                        ...(formData.middleName !== undefined && { middleName: formData.middleName }),
                        ...(formData.age !== undefined && { age: parseInt(formData.age) || 0 }),
                        ...(formData.dob && { dob: new Date(formData.dob) }),
                        ...(formData.sex && { sex: formData.sex }),
                        ...(formData.stateOrigin && { stateOrigin: formData.stateOrigin }),
                        ...(formData.lga && { lga: formData.lga }),
                        ...(formData.town && { town: formData.town }),
                        ...(formData.address && { address: formData.address }),
                        ...(formData.phone && { phone: formData.phone }),
                        ...(formData.parish !== undefined && { parish: formData.parish }),
                        ...(formData.prevScholarship !== undefined && { prevScholarship: formData.prevScholarship }),
                        ...(formData.prevScholarshipDate !== undefined && { prevScholarshipDate: formData.prevScholarshipDate }),
                    }
                });

                // Update family info if provided
                if (existingApplicant.familyInfo) {
                    await prisma.familyInfo.update({
                        where: { applicantId: existingApplicant.id },
                        data: {
                            ...(formData.fatherSurname !== undefined && { fatherSurname: formData.fatherSurname }),
                            ...(formData.fatherFirstName !== undefined && { fatherFirstName: formData.fatherFirstName }),
                            // Add other family fields as needed
                        }
                    });
                }
            }
        } else {
            // Create new draft - need to create applicant first if doesn't exist
            let applicant = existingApplicant;

            if (!applicant) {
                const newApplicant = await prisma.applicant.create({
                    data: {
                        surname: formData.surname || 'Draft',
                        firstName: formData.firstName || 'User',
                        middleName: formData.middleName,
                        age: parseInt(formData.age) || 0,
                        dob: formData.dob ? new Date(formData.dob) : new Date(),
                        sex: formData.sex || 'Not Specified',
                        stateOrigin: formData.stateOrigin || 'Not Specified',
                        lga: formData.lga || 'Not Specified',
                        town: formData.town || 'Not Specified',
                        address: formData.address || 'Not Specified',
                        phone: formData.phone || 'Not Specified',
                        email: user.email!, // We know email exists from auth check
                        parish: formData.parish || 'Central Cathedral Abuja',
                        prevScholarship: formData.prevScholarship || false,
                        prevScholarshipDate: formData.prevScholarshipDate,
                    }
                });
                applicant = newApplicant as any;
            }

            if (!applicant) {
                throw new Error("Failed to create or find applicant");
            }

            savedDraft = await prisma.application.create({
                data: {
                    applicantId: applicant.id,
                    status: 'Draft',
                    schoolName: formData.schoolName || 'Not Specified',
                    schoolAddress: formData.schoolAddress || 'Not Specified',
                    presentClass: formData.presentClass || 'Not Specified',
                    classPosition: formData.classPosition,
                    classSize: formData.classSize ? parseInt(formData.classSize) : null,
                    schoolFees: formData.schoolFees || '0',
                    textBooksCost: formData.textBooksCost,
                    enoughBooks: formData.enoughBooks || false,
                    libraryAccess: formData.libraryAccess || false,
                    sentAway: formData.sentAway || false,
                    repeatedClass: formData.repeatedClass || false,
                    lastResult: formData.lastResult,
                    schoolBillUrl: formData.schoolBillUrl,
                    birthCertUrl: formData.birthCertUrl,
                    primaryCertUrl: formData.primaryCertUrl,
                    schoolResultUrl: formData.schoolResultUrl,
                    assistanceLetterUrl: formData.assistanceLetterUrl,
                    admissionLetterUrl: formData.admissionLetterUrl,
                    passportUrl: formData.passportUrl,
                }
            });
        }

        return NextResponse.json({
            success: true,
            draftId: savedDraft.id,
            message: 'Draft saved successfully'
        });

    } catch (error) {
        console.error('Error saving draft:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save draft' },
            { status: 500 }
        );
    }
}

// GET endpoint to retrieve existing draft
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const applicant = await prisma.applicant.findFirst({
            where: { email: user.email },
            include: {
                applications: {
                    where: { status: 'Draft' },
                    orderBy: { updatedAt: 'desc' },
                    take: 1
                },
                familyInfo: true
            }
        });

        if (!applicant || !applicant.applications || applicant.applications.length === 0) {
            return NextResponse.json({
                success: true,
                draft: null
            });
        }

        const draft = applicant.applications[0];

        return NextResponse.json({
            success: true,
            draft: {
                draftId: draft.id,
                // Personal info
                surname: applicant.surname,
                firstName: applicant.firstName,
                middleName: applicant.middleName,
                age: applicant.age,
                dob: applicant.dob,
                sex: applicant.sex,
                stateOrigin: applicant.stateOrigin,
                lga: applicant.lga,
                town: applicant.town,
                address: applicant.address,
                phone: applicant.phone,
                parish: applicant.parish,
                prevScholarship: applicant.prevScholarship,
                prevScholarshipDate: applicant.prevScholarshipDate,
                // Academic info
                schoolName: draft.schoolName,
                schoolAddress: draft.schoolAddress,
                presentClass: draft.presentClass,
                classPosition: draft.classPosition,
                classSize: draft.classSize,
                schoolFees: draft.schoolFees,
                textBooksCost: draft.textBooksCost,
                enoughBooks: draft.enoughBooks,
                libraryAccess: draft.libraryAccess,
                sentAway: draft.sentAway,
                repeatedClass: draft.repeatedClass,
                lastResult: draft.lastResult,
                // Documents
                schoolBillUrl: draft.schoolBillUrl,
                birthCertUrl: draft.birthCertUrl,
                primaryCertUrl: draft.primaryCertUrl,
                schoolResultUrl: draft.schoolResultUrl,
                assistanceLetterUrl: draft.assistanceLetterUrl,
                admissionLetterUrl: draft.admissionLetterUrl,
                passportUrl: draft.passportUrl,
                // Family info
                ...(applicant.familyInfo || {})
            } as any
        });

    } catch (error) {
        console.error('Error retrieving draft:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to retrieve draft' },
            { status: 500 }
        );
    }
}
