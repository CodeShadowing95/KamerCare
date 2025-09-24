# Guide Complet Next.js

## Table des matières

1. [Introduction à Next.js](#introduction-à-nextjs)
2. [Les deux systèmes de routage](#les-deux-systèmes-de-routage)
3. [Architecture de l'application](#architecture-de-lapplication)
4. [Sécurité et middleware](#sécurité-et-middleware)
5. [Routes API](#routes-api)
6. [Système de composants](#système-de-composants)
7. [Fonctionnalités avancées](#fonctionnalités-avancées)
8. [Bonnes pratiques](#bonnes-pratiques)
9. [Ressources utiles](#ressources-utiles)

---

## 1. Introduction à Next.js

### Qu'est-ce que Next.js ?

Next.js est un framework React de production qui offre une expérience de développement optimale avec de nombreuses fonctionnalités intégrées. Créé par Vercel, il simplifie la création d'applications React modernes et performantes.

### Avantages principaux

- **Rendu hybride** : Support du SSR, SSG et CSR
- **Routage automatique** : Basé sur la structure des fichiers
- **Optimisations intégrées** : Images, fonts, scripts
- **API Routes** : Backend intégré
- **TypeScript natif** : Support complet sans configuration
- **Performance** : Optimisations automatiques (code splitting, prefetching)

### Différences avec React traditionnel

| Aspect | React traditionnel | Next.js |
|--------|-------------------|---------|
| **Routage** | Nécessite React Router | Routage automatique basé sur les fichiers |
| **Rendu** | Client-side uniquement | SSR, SSG, ISR disponibles |
| **Configuration** | Webpack/Babel manuel | Configuration zero |
| **Optimisations** | Manuelles | Automatiques |
| **API** | Backend séparé requis | API Routes intégrées |
| **SEO** | Limité (CSR) | Excellent (SSR/SSG) |

```jsx
// React traditionnel
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

// Next.js - Pas de configuration de routage nécessaire
// Les fichiers dans /pages ou /app définissent automatiquement les routes
```

---

## 2. Les deux systèmes de routage

### App Router (Recommandé - Next.js 13+)

Le **App Router** est le nouveau système de routage basé sur le dossier `app/`. Il utilise les React Server Components et offre plus de flexibilité.

#### Structure App Router

```
app/
├── layout.tsx          # Layout racine
├── page.tsx           # Page d'accueil (/)
├── loading.tsx        # UI de chargement
├── error.tsx          # UI d'erreur
├── not-found.tsx      # Page 404
├── about/
│   └── page.tsx       # Page /about
├── blog/
│   ├── page.tsx       # Page /blog
│   └── [slug]/
│       └── page.tsx   # Page /blog/[slug]
└── api/
    └── users/
        └── route.ts   # API /api/users
```

#### Exemple App Router

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <nav>Navigation globale</nav>
        {children}
        <footer>Footer global</footer>
      </body>
    </html>
  );
}

// app/page.tsx
export default function HomePage() {
  return <h1>Accueil</h1>;
}

// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Article: {params.slug}</h1>;
}
```

### Page Router (Legacy - Next.js 12 et antérieur)

Le **Page Router** utilise le dossier `pages/` et est plus simple mais moins flexible.

#### Structure Page Router

```
pages/
├── _app.tsx           # Composant App global
├── _document.tsx      # Document HTML personnalisé
├── index.tsx          # Page d'accueil (/)
├── about.tsx          # Page /about
├── blog/
│   ├── index.tsx      # Page /blog
│   └── [slug].tsx     # Page /blog/[slug]
└── api/
    └── users.ts       # API /api/users
```

#### Exemple Page Router

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <nav>Navigation globale</nav>
      <Component {...pageProps} />
      <footer>Footer global</footer>
    </>
  );
}

// pages/index.tsx
export default function HomePage() {
  return <h1>Accueil</h1>;
}

// pages/blog/[slug].tsx
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  
  return <h1>Article: {slug}</h1>;
}
```

### Comparaison des deux approches

| Fonctionnalité | App Router | Page Router |
|----------------|------------|-------------|
| **React Server Components** | ✅ Natif | ❌ Non supporté |
| **Layouts imbriqués** | ✅ Natif | ⚠️ Manuel |
| **Loading/Error UI** | ✅ Intégré | ⚠️ Manuel |
| **Streaming** | ✅ Natif | ❌ Non supporté |
| **Simplicité** | ⚠️ Plus complexe | ✅ Plus simple |
| **Maturité** | ⚠️ Récent | ✅ Stable |

---

## 3. Architecture de l'application

### Structure recommandée avec App Router

```
mon-app-nextjs/
├── app/                    # Routage et pages
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx          # Page d'accueil
│   ├── loading.tsx       # UI de chargement global
│   ├── error.tsx         # UI d'erreur global
│   ├── not-found.tsx     # Page 404
│   ├── (auth)/           # Groupe de routes
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── layout.tsx    # Layout spécifique
│   │   ├── page.tsx
│   │   └── settings/
│   └── api/              # Routes API
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI de base
│   ├── forms/           # Composants de formulaires
│   └── layout/          # Composants de mise en page
├── lib/                 # Utilitaires et configurations
│   ├── auth.ts         # Configuration authentification
│   ├── db.ts           # Configuration base de données
│   └── utils.ts        # Fonctions utilitaires
├── hooks/              # Hooks personnalisés
├── types/              # Définitions TypeScript
├── public/             # Assets statiques
└── middleware.ts       # Middleware global
```

### Routes dynamiques et imbriquées

#### Routes dynamiques

```tsx
// app/blog/[slug]/page.tsx - Route dynamique simple
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Article: {params.slug}</h1>;
}

// app/shop/[...categories]/page.tsx - Catch-all routes
export default function Categories({ params }: { params: { categories: string[] } }) {
  return <h1>Catégories: {params.categories.join(' / ')}</h1>;
}

// app/shop/[[...categories]]/page.tsx - Optional catch-all
// Correspond à /shop ET /shop/category1/category2/etc.
```

#### Routes imbriquées avec layouts

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>Sidebar Dashboard</aside>
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/settings/layout.tsx
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="settings">
      <nav>Navigation Settings</nav>
      {children}
    </div>
  );
}
```

#### Groupes de routes

```
app/
├── (marketing)/        # Groupe sans impact sur l'URL
│   ├── about/
│   └── contact/
├── (shop)/
│   ├── products/
│   └── cart/
└── (auth)/
    ├── login/
    └── register/
```

---

## 4. Sécurité et middleware

### Middleware Next.js

Le middleware s'exécute avant que la requête soit complétée, permettant de modifier la réponse, rediriger, ou ajouter des headers.

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Vérification d'authentification
  const token = request.cookies.get('auth-token');
  
  // Protection des routes admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Ajout de headers de sécurité
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Authentification avec NextAuth.js

```typescript
// lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Logique de vérification
        const user = await verifyCredentials(credentials);
        return user ? { id: user.id, email: user.email } : null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    }
  }
});

// middleware.ts avec NextAuth
import { auth } from '@/lib/auth';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', req.url));
  }
});
```

### Gestion des permissions

```typescript
// lib/permissions.ts
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.USER]: 0,
    [Role.MODERATOR]: 1,
    [Role.ADMIN]: 2
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Composant de protection
export function ProtectedRoute({ 
  children, 
  requiredRole = Role.USER 
}: {
  children: React.ReactNode;
  requiredRole?: Role;
}) {
  const { data: session } = useSession();
  
  if (!session) {
    return <LoginForm />;
  }
  
  if (!hasPermission(session.user.role, requiredRole)) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
}
```

---

## 5. Routes API

### Création d'endpoints API

```typescript
// app/api/users/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const users = await db.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await db.user.create({ data: body });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Données invalides' },
      { status: 400 }
    );
  }
}

// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({
    where: { id: params.id }
  });
  
  if (!user) {
    return NextResponse.json(
      { error: 'Utilisateur non trouvé' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(user);
}
```

### Bonnes pratiques pour les API Routes

#### Validation des données

```typescript
// lib/validations.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(18).max(120)
});

// app/api/users/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation avec Zod
    const validatedData = createUserSchema.parse(body);
    
    const user = await db.user.create({ data: validatedData });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
```

#### Authentification des API

```typescript
// lib/api-auth.ts
import { auth } from '@/lib/auth';

export async function withAuth(request: NextRequest) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  }
  
  return session;
}

// app/api/protected/route.ts
export async function GET(request: NextRequest) {
  const session = await withAuth(request);
  if (session instanceof NextResponse) return session;
  
  // Logique protégée
  return NextResponse.json({ data: 'Données protégées' });
}
```

### Intégration avec des bases de données

#### Avec Prisma

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// app/api/posts/route.ts
import { db } from '@/lib/db';

export async function GET() {
  const posts = await db.post.findMany({
    include: {
      author: true,
      comments: true
    }
  });
  
  return NextResponse.json(posts);
}
```

---

## 6. Système de composants

### Composants serveur vs client

#### React Server Components (RSC)

Les composants serveur s'exécutent côté serveur et ne sont pas envoyés au client.

```tsx
// app/blog/page.tsx - Composant serveur par défaut
import { db } from '@/lib/db';

export default async function BlogPage() {
  // Cette requête s'exécute côté serveur
  const posts = await db.post.findMany();
  
  return (
    <div>
      <h1>Blog</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

#### Client Components

Les composants client s'exécutent côté client et peuvent utiliser les hooks React.

```tsx
'use client'; // Directive obligatoire

import { useState, useEffect } from 'react';

export default function InteractiveCounter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

#### Composition hybride

```tsx
// app/dashboard/page.tsx - Composant serveur
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import InteractiveChart from './InteractiveChart'; // Client component

export default async function Dashboard() {
  const session = await auth();
  const data = await db.analytics.findMany({
    where: { userId: session.user.id }
  });
  
  return (
    <div>
      <h1>Dashboard de {session.user.name}</h1>
      {/* Composant serveur avec données */}
      <div className="stats">
        <p>Total: {data.length}</p>
      </div>
      {/* Composant client pour l'interactivité */}
      <InteractiveChart data={data} />
    </div>
  );
}
```

### Optimisation des performances

#### Lazy loading des composants

```tsx
import dynamic from 'next/dynamic';

// Chargement paresseux avec loading state
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Chargement...</p>,
  ssr: false // Désactive le SSR pour ce composant
});

export default function Page() {
  return (
    <div>
      <h1>Ma page</h1>
      <HeavyComponent />
    </div>
  );
}
```

#### Memoization

```tsx
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ 
  data 
}: { 
  data: any[] 
}) {
  // Calculs coûteux
  const processedData = data.map(item => ({
    ...item,
    processed: heavyCalculation(item)
  }));
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.processed}</div>
      ))}
    </div>
  );
});
```

### Réutilisation des composants

#### Composants UI génériques

```tsx
// components/ui/Button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded font-medium transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
        },
        {
          'px-2 py-1 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
```

---

## 7. Fonctionnalités avancées

### Server-Side Rendering (SSR)

```tsx
// app/products/[id]/page.tsx
interface Product {
  id: string;
  name: string;
  price: number;
}

// Cette fonction s'exécute à chaque requête
export default async function ProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Données fraîches à chaque requête
  const product = await fetch(`${process.env.API_URL}/products/${params.id}`)
    .then(res => res.json());
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Prix: {product.price}€</p>
      <p>Dernière mise à jour: {new Date().toLocaleString()}</p>
    </div>
  );
}
```

### Static Site Generation (SSG)

```tsx
// app/blog/[slug]/page.tsx

// Génère les pages statiques au build
export async function generateStaticParams() {
  const posts = await fetch(`${process.env.API_URL}/posts`)
    .then(res => res.json());
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

// Page statique générée au build
export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await fetch(`${process.env.API_URL}/posts/${params.slug}`)
    .then(res => res.json());
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// Métadonnées pour le SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await fetch(`${process.env.API_URL}/posts/${params.slug}`)
    .then(res => res.json());
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}
```

### Incremental Static Regeneration (ISR)

```tsx
// app/news/page.tsx
export const revalidate = 3600; // Revalide toutes les heures

export default async function NewsPage() {
  const news = await fetch(`${process.env.API_URL}/news`, {
    next: { revalidate: 3600 } // Cache pendant 1 heure
  }).then(res => res.json());
  
  return (
    <div>
      <h1>Actualités</h1>
      {news.map((article: any) => (
        <article key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
        </article>
      ))}
    </div>
  );
}
```

### Optimisation des images

```tsx
import Image from 'next/image';

export default function Gallery() {
  return (
    <div>
      {/* Image optimisée automatiquement */}
      <Image
        src="/hero-image.jpg"
        alt="Image héro"
        width={800}
        height={400}
        priority // Charge en priorité
        placeholder="blur" // Placeholder flou
        blurDataURL="data:image/jpeg;base64,..." // Image de base64 floue
      />
      
      {/* Image responsive */}
      <Image
        src="/gallery-image.jpg"
        alt="Image galerie"
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
```

---

## 8. Bonnes pratiques

### Structure de projet recommandée

```
src/
├── app/                    # App Router
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── forms/            # Composants de formulaires
│   ├── layout/           # Composants de mise en page
│   └── features/         # Composants spécifiques aux fonctionnalités
├── lib/                  # Utilitaires et configurations
│   ├── auth.ts          # Configuration authentification
│   ├── db.ts            # Configuration base de données
│   ├── utils.ts         # Fonctions utilitaires
│   └── validations.ts   # Schémas de validation
├── hooks/               # Hooks personnalisés
├── types/               # Définitions TypeScript
├── styles/              # Styles globaux
└── constants/           # Constantes de l'application
```

### Optimisation des performances

#### Bundle analysis

```bash
# Installation
npm install @next/bundle-analyzer

# Configuration next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Configuration Next.js
});

# Analyse
ANALYZE=true npm run build
```

#### Code splitting automatique

```tsx
// Chargement conditionnel
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('./AdminPanel'), {
  ssr: false,
});

export default function Dashboard({ user }: { user: User }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {user.isAdmin && <AdminPanel />}
    </div>
  );
}
```

### Gestion des erreurs

#### Error boundaries

```tsx
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Une erreur est survenue</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Réessayer</button>
    </div>
  );
}

// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Erreur globale</h2>
        <button onClick={reset}>Réessayer</button>
      </body>
    </html>
  );
}
```

#### Logging des erreurs

```typescript
// lib/logger.ts
export function logError(error: Error, context?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Service de logging (Sentry, LogRocket, etc.)
    console.error('Error:', error, 'Context:', context);
  } else {
    console.error(error);
  }
}

// Utilisation dans les API routes
export async function POST(request: NextRequest) {
  try {
    // Logique métier
  } catch (error) {
    logError(error as Error, { url: request.url });
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
```

---

## 9. Ressources utiles

### Documentation officielle

- **Site officiel** : [nextjs.org](https://nextjs.org)
- **Documentation** : [nextjs.org/docs](https://nextjs.org/docs)
- **Exemples** : [github.com/vercel/next.js/tree/canary/examples](https://github.com/vercel/next.js/tree/canary/examples)
- **Blog officiel** : [nextjs.org/blog](https://nextjs.org/blog)

### Outils complémentaires

#### Développement
- **TypeScript** : Support natif complet
- **ESLint** : Configuration Next.js intégrée
- **Prettier** : Formatage de code
- **Husky** : Git hooks pour la qualité

#### UI et Styling
- **Tailwind CSS** : Framework CSS utilitaire
- **Styled Components** : CSS-in-JS
- **Emotion** : Bibliothèque CSS-in-JS
- **Chakra UI** : Composants React

#### État et données
- **SWR** : Fetching de données (par Vercel)
- **React Query** : Gestion d'état serveur
- **Zustand** : Gestion d'état client léger
- **Redux Toolkit** : Gestion d'état complexe

#### Base de données et ORM
- **Prisma** : ORM moderne TypeScript
- **Drizzle** : ORM léger et performant
- **Supabase** : Backend-as-a-Service
- **PlanetScale** : Base de données MySQL serverless

#### Authentification
- **NextAuth.js** : Authentification complète
- **Clerk** : Authentification moderne
- **Auth0** : Service d'authentification
- **Supabase Auth** : Authentification intégrée

#### Déploiement
- **Vercel** : Plateforme native Next.js
- **Netlify** : Déploiement JAMstack
- **Railway** : Déploiement fullstack
- **Docker** : Containerisation

### Communauté et support

#### Communautés
- **Discord officiel** : [discord.gg/nextjs](https://discord.gg/nextjs)
- **Reddit** : [r/nextjs](https://reddit.com/r/nextjs)
- **Stack Overflow** : Tag `next.js`
- **GitHub Discussions** : [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

#### Ressources d'apprentissage
- **Next.js Learn** : [nextjs.org/learn](https://nextjs.org/learn)
- **Vercel Guides** : [vercel.com/guides](https://vercel.com/guides)
- **YouTube** : Chaînes Vercel et Lee Robinson
- **Courses** : Pluralsight, Udemy, Frontend Masters

#### Newsletters et blogs
- **Vercel Newsletter** : Actualités officielles
- **Next.js Weekly** : Résumé hebdomadaire
- **Blog de Lee Robinson** : Créateur de Next.js
- **Dev.to** : Articles communautaires

---

## Conclusion

Next.js est un framework puissant qui simplifie considérablement le développement d'applications React modernes. Avec ses fonctionnalités intégrées comme le routage automatique, l'optimisation des performances, et le support du rendu hybride, il permet de créer des applications web performantes et SEO-friendly.

L'écosystème riche et la communauté active font de Next.js un choix excellent pour des projets de toutes tailles, des sites statiques simples aux applications web complexes.

**Points clés à retenir :**
- Utilisez l'App Router pour les nouveaux projets
- Exploitez les React Server Components pour les performances
- Implémentez une stratégie de rendu adaptée (SSR/SSG/ISR)
- Suivez les bonnes pratiques de sécurité et d'optimisation
- Restez à jour avec la documentation officielle

Ce guide vous donne les bases solides pour maîtriser Next.js et développer des applications web modernes et performantes.