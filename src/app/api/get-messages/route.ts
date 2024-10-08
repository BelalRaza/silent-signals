import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { NextResponse } from 'next/server';


export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;











  if (!session || !_user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  if (!_user._id) {
    return NextResponse.json(
      { success: false, message: 'User ID is missing' },
      { status: 400 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $project: {
          _id: 1,
          messages: {
            $ifNull: ['$messages', []],
          },
        },
      },
      {
        $addFields: {
          messages: {
            $sortArray: {
              input: '$messages',
              sortBy: { createdAt: -1 },
            },
          },
        },
      },
    ]).exec();
    

    if (!user || user.length == 0) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

