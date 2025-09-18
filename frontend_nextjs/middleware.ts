import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pages qui nécessitent une authentification
const protectedRoutes = [
  '/doctor',
  '/doctor/appointments',
  '/doctor/patients',
  '/doctor/queue',
  '/doctor/messages',
  '/doctor/prescriptions',
  '/doctor/analytics',
  '/reglement',
  '/dashboard/*',
  '/admin',
]

// Pages d'authentification (accessibles uniquement si non connecté)
const authRoutes = ['/doctor/login', '/doctor/signup']

// Pages publiques (accessibles à tous)
const publicRoutes = ['/', '/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Récupérer le token depuis les cookies ou headers
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  const isAuthenticated = !!token
  
  // Vérifier si la route est protégée (correspondance exacte ou avec sous-routes)
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route === '/doctor') {
      return pathname === '/doctor' || (pathname.startsWith('/doctor/') && !authRoutes.some(authRoute => pathname.startsWith(authRoute)))
    }
    return pathname.startsWith(route)
  })
  
  // Vérifier si c'est une route d'authentification (correspondance exacte)
  const isAuthRoute = authRoutes.includes(pathname)
  
  // Vérifier si c'est une route publique
  const isPublicRoute = publicRoutes.includes(pathname) || 
                        pathname.startsWith('/_next') || 
                        pathname.startsWith('/api') ||
                        pathname.includes('.')
  
  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/doctor/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // Si l'utilisateur est authentifié et essaie d'accéder à une page d'auth
  if (isAuthenticated && isAuthRoute) {
    const dashboardUrl = new URL('/doctor', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  // Pour toutes les autres routes, continuer normalement
  return NextResponse.next()
}

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}