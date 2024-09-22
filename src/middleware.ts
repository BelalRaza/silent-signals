import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export { default } from 'next-auth/middleware'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // Redirect authenticated users from sign-in, sign-up, and verify pages to dashboard
    if (token && (url.pathname.startsWith('/sign-in') || 
                   url.pathname.startsWith('/sign-up') || 
                   url.pathname.startsWith('/verify'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect unauthenticated users trying to access the dashboard to sign-in
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Proceed to the next middleware or request handler
    return NextResponse.next()
}

// Configure matching paths
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}
