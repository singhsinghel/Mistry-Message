import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    //checking user by username
    const { username, password, email } = await request.json(); //next.js requires await for parsing into json

    const checkSchema = {
      username,
      password,
      email,
    };
    const result = signUpSchema.safeParse(checkSchema);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message:
          //if userErrors exists then we'll send all the errors with comma between them
          usernameErrors?.length > 0
            ? usernameErrors.join(", ")
            : "Invalid parameters",
      });
    }
    //check for existing verified username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username: username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    //checking user by email and generate verification code
    const existingUserVerifiedByEmail = await UserModel.findOne({ email });

    //generating a verifyCode that'll work as an otp.
    const verifyCode = Math.floor(1000000 + Math.random() * 9000000).toString();

    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User Already registered wit this email",
        });
      }
      //Update existing unverified user's password and verification code
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserVerifiedByEmail.password = hashedPassword;
      existingUserVerifiedByEmail.verifyCode = verifyCode;
      existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
        Date.now() + 1000 * 60 * 60
      );
      await existingUserVerifiedByEmail.save();
    }

    // create a newa user if email doesn't exists
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });
      await newUser.save();
    }
    //sending verificaition email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: "email", emailResponse },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "user registered successfully, Please veriffy your email",
    });
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json({
      success: false,
      message: "Error registering user",
    });
  }
}
