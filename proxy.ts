import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Protected routes
  const isDashboardRoute = pathname.startsWith('/admin/dashboard')
  const isProtectedApiRoute = pathname.startsWith('/api/works') || pathname.startsWith('/api/upload')
  
  // Login route
  const isLoginRoute = pathname === '/admin'

  if (isDashboardRoute || isProtectedApiRoute) {
    if (!token) {
      if (isProtectedApiRoute) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      if (isProtectedApiRoute) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // Redirect logged-in admin away from login page
  if (isLoginRoute && token) {
    const payload = verifyToken(token)
    if (payload && payload.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/works/:path*',
    '/api/upload/:path*',
  ],
}
