import { logoutController } from '@/controllers/authController';

export async function POST() {
    return await logoutController();
}