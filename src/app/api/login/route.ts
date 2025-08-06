import { loginController } from '@/controllers/authController';

export async function POST(request: Request) {
    return await loginController(request as any);
}