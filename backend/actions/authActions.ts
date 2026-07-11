'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import verifyAdminPassword from '@/backend/utils/verify';
import { signJWT } from '@/backend/utils/authUtils';

export async function logAdminAction(prevState: any, formData: FormData) {
    const password = formData.get('password')?.toString()

    if (!password || password.trim() === '') {
        return { success: false, message: 'Password is required' }
    }

    const base64Hash = process.env.ADMIN_HASH_B64;
    if (!base64Hash) {
        return { success: false, message: 'Admin password hash is not set in environment variables' }
    }

    try {
        const hashedPassword = Buffer.from(base64Hash, 'base64').toString('utf-8');
        const isPasswordValid = await verifyAdminPassword(hashedPassword, password)

        if (!isPasswordValid) {
            return { success: false, message: 'Invalid password' }
        }

        const token = await signJWT({ id: 1, user: 'eliett-admin' })

        const cookieStore = await cookies();
        cookieStore.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 12 * 60 * 60,
            path: '/',
        })
    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error("Error during admin action logging:", error);
        return { success: false, message: 'An error occurred while logging the action' }
    }
    return { success: true, message: 'Action logged successfully' }
}