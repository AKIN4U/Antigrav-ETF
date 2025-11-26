import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApplicantNotification(email: string, name: string, applicationId: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email not sent.");
        return;
    }

    try {
        await resend.emails.send({
            from: 'Antigrav ETF <onboarding@resend.dev>', // Default Resend testing domain
            to: email,
            subject: 'Application Received - Antigrav ETF',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0f172a;">Application Received</h1>
            <p>Dear ${name},</p>
            <p>We have successfully received your scholarship application.</p>
            <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">Application ID: ${applicationId}</p>
            </div>
            <p>Our committee will review your submission and verify your documents. We will contact you regarding the next steps.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #64748b; font-size: 14px;">Best regards,<br/>Antigrav ETF Team</p>
        </div>
      `
        });
    } catch (error) {
        console.error("Failed to send applicant email:", error);
    }
}

export async function sendAdminNotification(applicantName: string, applicationId: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email not sent.");
        return;
    }

    try {
        // Default to the known admin email if not specified in env
        const adminEmail = process.env.ADMIN_EMAIL || 'akin4u@gmail.com';
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        await resend.emails.send({
            from: 'Antigrav ETF <onboarding@resend.dev>',
            to: adminEmail,
            subject: `New Application: ${applicantName}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0f172a;">New Scholarship Application</h1>
            <p>A new application has been submitted.</p>
            <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Applicant:</strong> ${applicantName}</p>
                <p style="margin: 8px 0 0 0;"><strong>Application ID:</strong> ${applicationId}</p>
            </div>
            <a href="${appUrl}/admin/applications/${applicationId}" style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Application</a>
        </div>
      `
        });
    } catch (error) {
        console.error("Failed to send admin email:", error);
    }
}
