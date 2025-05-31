import { useEffect } from 'react'
import { useLocation } from 'wouter'

// Add paths that should be accessible without authentication
const publicPaths = ['/auth/login', '/auth/signup']

export function useAuthMiddleware() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const currentPath = window.location.pathname

    // Allow access to public paths
    if (publicPaths.includes(currentPath)) {
      return
    }

    // Redirect to login if no token is present
    if (!token) {
      setLocation('/auth/login')
    }
  }, [setLocation])
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)',
  ],
} 