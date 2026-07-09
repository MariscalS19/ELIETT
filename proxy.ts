import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './backend/utils/authUtils';

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('admin_session')?.value;

    const isValidToken = token ? await verifyJWT(token) : false;

    if (pathname.startsWith('/admin/dashboard')) {
        if (!isValidToken) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    };

    if (pathname.startsWith('/login')) {
        if (isValidToken) {
            const dashboardUrl = new URL('/admin/dashboard', request.url);
            return NextResponse.redirect(dashboardUrl);
        }
    };

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/admin/:path*'],
};