import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect dashboard and database routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/database')) {
    const sid = request.cookies.get('sid')?.value
    
    if (!sid) {
      return NextResponse.redirect(new URL('/connect', request.url))
    }
    
    // Additional check: verify the session has valid connection data
    // This would require a session validation endpoint in a real implementation
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/database/:path*']
}