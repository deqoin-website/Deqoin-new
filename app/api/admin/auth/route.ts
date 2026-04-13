import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { username, password } = body;

    // 1. Try to find user in DB
    const user = await User.findOne({ username, isActive: true });
    
    if (user) {
      // 2. Verify hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const response = NextResponse.json({ 
          success: true, 
          user: { name: user.name, role: user.role } 
        });

        // Set auth cookie
        // For compatibility with current middleware, we use 'is_logged_in' 
        // but we could store more info if we update the middleware.
        (await cookies()).set("admin_session", "is_logged_in", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        });

        return response;
      }
    }

    return NextResponse.json(
      { success: false, message: "Hatalı kullanıcı adı veya şifre" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
