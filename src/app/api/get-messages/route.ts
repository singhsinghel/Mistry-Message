import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      { success: false, messsgae: "Not Authenticated. Please login angain" },
      { status: 401 }
    );
  }

  await dbConnect();
  try {
    //as user._id is converted into string in options callback, and aggregation pipeline in mongodb can cause problem for accessing it,
    // so here new type is defined which will automatically convert it into ObjectId
    const userId = new mongoose.Types.ObjectId(user._id);
    const UserForMessages = await UserModel.aggregate([
      { $match: { id: userId } },

      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    //In this condition the aggregation pipeline will return an array of the user
    if (!UserForMessages || UserForMessages.length === 0) {
      return Response.json(
        {
          success: false,
          messsgae: "User not found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        messsgae: "Got all messages",
        messages: UserForMessages[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting all messages", error);
    return Response.json(
      {
        success: false,
        messsgae: "Not Authenticated. Please login angain",
      },
      { status: 500 }
    );
  }
}
