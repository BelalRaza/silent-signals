// import { resend } from "../lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//     email:string ,
//     username:string,
//     verifyCode:string
// ):Promise<ApiResponse>{
//     try{
//         const { data, error } = await resend.emails.send({
//             from: 'Acme <onboarding@resend.dev>',
//             to:"zaynbr437@gmail.com",
//             subject: 'Hello world',
//             react: VerificationEmail({username,otp:verifyCode}),
//           });
        
//           if (error) {
//             console.log(error)
//             return {success: false, message:`this is the error: ${error}`}
//           }
//           else{
//             return {success: true, message: `Verification email send successfully:${data}`}
//           }
//         // await resend.emails.send({
//         //     from: 'Acme <onboarding@resend.dev>', 
//         //     to: email, 
//         //     subject: 'Silent Signal | Verification Code',
//         //     react: VerificationEmail({username,otp:verifyCode})
//         //     }) ;
//         // return {success: true, message: 'Verification email send successfully'}
//     }
//     catch(emailError){
//         console.error("Error sending verification Email",emailError)
//         return {success:false ,message:'Failed to send verification email'}
//     }
// }

import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';

// Create a transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to another service (e.g., Outlook, Yahoo, etc.)
  auth: {
    user: process.env.GMAIL_USER, // Your email address
    pass: process.env.GMAIL_PASS, // Your email password or app-specific password
  },
});

// Function to send verification email
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Define email options
    const mailOptions = {
      from: '"Acme Support" <no-reply@acme.com>', // Sender address
      to: email, // Receiver's email
      subject: 'Email Verification Code',
      html: `
        <p>Hello ${username},</p>
        <p>Thank you for registering. Your verification code is:</p>
        <h3>${verifyCode}</h3>
        <p>This code will expire in 1 hour. If you did not request this, please ignore this email.</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Log the response and return success
    console.log('Message sent: %s', info.messageId);
    return { success: true, message: `Verification email sent successfully: ${info.messageId}` };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email' };
  }
}
