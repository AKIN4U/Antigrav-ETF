import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string }> }
) {
    try {
        const { path } = await params;
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Decode the path parameter (it may be URL encoded)
        const filePath = path ? decodeURIComponent(path) : '';

        if (!filePath) {
            return NextResponse.json(
                { error: 'File path is required' },
                { status: 400 }
            );
        }

        // Check if user is a committee member (admin)
        if (!user.email) {
            return NextResponse.json(
                { error: 'User email is required' },
                { status: 400 }
            );
        }

        const { data: adminUser } = await supabase
            .from('AdminUser')
            .select('id')
            .eq('email', user.email)
            .single();

        const isAdmin = !!adminUser;

        // If not admin, verify the document belongs to the user's application
        if (!isAdmin) {
            // Extract application ID from file path (format: applications/{applicationId}/{filename})
            const pathParts = filePath.split('/');
            if (pathParts.length < 2 || pathParts[0] !== 'applications') {
                return NextResponse.json(
                    { error: 'Invalid file path' },
                    { status: 400 }
                );
            }

            const applicationId = pathParts[1];

            // Verify the application belongs to this user
            // Note: Applicant model doesn't have userId, so we check via email
            const { data: application } = await supabase
                .from('Application')
                .select('applicantId, applicant:Applicant(email)')
                .eq('id', applicationId)
                .single();

            if (!application || application.applicant?.email !== user.email) {
                return NextResponse.json(
                    { error: 'Forbidden - You do not have access to this document' },
                    { status: 403 }
                );
            }
        }

        // Generate signed URL with 1 hour expiration
        const { data, error } = await supabase
            .storage
            .from('documents')
            .createSignedUrl(filePath, 3600); // 3600 seconds = 1 hour

        if (error) {
            console.error('Error generating signed URL:', error);
            return NextResponse.json(
                { error: 'Failed to generate document URL' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            signedUrl: data.signedUrl,
            expiresIn: 3600
        });

    } catch (error) {
        console.error('Error in document access:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
