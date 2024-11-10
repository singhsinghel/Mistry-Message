import UserModel, { Message } from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request: Request) {
  const { username, content } = await request.json();

  await dbConnect();
  try {
    const user = await UserModel.findOne({ username });
    const newMessage = { content, createdAt: new Date() };
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 403 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }
    //here sending newMessage as Message interfave because in MessageSchema, type of Schema is set to Message interface
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    
    return Response.json(
      {
        success: false,
        message: "Error sending message",
      },
      { status: 500 }
    );
  }
}
