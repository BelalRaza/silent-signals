import { randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import { isVerificationEmailConfigured, sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import UserModel from '@/model/User';
import { signupSchema } from '@/schemas/signUpSchema';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: 'Please submit a valid sign-up request.' },
      { status: 400 }
    );
  }

  const result = signupSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { success: false, message: result.error.issues[0]?.message ?? 'Please check your sign-up details.' },
      { status: 400 }
    );
  }

  if (!isVerificationEmailConfigured()) {
    return Response.json(
      {
        success: false,
        message: 'Sign-up is temporarily unavailable while verification email is being set up. Please try again later.',
      },
      { status: 503 }
    );
  }

  const { username, email, password } = result.data;
  try {
    await dbConnect();
    const [existingUsername, existingEmail] = await Promise.all([
      UserModel.findOne({ username }),
      UserModel.findOne({ email }),
    ]);

    if (existingUsername && existingUsername.email !== email) {
      return Response.json(
        { success: false, message: 'Username is already taken. Please choose another one.' },
        { status: 409 }
      );
    }

    if (existingEmail?.isVerified || existingUsername?.isVerified) {
      return Response.json(
        { success: false, message: 'An account already exists with these details. Please sign in.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = randomInt(100000, 1000000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

    if (existingEmail) {
      existingEmail.username = username;
      existingEmail.password = hashedPassword;
      existingEmail.verifyCode = verifyCode;
      existingEmail.verifyCodeExpiry = verifyCodeExpiry;
      await existingEmail.save();
    } else {
      await UserModel.create({
        username, email, password: hashedPassword, verifyCode, verifyCodeExpiry,
        isVerified: false, isAcceptingMessage: true, messages: [],
      });
    }

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 502 }
      );
    }

    return Response.json({ success: true, message: 'Check your email for a verification code.' });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return Response.json(
        { success: false, message: 'That username or email is already in use. Please check your details.' },
        { status: 409 }
      );
    }
    console.error('Error registering user:', error instanceof Error ? error.name : 'UnknownError');
    return Response.json(
      { success: false, message: 'We could not create your account. Please try again.' },
      { status: 500 }
    );
  }
}
