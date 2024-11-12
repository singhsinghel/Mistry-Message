import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        Email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // returning user to next auth
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        console.log(credentials);
        
        try {
          //finding user by email "OR" username
          
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }
          const isPasswwordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswwordCorrect) {
            throw new Error("Incorrect username or password");
          }
          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  //nextAuth handeling routes
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        //returning these values of user to frontend as it'll be easy to access these
        //storing info of user in token
        token._id = user._id?.toString(); // for adding these types in user user is manipulated at next-auth.d.ts
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        //storing info of user in session
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
};
