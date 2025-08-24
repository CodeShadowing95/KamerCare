# 🏥 KamerCare Backend - API Laravel

<div align="center">
  <img src="../frontend_nextjs/public/KamerCare-logo.png" alt="KamerCare Logo" width="200" height="auto">
  
  <p><strong>Backend API pour la plateforme médicale camerounaise</strong></p>
  
  [![Laravel](https://img.shields.io/badge/Laravel-8.x-red?style=for-the-badge&logo=laravel)](https://laravel.com/)
  [![PHP](https://img.shields.io/badge/PHP-8.0+-purple?style=for-the-badge&logo=php)](https://www.php.net/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
  [![Swagger](https://img.shields.io/badge/Swagger-API_Docs-green?style=for-the-badge&logo=swagger)](http://localhost:8000/api/documentation)
</div>

---

## 📋 Table des Matières

- [🎯 À Propos](#-à-propos)
- [🛠️ Technologies](#️-technologies)
- [📦 Prérequis](#-prérequis)
- [🚀 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [🗄️ Base de Données](#️-base-de-données)
- [▶️ Démarrage](#️-démarrage)
- [📚 Documentation API](#-documentation-api)
- [🧪 Tests](#-tests)
- [🔐 Sécurité](#-sécurité)

---

## 🎯 À Propos

Ce backend Laravel fournit une API REST complète pour la plateforme médicale **KamerCare**. Il gère l'authentification, les profils utilisateurs, les rendez-vous médicaux, et toutes les fonctionnalités nécessaires au bon fonctionnement de la plateforme.

### ✨ Fonctionnalités Principales

- 🔐 **Authentification sécurisée** avec Laravel Sanctum
- 👥 **Gestion des utilisateurs** (patients, médecins, administrateurs)
- 📅 **Système de rendez-vous** complet
- 🏥 **Gestion des établissements** de santé
- 📋 **Dossiers médicaux** électroniques
- 🌍 **Support multilingue** (FR/EN)
- 📊 **API RESTful** avec documentation Swagger
- 🔒 **Sécurité avancée** et validation des données

---

## 🛠️ Technologies

| Technologie | Version | Description |
|-------------|---------|-------------|
| **Laravel** | 8.x | Framework PHP moderne |
| **PHP** | 8.0+ | Langage de programmation |
| **MySQL** | 8.0+ | Base de données relationnelle |
| **Laravel Sanctum** | 2.x | Authentification API |
| **L5-Swagger** | 8.x | Documentation API automatique |
| **CORS** | 2.x | Support Cross-Origin |
| **PHPUnit** | 9.x | Framework de tests |

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- ✅ **PHP 8.0+** avec les extensions :
  - `php-mysql`
  - `php-mbstring`
  - `php-xml`
  - `php-curl`
  - `php-zip`
  - `php-gd`
- ✅ **Composer** (gestionnaire de dépendances PHP)
- ✅ **MySQL 8.0+** ou **MariaDB 10.3+**
- ✅ **Git** pour le contrôle de version

### 🔍 Vérification des Prérequis

```bash
# Vérifier la version PHP
php --version

# Vérifier Composer
composer --version

# Vérifier MySQL
mysql --version
```

---

## 🚀 Installation

### 1️⃣ Cloner le Projet

```bash
# Cloner le repository principal
git clone https://github.com/votre-username/cameroon-medical-platform.git
cd cameroon-medical-platform/backend_laravel
```

### 2️⃣ Installer les Dépendances

```bash
# Installer les dépendances PHP
composer install

# Pour l'environnement de production
composer install --optimize-autoloader --no-dev
```

### 3️⃣ Configuration de l'Environnement

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

---

## 🔧 Configuration

### 📝 Variables d'Environnement

Éditez le fichier `.env` avec vos paramètres :

```env
# Application
APP_NAME=KamerCare
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kamercare_db
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe

# CORS pour le frontend
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost

# Configuration email (optionnel)
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@kamercare.cm
MAIL_FROM_NAME="${APP_NAME}"
```

### 🔐 Configuration Sanctum

Pour l'authentification API, ajoutez dans `.env` :

```env
# Domaines autorisés pour les cookies
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000,votre-domaine.com

# Configuration session
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false
```

---

## 🗄️ Base de Données

### 1️⃣ Créer la Base de Données

```sql
-- Se connecter à MySQL
mysql -u root -p

-- Créer la base de données
CREATE DATABASE kamercare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer un utilisateur (optionnel)
CREATE USER 'kamercare_user'@'localhost' IDENTIFIED BY 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON kamercare_db.* TO 'kamercare_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2️⃣ Exécuter les Migrations

```bash
# Exécuter les migrations
php artisan migrate

# Avec confirmation automatique
php artisan migrate --force
```

### 3️⃣ Peupler la Base (Optionnel)

```bash
# Exécuter les seeders pour les données de test
php artisan db:seed

# Ou seeder spécifique
php artisan db:seed --class=UserSeeder
```

### 🔄 Réinitialiser la Base

```bash
# Réinitialiser et re-migrer
php artisan migrate:fresh

# Avec seeders
php artisan migrate:fresh --seed
```

---

## ▶️ Démarrage

### 🚀 Lancement du Serveur de Développement

```bash
# Démarrer le serveur Laravel
php artisan serve

# Avec un port spécifique
php artisan serve --port=8000

# Accessible depuis d'autres machines
php artisan serve --host=0.0.0.0 --port=8000
```

**🌐 Serveur accessible sur :** http://localhost:8000

### 🔧 Commandes Utiles

```bash
# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimiser pour la production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Générer la documentation API
php artisan l5-swagger:generate
```

### 📊 Vérification du Statut

```bash
# Vérifier la configuration
php artisan about

# Tester la connexion à la base
php artisan tinker
>>> DB::connection()->getPdo();
```

---

## 📚 Documentation API

### 🔗 Accès à la Documentation

- **Swagger UI :** http://localhost:8000/api/documentation
- **JSON Schema :** http://localhost:8000/api/docs.json

### 📋 Endpoints Principaux

#### 🔐 Authentification
```http
POST   /api/register          # Inscription
POST   /api/login             # Connexion
POST   /api/logout            # Déconnexion
GET    /api/me                # Profil utilisateur
```

#### 👥 Gestion des Patients
```http
GET    /api/patients          # Liste des patients
POST   /api/patients          # Créer un patient
GET    /api/patients/{id}     # Détails patient
PUT    /api/patients/{id}     # Modifier patient
DELETE /api/patients/{id}     # Supprimer patient
```

#### 👨‍⚕️ Gestion des Médecins
```http
GET    /api/doctors           # Liste des médecins
POST   /api/doctors           # Créer un médecin
GET    /api/doctors/{id}      # Détails médecin
PUT    /api/doctors/{id}      # Modifier médecin
PATCH  /api/doctors/{id}/toggle-availability # Disponibilité
```

---

## 🧪 Tests

### ▶️ Exécution des Tests

```bash
# Tous les tests
php artisan test

# Tests avec couverture
php artisan test --coverage

# Tests spécifiques
php artisan test --filter=AuthTest
php artisan test tests/Feature/AuthTest.php
```

### 🗄️ Base de Données de Test

```bash
# Configurer la base de test
cp .env .env.testing

# Modifier .env.testing
DB_DATABASE=kamercare_test
APP_ENV=testing
```

---

## 🔐 Sécurité

### 🛡️ Bonnes Pratiques Implémentées

- ✅ **Validation stricte** des données d'entrée
- ✅ **Protection CSRF** activée
- ✅ **Authentification JWT** avec Sanctum
- ✅ **Chiffrement des mots de passe** avec bcrypt
- ✅ **Protection contre l'injection SQL** avec Eloquent
- ✅ **Headers de sécurité** configurés
- ✅ **Rate limiting** sur les API

### 🔒 Configuration de Production

```env
# Production
APP_ENV=production
APP_DEBUG=false
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=strict
```

---

<div align="center">
  <p><strong>🚀 Backend prêt pour KamerCare !</strong></p>
  
  <p>
    <a href="http://localhost:8000/api/documentation">📚 Documentation API</a> •
    <a href="#">🐛 Signaler un Bug</a> •
    <a href="#">💬 Support</a>
  </p>
  
  <p><em>Développé avec ❤️ pour améliorer l'accès aux soins au Cameroun</em></p>
</div>
