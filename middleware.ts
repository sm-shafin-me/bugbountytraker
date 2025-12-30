import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // This middleware can be used for additional route protection if needed
    // Currently, route protection is handled client-side via useAuth hook
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/leaderboard/:path*', '/admin-gate/:path*'],
};
