import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, verifyCode } = await request.json();
    const user = await UserModel.findOne({username});

    if (!user) {
      return Response.json(
        { success: false, message: "No data of user" },
        { status: 500 }
      );
    }
    //checking expiry date of code
    if (user.verifyCodeExpiry > new Date(Date.now())) {
      return Response.json(
        { success: false, message: "Code expired" },
        { status: 500 }
      );
    }
    if (user.verifyCode !== verifyCode) {
      return Response.json(
        { success: false, message: "Invalid code" },
        { status: 500 }
      );
    }

    //after checking everything update userverify status and save user
    user.isVerified=true;
    await user.save();
    return Response.json(
      { success: true, message: "Code Accepted" },
      { status: 200 }
    );
  } catch (error) {
     console.error("failed verifying otp");
     
    return Response.json(
      {
        success: false,
        messsage: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
