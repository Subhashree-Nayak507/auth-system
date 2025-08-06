import { loginController } from '@/controllers/authController';
import { NextRequest } from 'next/server';

export async function POST(request: Request) {
    return await loginController(request as NextRequest);
}