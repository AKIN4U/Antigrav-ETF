/**
 * SMS Notification Service
 * 
 * This module provides SMS notification functionality for the ETF platform.
 * It requires an external SMS provider to be configured.
 * 
 * SUPPORTED PROVIDERS:
 * 1. Twilio (International) - https://www.twilio.com
 * 2. Termii (Nigeria-focused) - https://www.termii.com
 * 3. Africa's Talking - https://africastalking.com
 * 
 * SETUP INSTRUCTIONS:
 * 1. Choose an SMS provider and create an account
 * 2. Add the following environment variables to your .env file:
 *    - SMS_PROVIDER=twilio|termii|africastalking
 *    - SMS_API_KEY=your_api_key
 *    - SMS_API_SECRET=your_api_secret (if required)
 *    - SMS_SENDER_ID=your_sender_id (e.g., "CCC_ETF")
 * 3. Install the provider's SDK: npm install twilio OR npm install termii-node
 * 4. Uncomment the implementation code below
 */

interface SMSOptions {
    to: string; // Phone number in E.164 format (e.g., +2348012345678)
    message: string;
}

interface SMSResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Send an SMS notification
 * @param options - SMS options including recipient and message
 * @returns Promise with send result
 */
export async function sendSMS(options: SMSOptions): Promise<SMSResult> {
    const provider = process.env.SMS_PROVIDER;

    if (!provider) {
        console.warn('SMS_PROVIDER not configured. SMS notifications are disabled.');
        return {
            success: false,
            error: 'SMS provider not configured'
        };
    }

    try {
        switch (provider) {
            case 'twilio':
                return await sendViaTwilio(options);
            case 'termii':
                return await sendViaTermii(options);
            case 'africastalking':
                return await sendViaAfricasTalking(options);
            default:
                return {
                    success: false,
                    error: `Unknown SMS provider: ${provider}`
                };
        }
    } catch (error: any) {
        console.error('Error sending SMS:', error);
        return {
            success: false,
            error: error.message || 'Failed to send SMS'
        };
    }
}

/**
 * Send SMS via Twilio
 * SETUP: npm install twilio
 * ENV: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 */
async function sendViaTwilio(options: SMSOptions): Promise<SMSResult> {
    // Uncomment when Twilio is set up:
    /*
    const twilio = require('twilio');
    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    const message = await client.messages.create({
        body: options.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: options.to
    });

    return {
        success: true,
        messageId: message.sid
    };
    */

    console.log('[SMS MOCK - Twilio]', options);
    return { success: true, messageId: 'mock-twilio-id' };
}

/**
 * Send SMS via Termii (Nigeria-focused)
 * SETUP: npm install axios
 * ENV: TERMII_API_KEY, TERMII_SENDER_ID
 */
async function sendViaTermii(options: SMSOptions): Promise<SMSResult> {
    // Uncomment when Termii is set up:
    /*
    const axios = require('axios');
    
    const response = await axios.post('https://api.ng.termii.com/api/sms/send', {
        to: options.to,
        from: process.env.TERMII_SENDER_ID,
        sms: options.message,
        type: 'plain',
        channel: 'generic',
        api_key: process.env.TERMII_API_KEY
    });

    return {
        success: response.data.message === 'Successfully Sent',
        messageId: response.data.message_id
    };
    */

    console.log('[SMS MOCK - Termii]', options);
    return { success: true, messageId: 'mock-termii-id' };
}

/**
 * Send SMS via Africa's Talking
 * SETUP: npm install africastalking
 * ENV: AT_API_KEY, AT_USERNAME
 */
async function sendViaAfricasTalking(options: SMSOptions): Promise<SMSResult> {
    // Uncomment when Africa's Talking is set up:
    /*
    const AfricasTalking = require('africastalking');
    const africastalking = AfricasTalking({
        apiKey: process.env.AT_API_KEY,
        username: process.env.AT_USERNAME
    });

    const sms = africastalking.SMS;
    const result = await sms.send({
        to: [options.to],
        message: options.message
    });

    return {
        success: result.SMSMessageData.Recipients[0].status === 'Success',
        messageId: result.SMSMessageData.Recipients[0].messageId
    };
    */

    console.log('[SMS MOCK - Africa\'s Talking]', options);
    return { success: true, messageId: 'mock-at-id' };
}

/**
 * Template functions for common SMS notifications
 */

export async function notifyApplicationReceived(applicantName: string, phone: string): Promise<SMSResult> {
    return sendSMS({
        to: phone,
        message: `Dear ${applicantName}, your ETF bursary application has been received and is under review. You will be notified of the outcome. - CCC Central Cathedral Abuja`
    });
}

export async function notifyApplicationApproved(applicantName: string, phone: string, amount: string): Promise<SMSResult> {
    return sendSMS({
        to: phone,
        message: `Congratulations ${applicantName}! Your ETF bursary application has been approved for ₦${amount}. Payment details will be sent soon. - CCC Central Cathedral Abuja`
    });
}

export async function notifyApplicationRejected(applicantName: string, phone: string): Promise<SMSResult> {
    return sendSMS({
        to: phone,
        message: `Dear ${applicantName}, we regret to inform you that your ETF bursary application was not approved at this time. You may reapply next year. - CCC Central Cathedral Abuja`
    });
}

export async function notifyReturnedForCorrection(applicantName: string, phone: string, notes: string): Promise<SMSResult> {
    return sendSMS({
        to: phone,
        message: `Dear ${applicantName}, your ETF application needs correction: ${notes}. Please log in to update your application. - CCC Central Cathedral Abuja`
    });
}

export async function notifyInterviewScheduled(applicantName: string, phone: string, date: string, time: string): Promise<SMSResult> {
    return sendSMS({
        to: phone,
        message: `Dear ${applicantName}, your ETF interview is scheduled for ${date} at ${time}. Please attend with your parent/guardian. - CCC Central Cathedral Abuja`
    });
}
