import { Resend } from 'resend';
import { getSetting } from './settings';

// Lazy initialize to avoid build-time errors
let resend: Resend | null = null;

function getResendClient() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

const getFromEmail = () => {
    return process.env.EMAIL_FROM || 'Antigrav ETF <onboarding@resend.dev>';
};

const DEFAULT_TEMPLATES = {
    applicant_received: {
        subject: "Application Received - Antigrav ETF",
        body: "Dear {name},\n\nWe have successfully received your scholarship application.\n\nApplication ID: {applicationId}\n\nOur committee will review your submission and verify your documents. We will contact you regarding the next steps.\n\nBest regards,\nAntigrav ETF Team"
    },
    admin_new_application: {
        subject: "New Application: {applicantName}",
        body: "A new scholarship application has been submitted.\n\nApplicant: {applicantName}\nApplication ID: {applicationId}\n\nYou can review this application here:\n{appLink}"
    },
    status_update: {
        subject: "Application Update - Antigrav ETF",
        body: "Dear {name},\n\nYour scholarship application status has been updated to: {status}.\n\nPlease log in to your dashboard for more details.\n\nBest regards,\nAntigrav ETF Team"
    }
};

const wrapHtml = (content: string, title: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; font-size: 20px; font-weight: 700;">${title}</h2>
    <div style="color: #334155; line-height: 1.6; font-size: 15px; white-space: pre-wrap; margin-top: 16px; margin-bottom: 16px;">${content}</div>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
    <p style="color: #64748b; font-size: 12px; margin-bottom: 0; text-align: center;">This is an automated notification from the CCC Garki Education Trust Fund (ETF) Portal.</p>
</div>
`;

export async function sendApplicantNotification(email: string, name: string, applicationId: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email not sent.");
        return;
    }

    const client = getResendClient();
    if (!client) return;

    try {
        const templates = await getSetting("email_templates", DEFAULT_TEMPLATES);
        const template = templates.applicant_received || DEFAULT_TEMPLATES.applicant_received;

        const subject = template.subject
            .replace(/{name}/g, name)
            .replace(/{applicationId}/g, applicationId);

        const body = template.body
            .replace(/{name}/g, name)
            .replace(/{applicationId}/g, applicationId);

        await client.emails.send({
            from: getFromEmail(),
            to: email,
            subject: subject,
            html: wrapHtml(body, "Application Received")
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
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            console.warn("ADMIN_EMAIL is not set. Admin notification not sent.");
            return;
        }
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const client = getResendClient();
        if (!client) return;

        const templates = await getSetting("email_templates", DEFAULT_TEMPLATES);
        const template = templates.admin_new_application || DEFAULT_TEMPLATES.admin_new_application;

        const appLink = `${appUrl}/admin/applications/${applicationId}`;
        const subject = template.subject
            .replace(/{applicantName}/g, applicantName)
            .replace(/{applicationId}/g, applicationId);

        const body = template.body
            .replace(/{applicantName}/g, applicantName)
            .replace(/{applicationId}/g, applicationId)
            .replace(/{appLink}/g, appLink)
            .replace(/{appUrl}/g, appUrl);

        let htmlContent = wrapHtml(body, "New Scholarship Application");
        if (body.includes(appLink)) {
            htmlContent = htmlContent.replace(
                appLink, 
                `<a href="${appLink}" style="color: #3b82f6; text-decoration: underline; font-weight: 500;">${appLink}</a>`
            );
        }

        await client.emails.send({
            from: getFromEmail(),
            to: adminEmail,
            subject: subject,
            html: htmlContent
        });
    } catch (error) {
        console.error("Failed to send admin email:", error);
    }
}

export async function sendStatusUpdateEmail(email: string, name: string, status: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email not sent.");
        return;
    }

    const client = getResendClient();
    if (!client) return;

    try {
        const templates = await getSetting("email_templates", DEFAULT_TEMPLATES);
        const template = templates.status_update || DEFAULT_TEMPLATES.status_update;

        const subject = template.subject
            .replace(/{name}/g, name)
            .replace(/{status}/g, status);

        const body = template.body
            .replace(/{name}/g, name)
            .replace(/{status}/g, status);

        await client.emails.send({
            from: getFromEmail(),
            to: email,
            subject: subject,
            html: wrapHtml(body, "Application Status Update")
        });
    } catch (error) {
        console.error("Failed to send status update email:", error);
    }
}
