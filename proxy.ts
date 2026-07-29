import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyJWT } from './backend/utils/authUtils';

export default async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith('/login')) {
        const token = request.cookies.get('admin_session')?.value;
        const isValidToken = token ? await verifyJWT(token) : false;

        if (isValidToken && request.method === 'GET') {
            console.log(
                'Redirecting to /admin/dashboard, user is already authenticated'
            );
            return NextResponse.redirect(
                new URL('/admin/dashboard', request.url)
            );
        }

        return NextResponse.next();
    }

    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin_session')?.value;
        const isValidToken = token ? await verifyJWT(token) : false;

        if (!isValidToken) {
            console.log(
                'Redirecting to /login due to invalid or missing token'
            );
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/login/', '/admin/:path*'],
};
