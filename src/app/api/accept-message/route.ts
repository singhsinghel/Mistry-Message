import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "next-auth";

async function extractUserId() {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated, please login again",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  return userId;
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    // const session = await getServerSession(authOptions);
    // const user: User = session?.user as User;
    // if (!session || session.user) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: "not authenticated, please login again",
    //     },
    //     { status: 401 }
    //   );
    // }
    // const userId = user._id;
    const userId = extractUserId();
    const { acceptOrRejectMessages } = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptOrRejectMessages },
      { new: true }
    );
    //check if we are getting a user or not
    if (!updatedUser) {
      return Response.json(
        { success: false, messsage: "Failed updating messages" },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        messsage: "messages acceptance status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("failed to update acceptOrRejectMessages",error);
    return Response.json(
      { success: false, messsage: "Failed updating messages" },
      { status: 500 }
    );
  }
}
export async function Get() {
  await dbConnect();
  try {
    const userId = extractUserId();
    const user = await UserModel.findById(userId);

    //check if we are getting a user or not
    if (!user) {
      return Response.json(
        { success: false, messsage: "Failed to get user" },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        messsage: "got the status",
        isAcceptingMessage: user.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("failed to update accept Or Reject Messages",error);
    return Response.json(
      { success: false, messsage: "Failed getting messages settings" },
      { status: 500 }
    );
  }
}
