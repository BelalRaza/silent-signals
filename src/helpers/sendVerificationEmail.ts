import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';

export function isVerificationEmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER?.trim() && process.env.GMAIL_PASS?.trim());
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  if (!isVerificationEmailConfigured()) {
    return { success: false, message: 'Verification email is temporarily unavailable. Please try again later.' };
  }

  const sender = process.env.GMAIL_USER!.trim();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: sender, pass: process.env.GMAIL_PASS!.replace(/\s/g, '') },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  try {
    await transporter.sendMail({
      from: { name: 'Silent Signal', address: sender },
      to: email,
      subject: 'Verify your Silent Signal account',
      text: `Hello ${username},\n\nYour Silent Signal verification code is ${verifyCode}.\nThis code expires in one hour.`,
      // Usernames have already passed the server's alphanumeric validation.
      html: `<p>Hello ${username},</p>
        <p>Your Silent Signal verification code is:</p>
        <h3>${verifyCode}</h3>
        <p>This code expires in one hour. If you did not request it, you can ignore this email.</p>`,
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (error) {
    console.error('Verification email delivery failed:', {
      name: error instanceof Error ? error.name : 'UnknownError',
      code: typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined,
    });
    return {
      success: false,
      message: 'We could not send your verification email. Please try signing up again.',
    };
  }
}
