import { logoutController } from '@/controllers/authController';

export async function POST(request: Request) {
    return await logoutController(request as any);
}