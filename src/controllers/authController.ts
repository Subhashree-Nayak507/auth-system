import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/users';
import { generateTokenAndSetCookie } from '@/lib/token';

export const loginController = async (req: NextRequest) => {
    try {
        const { username, password } =  await req.json();

        if (!username || !password) {
            return NextResponse.json({
                success: false,
                message: "Username and password are required"
            }, { status: 400 });
        }

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        
        if (!trimmedUsername || !trimmedPassword) {
            return NextResponse.json({
                success: false,
                message: "Username and password cannot be empty"
            }, { status: 400 });
        }

        const user = users.find(u => u.username === trimmedUsername);       
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        const isPasswordCorrect = trimmedPassword === user.password;
        if (!isPasswordCorrect) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        const response = NextResponse.json({
            success: true,
            data: {
                username: user.username,
                role: user.role
            }
        }, { status: 200 });
        generateTokenAndSetCookie(user.username, user.role, response);

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred. Please try again later."
        }, { status: 500 });
    }
};


export const logoutController = async () => {
    try {
        const response = NextResponse.json(
            { 
                success: true,
                message: "Logout successful" 
            },
            { status: 200 }
        );
        response.cookies.delete("jwt");
        return response;

    } catch (error: unknown) {
        console.error("Logout error:", error);
        
        return NextResponse.json(
            { 
                success: false,
                message: "Internal server error" 
            },
            { status: 500 }
        );
    }
};
