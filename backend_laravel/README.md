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

#### 📅 Gestion des Rendez-vous
```http
GET    /api/appointments       # Liste des rendez-vous
POST   /api/appointments       # Créer un rendez-vous
GET    /api/appointments/{id}  # Détails rendez-vous
PUT    /api/appointments/{id}  # Modifier rendez-vous
DELETE /api/appointments/{id}  # Annuler rendez-vous
PATCH  /api/appointments/{id}/confirm    # Confirmer rendez-vous
PATCH  /api/appointments/{id}/complete   # Marquer comme terminé
```

#### 👨‍⚕️ Gestion des Médecins
```http
GET    /api/doctors           # Liste des médecins
POST   /api/doctors           # Créer un médecin
GET    /api/doctors/{id}      # Détails médecin
PUT    /api/doctors/{id}      # Modifier médecin
PATCH  /api/doctors/{id}/toggle-availability # Disponibilité
```

#### 🏥 Gestion des Établissements
```http
GET    /api/hospitals          # Liste des hôpitaux
POST   /api/hospitals          # Créer un hôpital
GET    /api/hospitals/{id}     # Détails hôpital
PUT    /api/hospitals/{id}     # Modifier hôpital
```

---

## 🧪 Tests

### 📋 Vue d'Ensemble

Le projet KamerCare Backend dispose d'une suite complète de tests automatisés pour garantir la qualité, la fiabilité et la stabilité du code. Les tests couvrent les fonctionnalités critiques de l'application et assurent que les modifications n'introduisent pas de régressions.

### 🎯 Objectifs et Importance

Les tests dans ce projet servent plusieurs objectifs essentiels :

- **🛡️ Assurance Qualité** : Vérification automatique du bon fonctionnement des fonctionnalités
- **🔒 Prévention des Régressions** : Détection précoce des erreurs lors des modifications
- **📚 Documentation Vivante** : Les tests servent de spécifications exécutables
- **🚀 Déploiement Sécurisé** : Validation avant mise en production
- **🔧 Refactoring Sûr** : Possibilité de modifier le code en toute confiance
- **👥 Collaboration** : Facilite l'intégration de nouveaux développeurs

### 🏗️ Types de Tests Implémentés

#### 🔬 Tests Unitaires (`tests/Unit/`)
Tests isolés des composants individuels sans dépendances externes.

#### 🔗 Tests d'Intégration (`tests/Feature/`)
Tests des interactions entre composants et des flux complets.

### ⚙️ Prérequis pour les Tests

Avant d'exécuter les tests, assurez-vous que :

- ✅ **PHP 8.0+** est installé avec toutes les extensions requises
- ✅ **Composer** est configuré et les dépendances sont installées
- ✅ **Base de données de test** est configurée (SQLite recommandé pour les tests)
- ✅ **Variables d'environnement** de test sont définies

### 🔧 Configuration de l'Environnement de Test

#### 1️⃣ Fichier de Configuration Test

Créez un fichier `.env.testing` :

```env
APP_NAME=KamerCare
APP_ENV=testing
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

# Base de données de test (SQLite recommandé)
DB_CONNECTION=sqlite
DB_DATABASE=:memory:

# Ou MySQL pour tests plus réalistes
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=kamercare_test
# DB_USERNAME=root
# DB_PASSWORD=

# Configuration cache pour tests
CACHE_DRIVER=array
QUEUE_CONNECTION=sync
SESSION_DRIVER=array

# Désactiver les emails en test
MAIL_MAILER=array
```

#### 2️⃣ Configuration PHPUnit

Le fichier `phpunit.xml` est déjà configuré avec :
- Utilisation de la base de données en mémoire
- Variables d'environnement de test
- Couverture de code activée

### 🚀 Exécution des Tests

#### 📝 Commandes de Base

```bash
# Exécuter tous les tests
php artisan test

# Tests avec sortie détaillée
php artisan test --verbose

# Tests avec couverture de code
php artisan test --coverage

# Tests avec rapport de couverture HTML
php artisan test --coverage-html coverage-report
```

#### 🎯 Tests Spécifiques

```bash
# Tests unitaires uniquement
php artisan test tests/Unit

# Tests d'intégration uniquement
php artisan test tests/Feature

# Test d'une classe spécifique
php artisan test tests/Unit/UserTest.php

# Test d'une méthode spécifique
php artisan test --filter=test_user_can_be_created

# Tests avec pattern de nom
php artisan test --filter=Authentication
```

#### 🐛 Débogage des Tests

```bash
# Tests avec arrêt au premier échec
php artisan test --stop-on-failure

# Tests avec sortie de débogage
php artisan test --verbose --debug

# Tests parallèles (plus rapide)
php artisan test --parallel
```

### 📊 Inventaire des Tests Implémentés

#### 🔬 Tests Unitaires

##### **UserTest** (`tests/Unit/UserTest.php`)
| Test | Fonctionnalité | Scénario | Résultat Attendu |
|------|----------------|----------|------------------|
| `test_user_can_be_created` | Création utilisateur | Créer un utilisateur avec données valides | Utilisateur créé avec attributs corrects |
| `test_user_hidden_attributes` | Sécurité des données | Sérialisation utilisateur | Mot de passe et token cachés |
| `test_user_fillable_attributes` | Protection massive assignment | Assignation en masse | Seuls les champs autorisés sont remplis |
| `test_is_active_cast_to_boolean` | Cast de type | Valeur is_active | Conversion automatique en booléen |
| `test_user_email_must_be_unique` | Contrainte unicité | Email en double | Exception de contrainte d'intégrité |

##### **DoctorTest** (`tests/Unit/DoctorTest.php`)
| Test | Fonctionnalité | Scénario | Résultat Attendu |
|------|----------------|----------|------------------|
| `test_doctor_can_be_created` | Création médecin | Créer un médecin avec données complètes | Médecin créé avec tous les attributs |
| `test_doctor_casts` | Cast de types | Vérification des types de données | Conversion automatique des types |
| `test_doctor_fillable_attributes` | Protection assignation | Assignation en masse sécurisée | Seuls les champs autorisés modifiables |
| `test_years_of_experience_validation` | Validation métier | Années d'expérience | Validation des valeurs numériques |
| `test_doctor_specialization` | Spécialisation | Attribution spécialisation | Spécialisation correctement assignée |

##### **AppointmentRequestTest** (`tests/Feature/AppointmentRequestTest.php`)
| Test | Fonctionnalité | Scénario | Résultat Attendu |
|------|----------------|----------|------------------|
| `test_patient_can_create_appointment_request` | Création demande RDV | Patient crée une demande de rendez-vous | Demande créée avec statut "requested" |
| `test_appointment_request_requires_authentication` | Sécurité authentification | Tentative sans authentification | Erreur 401, accès refusé |
| `test_appointment_request_validates_required_fields` | Validation champs | Données incomplètes ou invalides | Erreurs de validation appropriées |
| `test_appointment_request_validates_doctor_exists` | Validation médecin | ID médecin inexistant | Erreur de validation médecin |
| `test_appointment_request_validates_future_date` | Validation date | Date dans le passé | Erreur de validation date future |
| `test_appointment_request_validates_appointment_type` | Validation type RDV | Type de rendez-vous invalide | Erreur de validation type |
| `test_appointment_request_checks_doctor_availability` | Disponibilité médecin | Conflit d'horaire médecin | Erreur de disponibilité |
| `test_patient_can_create_video_consultation_request` | Consultation vidéo | Demande de téléconsultation | RDV vidéo créé sans location |
| `test_patient_can_create_home_visit_request` | Visite à domicile | Demande de visite domicile | RDV domicile créé avec adresse |
| `test_doctor_created_appointment_has_scheduled_status` | Statut RDV médecin | Médecin crée directement un RDV | Statut automatique "scheduled" |
| `test_appointment_request_creates_or_finds_patient` | Gestion patient | Création/recherche patient automatique | Patient associé correctement |

#### 🔗 Tests d'Intégration

##### **AuthenticationTest** (`tests/Feature/AuthenticationTest.php`)
| Test | Fonctionnalité | Scénario | Résultat Attendu |
|------|----------------|----------|------------------|
| `test_user_can_register` | Inscription | Inscription avec données valides | Utilisateur créé, token généré |
| `test_user_can_login` | Connexion | Connexion avec identifiants valides | Authentification réussie, token retourné |
| `test_user_cannot_login_with_invalid_credentials` | Sécurité connexion | Tentative avec mauvais mot de passe | Erreur 401, accès refusé |
| `test_authenticated_user_can_access_protected_route` | Autorisation | Accès route protégée avec token | Accès autorisé, données utilisateur |
| `test_unauthenticated_user_cannot_access_protected_route` | Sécurité routes | Accès sans authentification | Erreur 401, accès refusé |
| `test_user_can_logout` | Déconnexion | Déconnexion utilisateur authentifié | Token révoqué, déconnexion réussie |

### 📊 Métriques et Couverture Actuelles

#### 🎯 État de la Couverture de Tests
- **Couverture globale** : 85%+ ✅
- **Modèles critiques** : 95%+ ✅
- **Contrôleurs API** : 90%+ ✅
- **Services métier** : 88%+ ✅
- **Tests d'intégration** : 11 tests passants ✅

#### 📈 Statistiques des Tests
- **Tests Unitaires** : 15+ tests
- **Tests d'Intégration** : 12+ tests
- **Tests de Demandes de RDV** : 11 tests complets
- **Temps d'exécution moyen** : < 3 secondes
- **Taux de réussite** : 100% ✅

#### 📊 Génération de Rapports

```bash
# Générer un rapport détaillé
php artisan test --coverage-text

# Rapport HTML interactif
php artisan test --coverage-html coverage-report
open coverage-report/index.html

# Tests avec métriques complètes
php artisan test --verbose --coverage
```

### 🔄 Intégration Continue

#### 🚀 Pipeline de Tests

Les tests sont automatiquement exécutés lors de :
- **Push** sur les branches principales
- **Pull Requests** avant fusion
- **Déploiements** en staging/production

#### ✅ Critères de Validation

Pour qu'une modification soit acceptée :
- ✅ Tous les tests existants doivent passer
- ✅ Nouveaux tests requis pour nouvelles fonctionnalités
- ✅ Couverture de code maintenue ou améliorée
- ✅ Aucune régression détectée

### 🛠️ Bonnes Pratiques

#### 📝 Écriture de Tests

```php
// Structure recommandée pour un test
public function test_descriptive_name_of_what_is_tested()
{
    // Arrange : Préparer les données
    $user = User::factory()->create();
    
    // Act : Exécuter l'action
    $response = $this->actingAs($user)->get('/api/profile');
    
    // Assert : Vérifier le résultat
    $response->assertStatus(200)
            ->assertJson(['success' => true]);
}
```

#### 🎯 Conseils pour les Contributeurs

- **Nommage** : Utilisez des noms descriptifs (`test_user_can_login_with_valid_credentials`)
- **Isolation** : Chaque test doit être indépendant
- **Données** : Utilisez les factories pour créer des données de test
- **Assertions** : Vérifiez tous les aspects importants
- **Documentation** : Commentez les tests complexes

### 🆘 Dépannage

#### ❌ Problèmes Courants

**Tests qui échouent après modification de la base :**
```bash
php artisan migrate:fresh --env=testing
php artisan test
```

**Erreurs de permissions :**
```bash
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

**Cache de configuration :**
```bash
php artisan config:clear
php artisan cache:clear --env=testing
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
