import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

// POST /api/auth/verify
// Body: { "email": "...", "password": "..." }
// Use this endpoint in Postman to verify credentials work
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Compare password with bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    // ✅ Auth successful — return user details (never return password!)
    return NextResponse.json({
      success: true,
      message: "Authentication successful ✅",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        college: user.college || "",
        preferences: user.preferences,
        notifications: user.notifications,
        createdAt: user.createdAt,
      },
    });

  } catch (error: any) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}

// GET /api/auth/verify
// Quick health check — confirms this route is reachable
export async function GET() {
  return NextResponse.json({
    status: "Auth API is running 🚀",
    endpoints: {
      "POST /api/auth/verify": "Verify credentials with { email, password }",
      "GET /api/auth/session": "Check current session (browser only)",
      "GET /api/auth/csrf": "Get CSRF token for NextAuth flow",
    },
  });
}
