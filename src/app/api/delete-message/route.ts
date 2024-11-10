import { dbConnect } from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { useParams } from "next/navigation";

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    const { messageId } = await request.json();
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not authenticated, please login again" },
        { status: 401 }
      );
    }
    const deleteMessageUser = await UserModel.updateOne(
     {_id: user._id},
      {
        $pull: { messages: {_id:messageId} },
      },
      { new: true }
    );
    if(deleteMessageUser.modifiedCount==0)
        return Response.json(
      { success: false, message: "Message already deleted" },
      { status: 404 })

    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Message deletion failed" },
      { status: 500 }
    );
  }
}
