# Guide Complet de Création du Backend Laravel - Plateforme Médicale Cameroun

## Table des Matières
1. [Installation de Laravel](#1-installation-de-laravel)
2. [Configuration de la Base de Données](#2-configuration-de-la-base-de-données)
3. [Création des Modèles](#3-création-des-modèles)
4. [Configuration de l'Authentification](#4-configuration-de-lauthentification)
5. [Création des Contrôleurs](#5-création-des-contrôleurs)
6. [Configuration des Routes](#6-configuration-des-routes)
7. [Validation et Sécurité](#7-validation-et-sécurité)
8. [Documentation avec Swagger](#8-documentation-avec-swagger)

---

## 1. Installation de Laravel

### Étapes réalisées :
```bash
composer create-project laravel/laravel backend
cd backend
```

#### Explication des commandes :
- **`composer create-project laravel/laravel backend`** :
  - `composer` : Gestionnaire de dépendances PHP
  - `create-project` : Commande pour créer un nouveau projet à partir d'un template
  - `laravel/laravel` : Package officiel Laravel sur Packagist
  - `backend` : Nom du dossier de destination
  - Cette commande télécharge Laravel et toutes ses dépendances, configure l'autoloader et génère la clé d'application

- **`cd backend`** :
  - Change le répertoire de travail vers le dossier `backend`
  - Nécessaire pour exécuter les commandes Artisan dans le bon contexte

### Pourquoi cette étape ?
- **Framework robuste** : Laravel offre une structure MVC claire et des outils intégrés pour le développement d'API
- **Écosystème riche** : Packages intégrés pour l'authentification, la validation, l'ORM Eloquent
- **Sécurité** : Protection CSRF, hachage des mots de passe, prévention des injections SQL par défaut
- **Productivité** : Artisan CLI pour générer rapidement du code, migrations automatisées
- **Communauté** : Large communauté, documentation extensive, support à long terme

---

## 2. Configuration de la Base de Données

### Étapes réalisées :

#### 2.1 Configuration de l'environnement (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cameroon_medical_platform
DB_USERNAME=root
DB_PASSWORD=
```

#### 2.2 Création des migrations
```bash
php artisan make:migration create_patients_table
php artisan make:migration create_doctors_table
php artisan make:migration create_appointments_table
php artisan make:migration create_medical_records_table
php artisan migrate
```

#### Explication des commandes :
- **`php artisan make:migration create_patients_table`** :
  - `php artisan` : Interface en ligne de commande de Laravel
  - `make:migration` : Générateur de fichier de migration
  - `create_patients_table` : Nom descriptif de la migration
  - Crée un fichier timestampé dans `database/migrations/` avec une structure de base

- **`php artisan migrate`** :
  - Exécute toutes les migrations en attente
  - Lit les fichiers de migration dans l'ordre chronologique
  - Crée les tables dans la base de données selon les schémas définis
  - Met à jour la table `migrations` pour tracer l'historique

#### 2.3 Structure des tables créées :

**Table Users :**
- id, name, email, password, role, phone, email_verified_at, is_active
- Gestion centralisée des utilisateurs (patients et docteurs)

**Table Patients :**
- id, user_id, date_of_birth, gender, address, emergency_contact
- Informations spécifiques aux patients

**Table Doctors :**
- id, user_id, specialization, license_number, years_of_experience, bio
- Informations professionnelles des médecins

**Table Appointments :**
- id, patient_id, doctor_id, appointment_date, status, notes
- Gestion des rendez-vous médicaux

**Table Medical Records :**
- id, patient_id, doctor_id, appointment_id, diagnosis, treatment, prescription, attachments
- Dossiers médicaux complets

### Pourquoi cette étape ?
- **Persistance des données** : Stockage sécurisé et structuré des informations médicales
- **Intégrité référentielle** : Relations entre tables garantissent la cohérence des données
- **Évolutivité** : Migrations permettent de faire évoluer la structure sans perte de données
- **Performance** : Index sur les clés étrangères pour optimiser les requêtes
- **Conformité** : Structure adaptée aux exigences médicales (traçabilité, historique)

---

## 3. Création des Modèles

### Étapes réalisées :

#### 3.1 Modèles créés :
```bash
php artisan make:model Patient -m
php artisan make:model Doctor -m
php artisan make:model Appointment -m
php artisan make:model MedicalRecord -m
```

#### Explication des commandes :
- **`php artisan make:model Patient -m`** :
  - `make:model` : Générateur de modèle Eloquent
  - `Patient` : Nom du modèle (convention PascalCase)
  - `-m` : Flag pour créer automatiquement la migration associée
  - Crée `app/Models/Patient.php` et `database/migrations/xxxx_create_patients_table.php`
  - Le modèle hérite d'Eloquent avec toutes ses fonctionnalités ORM

#### Modèles générés :
- `User.php` - Utilisateur de base avec authentification (déjà présent)
- `Patient.php` - Informations patient
- `Doctor.php` - Informations médecin
- `Appointment.php` - Rendez-vous
- `MedicalRecord.php` - Dossiers médicaux

#### 3.2 Relations définies :
```php
// User -> Patient (1:1)
public function patient() {
    return $this->hasOne(Patient::class);
}

// User -> Doctor (1:1)
public function doctor() {
    return $this->hasOne(Doctor::class);
}

// Patient -> Appointments (1:N)
public function appointments() {
    return $this->hasMany(Appointment::class);
}

// Doctor -> Appointments (1:N)
public function appointments() {
    return $this->hasMany(Appointment::class);
}

// Appointment -> MedicalRecord (1:1)
public function medicalRecord() {
    return $this->hasOne(MedicalRecord::class);
}
```

### Pourquoi cette étape ?
- **ORM Eloquent** : Abstraction de la base de données, requêtes expressives et sécurisées
- **Relations automatiques** : Chargement automatique des données liées (eager loading)
- **Validation au niveau modèle** : Règles de validation centralisées
- **Mutateurs/Accesseurs** : Transformation automatique des données (ex: hachage des mots de passe)
- **Événements de modèle** : Hooks pour actions automatiques (logs, notifications)

---

## 4. Configuration de l'Authentification

### Étapes réalisées :

#### 4.1 Installation de Laravel Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

#### Explication des commandes :
- **`composer require laravel/sanctum`** :
  - `composer require` : Installe une nouvelle dépendance
  - `laravel/sanctum` : Package officiel d'authentification API de Laravel
  - Télécharge le package et met à jour `composer.json` et `composer.lock`
  - Enregistre automatiquement le service provider

- **`php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`** :
  - `vendor:publish` : Publie les assets d'un package vers l'application
  - `--provider` : Spécifie le service provider source
  - Copie les fichiers de configuration et migrations de Sanctum vers votre projet
  - Permet la personnalisation des paramètres Sanctum

- **`php artisan migrate`** :
  - Exécute les nouvelles migrations de Sanctum
  - Crée la table `personal_access_tokens` pour stocker les tokens API

#### 4.2 Configuration dans `config/sanctum.php`
- Durée de vie des tokens
- Domaines autorisés pour SPA
- Middleware de protection

#### 4.3 AuthController créé avec :
- `register()` - Inscription utilisateur
- `login()` - Connexion et génération de token
- `logout()` - Révocation du token
- `profile()` - Informations utilisateur authentifié

### Pourquoi cette étape ?
- **Sécurité API** : Tokens sécurisés pour l'authentification stateless
- **Flexibilité** : Support SPA et applications mobiles
- **Gestion des rôles** : Différenciation patients/docteurs
- **Révocation** : Possibilité de révoquer l'accès instantanément
- **Performance** : Pas de sessions serveur, scalabilité améliorée

---

## 5. Création des Contrôleurs

### Étapes réalisées :

#### 5.1 Contrôleurs API créés :
```bash
php artisan make:controller Api/AuthController
php artisan make:controller Api/PatientController --api
php artisan make:controller Api/DoctorController --api
php artisan make:controller Api/AppointmentController --api
php artisan make:controller Api/MedicalRecordController --api
```

#### Explication des commandes :
- **`php artisan make:controller Api/AuthController`** :
  - `make:controller` : Générateur de contrôleur
  - `Api/AuthController` : Crée le contrôleur dans le namespace `App\Http\Controllers\Api`
  - Génère un contrôleur vide avec la structure de base

- **`php artisan make:controller Api/PatientController --api`** :
  - `--api` : Flag pour générer un contrôleur de ressource API
  - Crée automatiquement les méthodes : `index()`, `store()`, `show()`, `update()`, `destroy()`
  - Exclut les méthodes `create()` et `edit()` (inutiles pour une API)
  - Structure optimisée pour les endpoints RESTful

#### Contrôleurs générés :
- `AuthController.php` - Authentification
- `PatientController.php` - Gestion des patients
- `DoctorController.php` - Gestion des médecins
- `AppointmentController.php` - Gestion des rendez-vous
- `MedicalRecordController.php` - Gestion des dossiers médicaux

#### 5.2 Méthodes implémentées :
```php
// CRUD complet pour chaque ressource
index()    // Liste paginée
store()    // Création
show()     // Affichage détaillé
update()   // Modification
destroy()  // Suppression

// Méthodes spécifiques
specializations() // Liste des spécialisations (public)
upcoming()        // Rendez-vous à venir
history()         // Historique patient
```

### Pourquoi cette étape ?
- **Séparation des responsabilités** : Logique métier isolée dans les contrôleurs
- **API RESTful** : Conventions standard pour les endpoints
- **Réutilisabilité** : Code modulaire et maintenable
- **Testabilité** : Chaque contrôleur peut être testé indépendamment
- **Évolutivité** : Ajout facile de nouvelles fonctionnalités

---

## 6. Configuration des Routes

### Étapes réalisées :

#### 6.1 Structure des routes dans `routes/api.php` :
```php
// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/specializations', [DoctorController::class, 'specializations']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    
    // Ressources CRUD
    Route::apiResource('patients', PatientController::class);
    Route::apiResource('doctors', DoctorController::class);
    Route::apiResource('appointments', AppointmentController::class);
    Route::apiResource('medical-records', MedicalRecordController::class);
});
```

#### 6.2 Middleware configuré :
- `auth:sanctum` - Vérification du token
- `throttle:api` - Limitation du taux de requêtes
- CORS configuré pour le frontend Next.js

### Pourquoi cette étape ?
- **Sécurité** : Protection des endpoints sensibles
- **Organisation** : Structure claire et prévisible
- **Performance** : Middleware de cache et limitation
- **Documentation** : Routes explicites pour l'API
- **Maintenance** : Centralisation de la configuration des routes

---

## 7. Validation et Sécurité

### Étapes réalisées :

#### 7.1 Form Requests créées :
```bash
php artisan make:request StorePatientRequest
php artisan make:request UpdatePatientRequest
php artisan make:request StoreAppointmentRequest
php artisan make:request StoreMedicalRecordRequest
```

#### Explication des commandes :
- **`php artisan make:request StorePatientRequest`** :
  - `make:request` : Générateur de classe de requête de validation
  - `StorePatientRequest` : Nom de la classe (convention : Action + Resource + Request)
  - Crée `app/Http/Requests/StorePatientRequest.php`
  - Génère une classe avec les méthodes `authorize()` et `rules()`
  - Permet de centraliser la validation et l'autorisation

#### Form Requests générées :
- `StorePatientRequest.php` - Validation création patient
- `UpdatePatientRequest.php` - Validation modification patient
- `StoreAppointmentRequest.php` - Validation création rendez-vous
- `StoreMedicalRecordRequest.php` - Validation création dossier médical

#### 7.2 Règles de validation implémentées :
```php
// Exemple pour Patient
public function rules() {
    return [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required|string|max:20',
        'date_of_birth' => 'required|date|before:today',
        'gender' => 'required|in:male,female,other',
    ];
}
```

#### 7.3 Policies créées :
```bash
php artisan make:policy PatientPolicy --model=Patient
php artisan make:policy DoctorPolicy --model=Doctor
php artisan make:policy AppointmentPolicy --model=Appointment
php artisan make:policy MedicalRecordPolicy --model=MedicalRecord
```

#### Explication des commandes :
- **`php artisan make:policy PatientPolicy --model=Patient`** :
  - `make:policy` : Générateur de classe de politique d'autorisation
  - `PatientPolicy` : Nom de la politique
  - `--model=Patient` : Associe la politique au modèle Patient
  - Crée `app/Policies/PatientPolicy.php`
  - Génère automatiquement les méthodes : `viewAny()`, `view()`, `create()`, `update()`, `delete()`
  - Permet de définir qui peut effectuer quelles actions sur les ressources

#### Fonctionnalités des Policies :
- Vérification des autorisations par rôle
- Accès restreint aux données personnelles
- Validation des relations (patient-docteur)

### Pourquoi cette étape ?
- **Intégrité des données** : Validation côté serveur obligatoire
- **Sécurité** : Prévention des injections et données malveillantes
- **Expérience utilisateur** : Messages d'erreur clairs et précis
- **Conformité** : Respect des standards médicaux (RGPD, HIPAA)
- **Maintenance** : Règles centralisées et réutilisables

---

## 8. Documentation avec Swagger

### Étapes réalisées :

#### 8.1 Installation de L5-Swagger
```bash
composer require darkaonline/l5-swagger
php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"
```

#### Explication des commandes :
- **`composer require darkaonline/l5-swagger`** :
  - Installe le package L5-Swagger pour Laravel
  - `darkaonline/l5-swagger` : Package tiers pour intégrer Swagger/OpenAPI
  - Ajoute les dépendances Swagger UI et les outils de génération de documentation
  - Compatible avec les annotations PHP pour documenter l'API

- **`php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"`** :
  - Publie les fichiers de configuration L5-Swagger
  - Copie `config/l5-swagger.php` pour personnaliser les paramètres
  - Publie les vues Swagger UI dans `resources/views/vendor/l5-swagger/`
  - Permet la customisation de l'interface et des chemins

#### 8.2 Configuration dans `config/l5-swagger.php` :
- Titre de l'API : "Cameroon Medical Platform API"
- URL de base : `http://localhost:8000`
- Schéma de sécurité : Laravel Sanctum

#### 8.3 Annotations Swagger ajoutées :

**SwaggerController.php** - Configuration globale :
```php
/**
 * @OA\Info(
 *     title="Cameroon Medical Platform API",
 *     version="1.0.0",
 *     description="API pour la gestion de la plateforme médicale du Cameroun"
 * )
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Serveur de développement"
 * )
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer"
 * )
 */
```

**AuthController.php** - Endpoints d'authentification :
```php
/**
 * @OA\Post(
 *     path="/api/register",
 *     tags={"Authentication"},
 *     summary="Inscription d'un nouvel utilisateur",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name","email","password","role"},
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="email", type="string", format="email"),
 *             @OA\Property(property="password", type="string", minLength=8),
 *             @OA\Property(property="role", type="string", enum={"patient","doctor"})
 *         )
 *     ),
 *     @OA\Response(response=201, description="Utilisateur créé avec succès")
 * )
 */
```

**DoctorController.php** - Endpoints publics :
```php
/**
 * @OA\Get(
 *     path="/api/public/specializations",
 *     tags={"Public"},
 *     summary="Liste des spécialisations médicales disponibles",
 *     @OA\Response(
 *         response=200,
 *         description="Liste des spécialisations",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(type="string")
 *         )
 *     )
 * )
 */
```

#### 8.4 Génération de la documentation :
```bash
php artisan l5-swagger:generate
```

#### Explication de la commande :
- **`php artisan l5-swagger:generate`** :
  - `l5-swagger:generate` : Commande spécifique au package L5-Swagger
  - Scanne tous les fichiers PHP à la recherche d'annotations Swagger/OpenAPI
  - Parse les annotations `@OA\*` dans les contrôleurs et modèles
  - Génère le fichier JSON/YAML de spécification OpenAPI
  - Sauvegarde la documentation dans `storage/api-docs/`
  - Met à jour automatiquement l'interface Swagger UI

#### 8.5 Accès à la documentation :
- URL : `http://localhost:8000/api/documentation`
- Interface Swagger UI interactive
- Tests d'endpoints directement dans l'interface

### Pourquoi cette étape ?
- **Documentation automatique** : Synchronisation code-documentation garantie
- **Interface interactive** : Tests d'API directement dans le navigateur
- **Collaboration** : Documentation claire pour les développeurs frontend
- **Maintenance** : Mise à jour automatique lors des modifications
- **Standards** : Respect des spécifications OpenAPI 3.0
- **Productivité** : Réduction du temps de développement frontend

---

## Fonctionnalités Documentées

### 🔐 Authentification
- **POST** `/api/register` - Inscription (patients/docteurs)
- **POST** `/api/login` - Connexion avec token
- **POST** `/api/logout` - Déconnexion
- **GET** `/api/profile` - Profil utilisateur

### 👥 Gestion des Patients
- **GET** `/api/patients` - Liste des patients
- **POST** `/api/patients` - Créer un patient
- **GET** `/api/patients/{id}` - Détails d'un patient
- **PUT** `/api/patients/{id}` - Modifier un patient
- **DELETE** `/api/patients/{id}` - Supprimer un patient

### 👨‍⚕️ Gestion des Docteurs
- **GET** `/api/doctors` - Liste des docteurs
- **POST** `/api/doctors` - Créer un docteur
- **GET** `/api/doctors/{id}` - Détails d'un docteur
- **PUT** `/api/doctors/{id}` - Modifier un docteur
- **DELETE** `/api/doctors/{id}` - Supprimer un docteur

### 📅 Gestion des Rendez-vous
- **GET** `/api/appointments` - Liste des rendez-vous
- **POST** `/api/appointments` - Créer un rendez-vous
- **GET** `/api/appointments/{id}` - Détails d'un rendez-vous
- **PUT** `/api/appointments/{id}` - Modifier un rendez-vous
- **DELETE** `/api/appointments/{id}` - Supprimer un rendez-vous

### 📋 Gestion des Dossiers Médicaux
- **GET** `/api/medical-records` - Liste des dossiers
- **POST** `/api/medical-records` - Créer un dossier
- **GET** `/api/medical-records/{id}` - Détails d'un dossier
- **PUT** `/api/medical-records/{id}` - Modifier un dossier
- **DELETE** `/api/medical-records/{id}` - Supprimer un dossier

### 🌐 Endpoints Publics
- **GET** `/api/public/specializations` - Spécialisations médicales

---

## Sécurité Implémentée

### 🔒 Authentification et Autorisation
- **Laravel Sanctum** : Tokens API sécurisés
- **Middleware auth:sanctum** : Protection des routes sensibles
- **Validation des rôles** : Différenciation patients/docteurs
- **Policies** : Contrôle d'accès granulaire

### 🛡️ Protection des Données
- **Validation stricte** : Form Requests pour chaque endpoint
- **Hachage des mots de passe** : Bcrypt par défaut
- **Protection CSRF** : Tokens anti-falsification
- **Sanitisation** : Nettoyage automatique des entrées

### 🚦 Limitation et Monitoring
- **Rate Limiting** : Limitation du nombre de requêtes
- **CORS configuré** : Accès contrôlé depuis le frontend
- **Logs automatiques** : Traçabilité des actions

---

## Conclusion

Ce backend Laravel offre une base solide pour une plateforme médicale avec :
- ✅ **Architecture MVC** claire et maintenable
- ✅ **API RESTful** complète et documentée
- ✅ **Sécurité** renforcée avec authentification par tokens
- ✅ **Documentation interactive** avec Swagger
- ✅ **Validation** robuste des données
- ✅ **Relations** optimisées entre entités
- ✅ **Évolutivité** pour futures fonctionnalités

La documentation Swagger est accessible à l'adresse : `http://localhost:8000/api/documentation`

---

## Commandes Utiles pour le Développement

### Serveur de Développement
```bash
php artisan serve
```

#### Explication de la commande :
- **`php artisan serve`** :
  - Démarre le serveur de développement intégré de PHP
  - Lance l'application sur `http://localhost:8000` par défaut
  - Utilise le serveur web intégré de PHP (non recommandé pour la production)
  - Permet de tester l'API localement sans configuration Apache/Nginx
  - Option `--host` et `--port` pour personnaliser l'adresse et le port

### Commandes de Cache et Optimisation
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

#### Explication des commandes :
- **`php artisan config:cache`** :
  - Met en cache tous les fichiers de configuration
  - Améliore les performances en évitant de relire les fichiers .env et config/
  - À utiliser en production, à éviter en développement

- **`php artisan route:cache`** :
  - Met en cache toutes les routes de l'application
  - Accélère la résolution des routes, surtout avec beaucoup d'endpoints
  - Nécessaire de vider le cache après modification des routes

- **`php artisan view:cache`** :
  - Précompile toutes les vues Blade
  - Améliore les temps de rendu des templates

- **`php artisan optimize`** :
  - Commande globale d'optimisation
  - Combine plusieurs optimisations (config, routes, etc.)
  - Recommandée pour les déploiements en production

### Commandes de Nettoyage
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

#### Explication des commandes :
- **`php artisan config:clear`** :
  - Supprime le cache de configuration
  - Nécessaire après modification des fichiers de config en production

- **`php artisan route:clear`** :
  - Supprime le cache des routes
  - À exécuter après modification des fichiers de routes

- **`php artisan view:clear`** :
  - Supprime le cache des vues compilées
  - Utile lors de problèmes d'affichage des templates

- **`php artisan cache:clear`** :
  - Vide tous les caches de l'application
  - Commande de dépannage générale

### Commandes de Base de Données
```bash
php artisan migrate:status
php artisan migrate:rollback
php artisan migrate:fresh
php artisan db:seed
```

#### Explication des commandes :
- **`php artisan migrate:status`** :
  - Affiche le statut de toutes les migrations
  - Indique quelles migrations ont été exécutées ou sont en attente
  - Utile pour diagnostiquer les problèmes de base de données

- **`php artisan migrate:rollback`** :
  - Annule la dernière batch de migrations
  - Option `--step=N` pour annuler N batches
  - Utilise les méthodes `down()` des migrations

- **`php artisan migrate:fresh`** :
  - Supprime toutes les tables et re-exécute toutes les migrations
  - Équivalent à `migrate:reset` + `migrate`
  - **ATTENTION** : Supprime toutes les données !

- **`php artisan db:seed`** :
  - Exécute les seeders pour peupler la base de données
  - Option `--class=SeederName` pour un seeder spécifique
  - Utile pour créer des données de test

### Commandes de Test
```bash
php artisan test
php artisan test --filter=AuthTest
php artisan test --coverage
```

#### Explication des commandes :
- **`php artisan test`** :
  - Lance tous les tests PHPUnit de l'application
  - Exécute les tests dans `tests/Feature/` et `tests/Unit/`
  - Affiche un rapport détaillé des résultats

- **`php artisan test --filter=AuthTest`** :
  - `--filter` : Exécute uniquement les tests correspondant au pattern
  - Permet de tester une classe ou méthode spécifique
  - Utile pour le développement ciblé

- **`php artisan test --coverage`** :
  - Génère un rapport de couverture de code
  - Nécessite Xdebug ou PCOV
  - Indique quelles parties du code sont testées