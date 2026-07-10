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

    const hashedPassword = process.env.ADMIN_HASH
    if (!hashedPassword) {
        return { success: false, message: 'Admin password hash is not set in environment variables' }
    }

    const isPasswordValid = await verifyAdminPassword(hashedPassword, password)

    if (!isPasswordValid) {
        return { success: false, message: 'Invalid password' }
    }

    try {
        const token = await signJWT({ id: 1, user: 'eliett-admin' })

        const cookieStore = await cookies();
        cookieStore.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 12 * 60 * 60,
            path: '/',
        })
    } catch (error) {
        console.error("Error during admin action logging:", error);
        return { success: false, message: 'An error occurred while logging the action' }
    }
    redirect('/admin/dashboard');
}