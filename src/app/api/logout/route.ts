import { logoutController } from '@/controllers/authController';
import { NextRequest } from 'next/server';

export async function POST(request: Request) {
    return await logoutController(request as NextRequest);
}