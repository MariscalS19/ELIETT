import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyJWT } from './backend/utils/authUtils';

export default async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';
    const token = request.cookies.get('admin_session')?.value;

    const isValidToken = token ? await verifyJWT(token) : false;

    if (pathname.startsWith('/admin')) {
        if (!isValidToken) {
            console.log('Redirecting to /login due to invalid or missing token');
            return NextResponse.redirect(new URL('/login', request.url));
        }
    };

    if (pathname.startsWith('/login') && request.method === 'GET') {
        if (isValidToken) {
            console.log('Redirecting to /admin/dashboard, user is already authenticated');
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/admin/:path*'],
};