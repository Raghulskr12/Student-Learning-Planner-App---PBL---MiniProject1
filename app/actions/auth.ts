'use server';

import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const college = formData.get('college') as string;

    if (!name || !email || !password) {
      return { error: 'Name, email, and password are required.' };
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return { error: 'An account with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      college
    });

    return { success: true };

  } catch (error: any) {
    console.error('Registration Error:', error);
    return { error: 'Something went wrong during registration.' };
  }
}
