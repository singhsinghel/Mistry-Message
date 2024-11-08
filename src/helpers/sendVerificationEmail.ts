import { resend } from "@/lib/recend";
import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  //the function returns a Promise of type ApiResponse
  try {
   const newWmail = await resend.emails.send({
     from: "Mystry Message <onboarding@resend.dev>",
     to: email,
     subject: "Mystry Message | Verification Code",
     react: VerificationEmail({ username, otp: verifyCode }),
   });
    return {
      success: true,
      message: " Verification email sent successfully",
    };
  } catch (err) {
    console.error("Error sending verification email", err);
    return { success: false, message: "Failed to send verification email" };
  }
}
