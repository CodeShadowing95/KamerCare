import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pages qui nécessitent une authentification pour les docteurs
const doctorRoutes = [
  '/doctor',
  '/doctor/appointments',
  '/doctor/patients',
  '/doctor/queue',
  '/doctor/messages',
  '/doctor/prescriptions',
  '/doctor/analytics',
]

// Pages qui nécessitent une authentification pour les patients
const patientRoutes = [
  '/dashboard',
  '/reglement',
]

// Pages qui nécessitent une authentification pour les administrateurs
const adminRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/manage-users',
  '/admin/hospitals',
  '/admin/analytics',
  '/admin/settings',
]

// Toutes les routes protégées
const protectedRoutes = [...doctorRoutes, ...patientRoutes, ...adminRoutes]

// Pages d'authentification (accessibles uniquement si non connecté)
const authRoutes = ['/doctor/login', '/doctor/signup', '/login', '/signup']

// Pages publiques (accessibles à tous)
const publicRoutes = ['/', '/search-doctors']

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
    if (route === '/admin') {
      return pathname === '/admin' || pathname.startsWith('/admin/')
    }
    if (route === '/dashboard') {
      return pathname === '/dashboard' || pathname.startsWith('/dashboard/')
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
    // Redirection intelligente basée sur le type de route
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      // Pour les routes admin, rediriger vers la page de connexion admin
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    } else if (doctorRoutes.some(route => pathname.startsWith(route))) {
      // Pour les routes docteur, rediriger vers la page de connexion docteur
      const loginUrl = new URL('/doctor/login', request.url)
      return NextResponse.redirect(loginUrl)
    } else {
      // Pour les autres routes (patient), rediriger vers la page de connexion générale
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Si l'utilisateur est authentifié et essaie d'accéder à une page d'auth
  if (isAuthenticated && isAuthRoute) {
    // Redirection intelligente basée sur le rôle utilisateur
    // Note: Le middleware ne peut pas accéder au localStorage, donc on redirige vers /doctor par défaut
    // La logique de redirection basée sur les rôles est gérée dans les pages de connexion
    const dashboardUrl = new URL('/login', request.url)
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