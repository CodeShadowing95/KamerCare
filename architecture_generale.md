# Architecture Générale - KamerCare

## Table des Matières
1. [Architecture Physique](#1-architecture-physique)
2. [Architecture Logique](#2-architecture-logique)
3. [Technologies Utilisées](#3-technologies-utilisées)

---

## 1. Architecture Physique

### 1.1 Vue d'ensemble de l'infrastructure

L'architecture physique de KamerCare est conçue pour être simple, évolutive et facile à maintenir. Elle suit un modèle client-serveur classique avec séparation claire entre le frontend et le backend.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Utilisateurs  │    │   Utilisateurs  │    │   Utilisateurs  │
│   (Patients)    │    │   (Docteurs)    │    │ (Administrateurs│
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      INTERNET           │
                    │   (Protocole HTTPS)     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   SERVEUR WEB           │
                    │   (Hébergement Cloud)   │
                    │                         │
                    │  ┌─────────────────┐    │
                    │  │  Frontend       │    │
                    │  │  (Next.js)      │    │
                    │  │  Port: 3000     │    │
                    │  └─────────────────┘    │
                    │                         │
                    │  ┌─────────────────┐    │
                    │  │  Backend API    │    │
                    │  │  (Laravel)      │    │
                    │  │  Port: 8000     │    │
                    │  └─────────────────┘    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   BASE DE DONNÉES       │
                    │   (MySQL/PostgreSQL)    │
                    │   Port: 3306/5432       │
                    └─────────────────────────┘
```

### 1.2 Composants matériels

#### Serveur Web Principal
- **Rôle** : Héberge l'application frontend et backend
- **Spécifications recommandées** :
  - CPU : 2-4 cœurs
  - RAM : 4-8 GB
  - Stockage : 50-100 GB SSD
  - Bande passante : 100 Mbps

#### Serveur de Base de Données
- **Rôle** : Stocke toutes les données de l'application
- **Spécifications recommandées** :
  - CPU : 2-4 cœurs
  - RAM : 8-16 GB
  - Stockage : 100-500 GB SSD
  - Sauvegarde automatique quotidienne

#### Réseau et Sécurité
- **Protocole** : HTTPS (SSL/TLS)
- **Firewall** : Protection contre les attaques
- **CDN** : Distribution de contenu (optionnel)
- **Monitoring** : Surveillance des performances

### 1.3 Flux physique des données

```
Utilisateur → Navigateur → Internet → Serveur Web → Base de Données
    ↑                                                        ↓
    └────────── Réponse ←─────────────────────────────────────┘
```

1. **Requête utilisateur** : L'utilisateur interagit avec l'interface
2. **Transmission réseau** : Les données transitent via HTTPS
3. **Traitement serveur** : Le serveur traite la demande
4. **Accès base de données** : Lecture/écriture des données
5. **Réponse** : Retour des informations à l'utilisateur

---

## 2. Architecture Logique

### 2.1 Vue d'ensemble des composants logiciels

L'architecture logique suit le pattern **MVC (Model-View-Controller)** avec une séparation claire entre le frontend et le backend via une API REST.

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Pages     │  │ Components  │  │      Hooks          │ │
│  │             │  │             │  │                     │ │
│  │ • Login     │  │ • DoctorCard│  │ • useAuth           │ │
│  │ • Dashboard │  │ • MapComp   │  │ • useDoctors        │ │
│  │ • Search    │  │ • UI Comp   │  │ • useAppointments   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │ API Calls (HTTP/JSON)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Laravel)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Controllers │  │   Models    │  │    Middleware       │ │
│  │             │  │             │  │                     │ │
│  │ • AuthCtrl  │  │ • User      │  │ • Authentication    │ │
│  │ • DoctorCtrl│  │ • Doctor    │  │ • CORS              │ │
│  │ • ApptCtrl  │  │ • Appt      │  │ • Rate Limiting     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │ Database Queries (SQL)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   BASE DE DONNÉES                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Tables    │  │   Relations │  │      Indexes        │ │
│  │             │  │             │  │                     │ │
│  │ • users     │  │ • 1:N       │  │ • Primary Keys      │ │
│  │ • doctors   │  │ • N:M       │  │ • Foreign Keys      │ │
│  │ • appts     │  │ • 1:1       │  │ • Search Indexes    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Relations entre modules

#### Frontend (Next.js)
```
Pages ←→ Components ←→ Hooks ←→ API Client
  ↓         ↓          ↓         ↓
State   UI Logic   Business   HTTP Requests
```

#### Backend (Laravel)
```
Routes → Controllers → Services → Models → Database
  ↓         ↓          ↓         ↓         ↓
URLs   HTTP Logic   Business   Data     Storage
```

### 2.3 Flux logique des données

#### Exemple : Recherche de docteurs

```
1. [Frontend] Utilisateur saisit critères de recherche
                    ↓
2. [Frontend] Hook useDoctors() déclenché
                    ↓
3. [API] GET /api/doctors?specialization=cardio&city=douala
                    ↓
4. [Backend] Route → DoctorController@index
                    ↓
5. [Backend] Validation des paramètres
                    ↓
6. [Backend] Doctor::bySpecialization()->byCity()->get()
                    ↓
7. [Database] SELECT * FROM doctors WHERE...
                    ↓
8. [Backend] Formatage JSON des résultats
                    ↓
9. [Frontend] Mise à jour de l'état et affichage
```

---

## 3. Technologies Utilisées

### 3.1 Frontend - Next.js 14

#### **Qu'est-ce que c'est ?**
Next.js est un framework React qui permet de créer des applications web modernes et rapides.

#### **Version utilisée :** 14.x
#### **Pourquoi ce choix ?**
- **Simplicité** : Plus facile à apprendre que React pur
- **Performance** : Chargement rapide des pages
- **SEO** : Bon référencement Google
- **TypeScript** : Support natif sans configuration

#### **Utilisation dans KamerCare :**
```
frontend_nextjs/
├── app/                    # Pages de l'application
│   ├── login/             # Page de connexion
│   ├── dashboard/         # Tableau de bord
│   └── search-doctors/    # Recherche de docteurs
├── components/            # Composants réutilisables
│   ├── DoctorCard.tsx    # Carte d'affichage docteur
│   └── ui/               # Composants d'interface
└── hooks/                # Logique métier réutilisable
    ├── use-auth.ts       # Gestion authentification
    └── use-doctors.ts    # Gestion des docteurs
```

#### **Cas d'utilisation spécifiques :**
- **Pages dynamiques** : `/doctor/[id]` pour profils docteurs
- **API Routes** : Gestion des uploads de fichiers
- **Middleware** : Protection des routes privées
- **Server Components** : Amélioration des performances

### 3.2 Backend - Laravel 10

#### **Qu'est-ce que c'est ?**
Laravel est un framework PHP qui simplifie la création d'APIs et d'applications web.

#### **Version utilisée :** 10.x
#### **Pourquoi ce choix ?**
- **Rapidité de développement** : Beaucoup de fonctionnalités prêtes
- **Sécurité** : Protection automatique contre les attaques
- **Documentation** : Très bien documenté en français
- **Communauté** : Large communauté d'aide

#### **Utilisation dans KamerCare :**
```
backend_laravel/
├── app/
│   ├── Http/Controllers/Api/    # Contrôleurs API
│   │   ├── AuthController.php   # Authentification
│   │   ├── DoctorController.php # Gestion docteurs
│   │   └── AppointmentController.php # Rendez-vous
│   ├── Models/                  # Modèles de données
│   │   ├── User.php            # Utilisateurs
│   │   ├── Doctor.php          # Docteurs
│   │   └── Appointment.php     # Rendez-vous
│   └── Http/Requests/          # Validation des données
├── database/migrations/        # Structure base de données
└── routes/api.php             # Définition des URLs API
```

#### **Cas d'utilisation spécifiques :**
- **API REST** : Endpoints pour toutes les fonctionnalités
- **Authentification** : Laravel Sanctum pour les tokens
- **Validation** : Règles automatiques de validation
- **Migrations** : Gestion de la structure de base de données

### 3.3 Base de Données - MySQL

#### **Qu'est-ce que c'est ?**
MySQL est un système de gestion de base de données relationnelle.

#### **Version utilisée :** 8.0+
#### **Pourquoi ce choix ?**
- **Fiabilité** : Très stable et éprouvé
- **Performance** : Rapide pour les requêtes
- **Compatibilité** : Fonctionne partout
- **Gratuit** : Open source

#### **Structure dans KamerCare :**
```
Tables principales :
├── users                 # Utilisateurs (patients, docteurs, admins)
├── doctors              # Informations spécifiques docteurs
├── appointments         # Rendez-vous médicaux
├── appointment_requests # Demandes de rendez-vous
└── cities              # Villes du Cameroun
```

#### **Cas d'utilisation spécifiques :**
- **Relations** : Liens entre utilisateurs et rendez-vous
- **Recherche** : Index pour recherche rapide par spécialisation
- **Géolocalisation** : Stockage des coordonnées des docteurs

### 3.4 Authentification - Laravel Sanctum

#### **Qu'est-ce que c'est ?**
Sanctum est un système d'authentification simple pour les APIs Laravel.

#### **Pourquoi ce choix ?**
- **Simplicité** : Plus simple que JWT
- **Sécurité** : Tokens sécurisés
- **Intégration** : Natif avec Laravel

#### **Utilisation :**
- **Tokens API** : Authentification frontend ↔ backend
- **Protection routes** : Middleware automatique
- **Gestion sessions** : Connexion/déconnexion

### 3.5 Styling - Tailwind CSS

#### **Qu'est-ce que c'est ?**
Tailwind est un framework CSS qui utilise des classes utilitaires.

#### **Pourquoi ce choix ?**
- **Rapidité** : Développement très rapide
- **Consistance** : Design uniforme
- **Responsive** : Adaptation mobile automatique
- **Personnalisation** : Facile à customiser

#### **Utilisation dans KamerCare :**
```html
<!-- Exemple de carte docteur -->
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-xl font-semibold text-gray-800">Dr. Nom</h3>
  <p className="text-gray-600 mt-2">Spécialisation</p>
  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    Prendre RDV
  </button>
</div>
```

### 3.6 Gestion d'État - React Hooks

#### **Qu'est-ce que c'est ?**
Les hooks React permettent de gérer l'état et la logique des composants.

#### **Hooks personnalisés dans KamerCare :**
- **useAuth** : Gestion de l'authentification
- **useDoctors** : Gestion des données docteurs
- **useAppointments** : Gestion des rendez-vous
- **useCities** : Gestion des villes

#### **Exemple d'utilisation :**
```typescript
// Hook personnalisé pour l'authentification
const { user, login, logout, isLoading } = useAuth();

// Utilisation dans un composant
if (isLoading) return <div>Chargement...</div>;
if (!user) return <LoginForm onLogin={login} />;
return <Dashboard user={user} onLogout={logout} />;
```

### 3.7 Schéma d'implémentation global

```
┌─────────────────────────────────────────────────────────────┐
│                    STACK TECHNOLOGIQUE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (Port 3000)          Backend (Port 8000)         │
│  ┌─────────────────────┐      ┌─────────────────────┐      │
│  │     Next.js 14      │ ←──→ │    Laravel 10       │      │
│  │   + TypeScript      │ HTTP │   + PHP 8.1+        │      │
│  │   + Tailwind CSS    │ JSON │   + Sanctum Auth    │      │
│  │   + React Hooks     │      │   + API REST        │      │
│  └─────────────────────┘      └─────────┬───────────┘      │
│                                         │                  │
│                                         ▼                  │
│                               ┌─────────────────────┐      │
│                               │     MySQL 8.0       │      │
│                               │   + Migrations      │      │
│                               │   + Relations       │      │
│                               │   + Indexes         │      │
│                               └─────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Conclusion

Cette architecture a été conçue pour être :

- **Simple à comprendre** : Chaque composant a un rôle clair
- **Facile à maintenir** : Code organisé et bien structuré  
- **Évolutive** : Peut grandir avec les besoins
- **Sécurisée** : Bonnes pratiques de sécurité intégrées
- **Performante** : Technologies modernes et optimisées

L'ensemble forme un système cohérent où chaque technologie apporte sa valeur ajoutée pour créer une plateforme de santé moderne et efficace pour le Cameroun.