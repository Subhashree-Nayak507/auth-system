import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const generateTokenAndSetCookie = (username: string, userRole: string, response: NextResponse) => {
    try {
        const token = jwt.sign(
            { 
                username: username, 
                role: userRole      
            }, 
            process.env.JWT_SECRET!, 
            { expiresIn: '1d' }
        );

        response.cookies.set('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  24 * 60 * 60 * 1000, 
            path: '/' 
        });

        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

