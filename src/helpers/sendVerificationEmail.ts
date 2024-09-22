import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string ,
    username:string,
    verifyCode:string

):Promise<ApiResponse>{
    try{
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to:"zaynbr437@gmail.com",
            subject: 'Hello world',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        
          if (error) {
            console.log(error)
            return {success: false, message:`this is the error: ${error}`}
          }
          else{
            return {success: true, message: `Verification email send successfully:${data}`}
          }
        // await resend.emails.send({
        //     from: 'Acme <onboarding@resend.dev>', 
        //     to: email, 
        //     subject: 'Silent Signal | Verification Code',
        //     react: VerificationEmail({username,otp:verifyCode})
        //     }) ;
        // return {success: true, message: 'Verification email send successfully'}
    }
    catch(emailError){
        console.error("Error sending verification Email",emailError)
        return {success:false ,message:'Failed to send verification email'}
    }
}


// import { resend } from "../lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//     email: string,
//     username: string,
//     verifyCode: string
// ): Promise<ApiResponse> {
//     try {
  
//         await resend.emails.send({
//             from:'Acme <onboarding@resend.dev>',
//             to: email,
//             subject: 'Silent Signal | Verification Code',
//             react:VerificationEmail({username,otp:verifyCode})
//         });
//         console.log("pop")
//         return { success: true, message: 'Verification email sent successfully' };
//     } catch (emailError) {
//         console.error("Error sending verification Email", emailError);
//         return { success: false, message: 'Failed to send verification email' };
//     }
// }
