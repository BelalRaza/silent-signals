import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" }, // 'identifier' instead of 'username'
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
         
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
          });

          if (!user) {
            throw new Error("No user found with this email or username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

         
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (err: any) {
          throw new Error(err.message || "Login failed");
        }
      },
    }),
  ],
  callbacks:{
    async session({ session,token }) {
      // console.log("this is token in session function -> ", token)
            if(token){
                session.user._id = token._id
                session.user.isVerified=token.isVerfied
                session.user.isAcceptingMessages=token.isAcceptingMessages
                session.user.username = token.username
            }
        return session
      },
      async jwt({ token,user}) {
        // console.log("this is in jwt -> ", user);
        if(user){
            token._id = user._id?.toString();
            token.isVerified=user.isVerified;
            token.isAcceptingMessages=user.isAcceptingMessages;
            token.username = user.username
        }
        return token
      }
  },
  pages: {
    signIn: '/sign-in', 
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET, 
};
