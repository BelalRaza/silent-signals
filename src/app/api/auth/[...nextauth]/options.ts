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
            if(token){
                session.user._id = token._id
                session.user.isVerified=token.isVerfied
                session.user.isAcceptingMessages=token.isAcceptingMessages
                session.user.username = token.username
            
            }


        return session
      },
      async jwt({ token,user}) {
        if(user){
            token._id = user._id?.toString();
            token.isVerified=user.isVerfied;
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



// import { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import bcrypt from 'bcryptjs';
// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User'; // Assuming you have a UserDocument type

// interface Credentials {
//   identifier?: string;
//   password?: string;
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: 'credentials',
//       name: 'Credentials',
//       credentials: {
//         identifier: { label: 'Email or Username', type: 'text' }, // Changing to identifier
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials: Credentials | null): Promise<UserDocument | null> {
//         await dbConnect();

//         if (!credentials) {
//           throw new Error('Credentials are missing');
//         }

//         try {
//           const user = await UserModel.findOne({
//             $or: [
//               { email: credentials.identifier },
//               { username: credentials.identifier },
//             ],
//           });

//           if (!user) {
//             throw new Error('No user found with this email or username');
//           }

//           if (!user.isVerified) {
//             throw new Error('Please verify your account before logging in');
//           }

//           const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
//           if (isPasswordCorrect) {
//             return user; // Return the user document
//           } else {
//             throw new Error('Incorrect password');
//           }
//         } catch (err: unknown) {
//           if (err instanceof Error) {
//             throw new Error(err.message);
//           } else {
//             throw new Error('An unknown error occurred');
//           }
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString(); // Convert ObjectId to string
//         token.isVerified = user.isVerified;
//         token.isAcceptingMessages = user.isAcceptingMessages;
//         token.username = user.username;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token._id;
//         session.user.isVerified = token.isVerified;
//         session.user.isAcceptingMessages = token.isAcceptingMessages;
//         session.user.username = token.username;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: '/sign-in',
//   },
// };
