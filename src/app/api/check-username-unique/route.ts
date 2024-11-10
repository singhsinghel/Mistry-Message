import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameSchema } from "@/schemas/signUpSchema";

//since zod requires an objext to validate the incoming schema to stored schema so for comaprision we use objects for both
const UsernameQuerySchema = z.object({
  username: usernameSchema,
});

export async function GET(request: Request) {
  //connecting db
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    ///creating incoming object
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validation with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message:
          //if usernameErrors exists then we'll send all the errors with comma between them
          usernameErrors?.length > 0
            ? usernameErrors.join(", ")
            : "Invalid Query parameters",
      });
    }

    //extracting username from result(result gives status and data)
    const { username } = result.data;

    const existinguser = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    if (existinguser)
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 500 }
      );
    return Response.json(
      { success: true, message: "Username is unique" },
      { status: 200 }
    );
  } catch (error) {
    console.error("error checking username", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
