'use server';
import { cookies } from 'next/headers';
import verifyAdminPassword from '@/backend/utils/verify';
import { signJWT } from '@/backend/utils/authUtils';
import { pool } from '@/backend/db/db';

const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 336 * 60 * 60; // 336 hours in seconds | 2 weeks

export async function logAdminAction(prevState: any, formData: FormData) {
    const password = formData.get('password')?.toString();

    if (!password || password.trim() === '') {
        return { success: false, message: 'Password is required' };
    }

    try {
        const [rows]: any = await pool.execute(
            'SELECT id, username, password_hash FROM users WHERE username = ?',
            ['eliett']
        );

        if (!rows || rows.length === 0) {
            return { success: false, message: 'Invalid credentials' };
        }

        const user = rows[0];
        const isPasswordValid = await verifyAdminPassword(
            user.password_hash,
            password
        );

        if (!isPasswordValid) {
            return { success: false, message: 'Invalid credentials' };
        }

        const token = await signJWT({ id: user.id, user: user.username });
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: COOKIE_MAX_AGE,
            path: '/',
        });
        return { success: true, message: 'Action logged successfully' };
    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') {
            throw error; // Re-throw the redirect error to be handled by Next.js
        }
        console.error('Error during admin action logging:', error);
        return {
            success: false,
            message: 'An error occurred while logging the action',
        };
    }
}
