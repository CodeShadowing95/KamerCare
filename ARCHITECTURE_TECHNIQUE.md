# Architecture Technique - KamerCare

## 📋 Table des Matières
1. [Frontend Next.js](#frontend-nextjs)
2. [Backend Laravel](#backend-laravel)
3. [Architecture Globale](#architecture-globale)

---

## 🚀 Frontend Next.js

### Introduction à Next.js

Next.js est un framework React de production qui offre :
- **Rendu hybride** : SSR, SSG, ISR et CSR selon les besoins
- **Routage basé sur les fichiers** : Structure intuitive et automatique
- **Optimisations intégrées** : Images, fonts, bundles, et performance
- **API Routes** : Backend intégré pour les endpoints simples
- **TypeScript natif** : Support complet sans configuration

### 🗂️ Structure du Projet

```
frontend_nextjs/
├── app/                    # App Router (Next.js 13+)
│   ├── (auth)/            # Groupes de routes
│   ├── admin/             # Interface administrateur
│   ├── dashboard/         # Tableau de bord patient
│   ├── doctor/            # Interface médecin
│   ├── doctor-portal/     # Portail d'inscription médecin
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout racine
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI (shadcn/ui)
│   ├── admin/            # Composants admin
│   ├── doctor/           # Composants médecin
│   └── user-patient/     # Composants patient
├── hooks/                # Hooks personnalisés
├── lib/                  # Utilitaires et configuration
└── middleware.ts         # Middleware de routage
```

### 🛣️ Système de Routage

#### App Router (Next.js 13+)
- **Routage basé sur les dossiers** dans `/app`
- **Layouts imbriqués** pour une structure hiérarchique
- **Loading et Error UI** automatiques
- **Groupes de routes** avec `(nom)` pour l'organisation

#### Routes Principales
```typescript
// Routes publiques
/                          # Landing page
/search-doctors           # Recherche de médecins
/doctor-portal           # Portail médecin

// Routes authentifiées
/dashboard/*             # Interface patient
/doctor/*               # Interface médecin
/admin/*                # Interface admin
```

#### Middleware de Protection
```typescript
// middleware.ts
const protectedRoutes = ['/doctor', '/dashboard/*', '/admin']
const authRoutes = ['/login', '/signup']
const publicRoutes = ['/', '/search-doctors']
```

### 🎨 Méthodes de Rendu

#### 1. Server-Side Rendering (SSR)
- **Usage** : Pages dynamiques nécessitant des données fraîches
- **Implémentation** : Composants avec `async` dans App Router
- **Exemple** : Dashboard patient, liste des rendez-vous

#### 2. Static Site Generation (SSG)
- **Usage** : Pages statiques (landing page, documentation)
- **Implémentation** : Composants sans données dynamiques
- **Exemple** : Page d'accueil, pages marketing

#### 3. Client-Side Rendering (CSR)
- **Usage** : Interfaces interactives, données utilisateur
- **Implémentation** : `"use client"` directive
- **Exemple** : Formulaires, dashboards interactifs

### 🧩 Architecture des Composants

#### Structure Modulaire
```typescript
// Composants UI réutilisables (shadcn/ui)
components/ui/
├── button.tsx
├── card.tsx
├── dialog.tsx
└── ...

// Composants métier
components/
├── admin/              # Logique admin
├── doctor/             # Logique médecin
├── user-patient/       # Logique patient
└── landing-page-sections/
```

#### Hooks Personnalisés
```typescript
hooks/
├── use-auth.ts         # Authentification
├── use-appointments.ts # Gestion RDV
├── use-doctors.ts      # Données médecins
└── use-toast.ts        # Notifications
```

#### Gestion d'État
- **Local State** : `useState`, `useReducer`
- **Server State** : Hooks personnalisés avec fetch
- **Global State** : Context API pour l'authentification
- **Form State** : React Hook Form + Zod validation

### ⚡ Optimisations Mises en Place

#### 1. Performance
- **Code Splitting** : Automatique par route
- **Lazy Loading** : Composants et images
- **Bundle Optimization** : Tree shaking automatique
- **Caching** : Stratégies de cache Next.js

#### 2. Images et Assets
```typescript
// Optimisation automatique des images
import Image from 'next/image'

<Image
  src="/doctor.png"
  alt="Médecin"
  width={400}
  height={300}
  priority={true} // Pour les images above-the-fold
/>
```

#### 3. Fonts et Styles
- **Geist Font** : Police optimisée
- **Tailwind CSS** : Utility-first CSS
- **CSS Variables** : Thème sombre/clair
- **PostCSS** : Optimisation CSS

#### 4. TypeScript
- **Configuration stricte** : Type safety maximale
- **Path Mapping** : Imports absolus avec `@/`
- **Interface Types** : Typage des données API

### 🔐 Sécurité Frontend

#### Authentification
```typescript
// Middleware de protection des routes
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect('/login')
  }
}
```

#### Validation
- **Zod Schemas** : Validation côté client
- **Form Validation** : React Hook Form
- **Input Sanitization** : Protection XSS

---

## 🏗️ Backend Laravel

### Introduction à Laravel

Laravel est un framework PHP moderne offrant :
- **Architecture MVC** : Séparation claire des responsabilités
- **Eloquent ORM** : Gestion élégante de la base de données
- **Artisan CLI** : Outils de développement intégrés
- **Middleware** : Pipeline de requêtes flexible
- **API Resources** : Transformation des données

### 🗂️ Structure du Projet

```
backend_laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/           # Contrôleurs API
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── PatientController.php
│   │   │   │   ├── DoctorController.php
│   │   │   │   ├── AppointmentController.php
│   │   │   │   ├── MedicalRecordController.php
│   │   │   │   └── SwaggerController.php
│   │   │   └── Controller.php  # Contrôleur de base
│   │   ├── Middleware/        # Middleware personnalisé
│   │   ├── Requests/          # Form Requests
│   │   └── Kernel.php         # Configuration middleware
│   ├── Models/               # Modèles Eloquent
│   │   ├── User.php          # Utilisateurs (patients/médecins/admin)
│   │   ├── Patient.php       # Profils patients
│   │   ├── Doctor.php        # Profils médecins
│   │   ├── Appointment.php   # Rendez-vous
│   │   └── MedicalRecord.php # Dossiers médicaux
│   ├── Policies/            # Politiques d'autorisation
│   │   ├── AppointmentPolicy.php
│   │   ├── DoctorPolicy.php
│   │   ├── MedicalRecordPolicy.php
│   │   └── PatientPolicy.php
│   └── Providers/           # Fournisseurs de services
├── database/
│   ├── migrations/          # 20+ migrations structurées
│   ├── seeders/            # Données de test et admin
│   └── factories/          # Factories pour les tests
├── routes/
│   ├── api.php             # Routes API (89 lignes)
│   ├── web.php             # Routes web
│   └── channels.php        # Broadcasting
├── config/                 # Configuration Laravel
├── storage/
│   └── api-docs/           # Documentation Swagger générée
└── tests/                  # Tests unitaires et fonctionnels
```

### 🛣️ Organisation des Routes et Contrôleurs

### 🛣️ Organisation des Routes et Contrôleurs

#### Structure des Routes API (89 lignes)
```php
// routes/api.php

// Routes publiques (sans authentification)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/doctors', [DoctorController::class, 'store']); // Inscription médecin
Route::get('/public/doctors', [DoctorController::class, 'index']);
Route::get('/public/specializations', [DoctorController::class, 'specializations']);

// Routes géographiques publiques
Route::prefix('cities')->group(function () {
    Route::get('/regions', [CitiesController::class, 'getRegions']);
    Route::get('/by-region', [CitiesController::class, 'getCitiesByRegion']);
    Route::get('/search', [CitiesController::class, 'searchCities']);
});

// Routes protégées (Laravel Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    
    // Gestion des patients (CRUD complet)
    Route::apiResource('patients', PatientController::class);
    Route::get('/patients/search', [PatientController::class, 'search']);
    Route::get('/patients/{patient}/appointments', [PatientController::class, 'appointments']);
    Route::get('/patients/{patient}/medical-records', [PatientController::class, 'medicalRecords']);
    
    // Gestion des médecins
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);
    Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);
    Route::patch('/doctors/{doctor}/toggle-availability', [DoctorController::class, 'toggleAvailability']);
    
    // Gestion des rendez-vous (CRUD + actions spécifiques)
    Route::apiResource('appointments', AppointmentController::class);
    Route::patch('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
    Route::patch('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::patch('/appointments/{appointment}/complete', [AppointmentController::class, 'complete']);
    Route::post('/appointments/{appointment}/accept', [AppointmentController::class, 'accept']);
    Route::post('/appointments/{appointment}/reject', [AppointmentController::class, 'reject']);
    Route::get('/appointments/today', [AppointmentController::class, 'today']);
    Route::get('/appointments/upcoming', [AppointmentController::class, 'upcoming']);
    Route::get('/appointments/types', [AppointmentController::class, 'getAppointmentTypes']);
    
    // Dossiers médicaux
    Route::apiResource('medical-records', MedicalRecordController::class);
    Route::post('/medical-records/{medicalRecord}/attachments', [MedicalRecordController::class, 'addAttachment']);
    Route::get('/patients/{patient}/medical-history', [MedicalRecordController::class, 'patientHistory']);
    Route::get('/patients/{patient}/medical-report', [MedicalRecordController::class, 'generateReport']);
});
```

#### Architecture des Contrôleurs
```php
// Contrôleur de base avec méthodes communes
abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    
    protected function successResponse($data, $message = 'Success', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }
    
    protected function errorResponse($message, $code = 400, $errors = null)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], $code);
    }
}

// Contrôleur spécialisé avec logique métier
class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $appointments = Appointment::with(['patient', 'doctor'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->type, fn($q) => $q->where('appointment_type', $request->type))
            ->when($request->date, fn($q) => $q->whereDate('appointment_date', $request->date))
            ->orderBy('appointment_date', 'desc')
            ->paginate(15);
            
        return $this->successResponse($appointments);
    }
    
    public function confirm(Appointment $appointment)
    {
        $appointment->update([
            'status' => 'confirmed',
            'confirmed_at' => now()
        ]);
        
        // Notification au patient
        // Mail::to($appointment->patient->email)->send(new AppointmentConfirmed($appointment));
        
        return $this->successResponse($appointment, 'Rendez-vous confirmé avec succès');
    }
}
```

#### Middleware et Sécurité
```php
// app/Http/Kernel.php - Configuration des middleware
protected $middlewareGroups = [
    'api' => [
        'throttle:api',  // Limitation de taux (60 req/min)
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];

protected $routeMiddleware = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
    'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
];
```

### 🔐 Système d'Authentification

#### Laravel Sanctum - API Token Authentication
```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort()
))),

'guard' => ['web'],
'expiration' => null, // Tokens ne expirent pas par défaut
'middleware' => [
    'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
    'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
],
```

#### Contrôleur d'Authentification
```php
class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'patient',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ], 'Utilisateur créé avec succès', 201);
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->errorResponse('Identifiants invalides', 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ], 'Connexion réussie');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse(null, 'Déconnexion réussie');
    }

    public function me(Request $request)
    {
        return $this->successResponse($request->user());
    }
}
```

#### Modèle User avec Rôles
```php
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'email_verified_at'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relations basées sur le rôle
    public function doctor()
    {
        return $this->hasOne(Doctor::class);
    }

    public function patient()
    {
        return $this->hasOne(Patient::class);
    }

    // Vérification des rôles
    public function isDoctor(): bool
    {
        return $this->role === 'doctor';
    }

    public function isPatient(): bool
    {
        return $this->role === 'patient';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
```

#### Middleware d'Autorisation Personnalisé
```php
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return $next($request);
    }
}

// Utilisation dans les routes
Route::middleware(['auth:sanctum', 'role:doctor'])->group(function () {
    Route::get('/doctor/dashboard', [DoctorController::class, 'dashboard']);
    Route::patch('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
});
```

### 🗄️ Interaction avec la Base de Données

#### Modèles Eloquent et Relations

##### Modèle Doctor (Médecin)
```php
class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'specialization', 'license_number', 'phone', 'address',
        'city', 'region', 'consultation_fee', 'bio', 'years_of_experience',
        'education', 'languages', 'is_available', 'profile_image'
    ];

    protected $casts = [
        'languages' => 'array',
        'is_available' => 'boolean',
        'consultation_fee' => 'decimal:2',
        'years_of_experience' => 'integer'
    ];

    protected $appends = ['full_name', 'average_rating'];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Accesseurs
    public function getFullNameAttribute()
    {
        return $this->user->name;
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeBySpecialization($query, $specialization)
    {
        return $query->where('specialization', $specialization);
    }

    public function scopeByCity($query, $city)
    {
        return $query->where('city', $city);
    }
}
```

##### Modèle Appointment (Rendez-vous)
```php
class Appointment extends Model
{
    use HasFactory;

    // Types de rendez-vous constants
    const TYPE_CONSULTATION = 'consultation';
    const TYPE_FOLLOW_UP = 'follow_up';
    const TYPE_EMERGENCY = 'emergency';
    const TYPE_TELEMEDICINE = 'telemedicine';

    // Statuts constants
    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_COMPLETED = 'completed';
    const STATUS_NO_SHOW = 'no_show';

    protected $fillable = [
        'patient_id', 'doctor_id', 'appointment_date', 'appointment_time',
        'appointment_type', 'status', 'reason', 'notes', 'consultation_fee',
        'confirmed_at', 'cancelled_at', 'completed_at', 'cancellation_reason'
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'appointment_time' => 'datetime',
        'consultation_fee' => 'decimal:2',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'completed_at' => 'datetime'
    ];

    // Relations
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function medicalRecord()
    {
        return $this->hasOne(MedicalRecord::class);
    }

    // Scopes
    public function scopeToday($query)
    {
        return $query->whereDate('appointment_date', today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('appointment_date', '>=', today())
                    ->where('status', '!=', self::STATUS_CANCELLED);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Méthodes d'état
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isConfirmed(): bool
    {
        return $this->status === self::STATUS_CONFIRMED;
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]);
    }
}
```

#### Migrations et Structure de Base de Données

##### Migration des Médecins
```php
// database/migrations/create_doctors_table.php
Schema::create('doctors', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('specialization');
    $table->string('license_number')->unique();
    $table->string('phone');
    $table->text('address');
    $table->string('city');
    $table->string('region');
    $table->decimal('consultation_fee', 8, 2)->default(0);
    $table->text('bio')->nullable();
    $table->integer('years_of_experience')->default(0);
    $table->text('education')->nullable();
    $table->json('languages')->nullable();
    $table->boolean('is_available')->default(true);
    $table->string('profile_image')->nullable();
    $table->timestamps();

    $table->index(['specialization', 'city', 'is_available']);
});
```

##### Migration des Rendez-vous
```php
// database/migrations/create_appointments_table.php
Schema::create('appointments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('patient_id')->constrained()->onDelete('cascade');
    $table->foreignId('doctor_id')->constrained()->onDelete('cascade');
    $table->date('appointment_date');
    $table->datetime('appointment_time');
    $table->enum('appointment_type', ['consultation', 'follow_up', 'emergency', 'telemedicine']);
    $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])
          ->default('pending');
    $table->text('reason');
    $table->text('notes')->nullable();
    $table->decimal('consultation_fee', 8, 2);
    $table->timestamp('confirmed_at')->nullable();
    $table->timestamp('cancelled_at')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->text('cancellation_reason')->nullable();
    $table->timestamps();

    $table->index(['doctor_id', 'appointment_date', 'status']);
    $table->index(['patient_id', 'status']);
    $table->unique(['doctor_id', 'appointment_date', 'appointment_time']);
});
```

#### Seeders et Données de Test
```php
// database/seeders/DoctorSeeder.php
class DoctorSeeder extends Seeder
{
    public function run()
    {
        $specializations = [
            'Médecine Générale', 'Cardiologie', 'Dermatologie',
            'Pédiatrie', 'Gynécologie', 'Neurologie', 'Psychiatrie'
        ];

        $cities = ['Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua'];

        foreach ($specializations as $specialization) {
            foreach ($cities as $city) {
                User::factory()
                    ->has(Doctor::factory()->state([
                        'specialization' => $specialization,
                        'city' => $city,
                        'region' => $this->getRegionByCity($city)
                    ]))
                    ->create(['role' => 'doctor']);
            }
        }
    }
}
```

#### Query Builder et Optimisations
```php
// Requêtes optimisées avec relations
class AppointmentService
{
    public function getDoctorAppointments($doctorId, $filters = [])
    {
        return Appointment::with(['patient.user', 'medicalRecord'])
            ->where('doctor_id', $doctorId)
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->when($filters['date'] ?? null, fn($q, $date) => $q->whereDate('appointment_date', $date))
            ->when($filters['type'] ?? null, fn($q, $type) => $q->where('appointment_type', $type))
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->paginate(15);
    }

    public function getAvailableDoctors($specialization = null, $city = null)
    {
        return Doctor::with(['user', 'reviews'])
            ->available()
            ->when($specialization, fn($q) => $q->bySpecialization($specialization))
            ->when($city, fn($q) => $q->byCity($city))
            ->withCount('appointments')
            ->withAvg('reviews', 'rating')
            ->orderBy('reviews_avg_rating', 'desc')
            ->get();
    }
}
```

### 🛠️ Services Personnalisés

#### Architecture des Services

##### AppointmentService - Gestion des Rendez-vous
```php
class AppointmentService
{
    public function __construct(
        private NotificationService $notificationService,
        private CalendarService $calendarService
    ) {}

    public function createAppointment(array $data): Appointment
    {
        DB::beginTransaction();
        
        try {
            // Vérifier la disponibilité du médecin
            $this->validateDoctorAvailability($data['doctor_id'], $data['appointment_date'], $data['appointment_time']);
            
            // Créer le rendez-vous
            $appointment = Appointment::create([
                'patient_id' => $data['patient_id'],
                'doctor_id' => $data['doctor_id'],
                'appointment_date' => $data['appointment_date'],
                'appointment_time' => $data['appointment_time'],
                'appointment_type' => $data['appointment_type'],
                'reason' => $data['reason'],
                'consultation_fee' => $this->calculateConsultationFee($data['doctor_id'], $data['appointment_type']),
                'status' => Appointment::STATUS_PENDING
            ]);

            // Notifications automatiques
            $this->notificationService->sendAppointmentCreated($appointment);
            
            // Ajouter au calendrier du médecin
            $this->calendarService->blockTimeSlot($appointment);
            
            DB::commit();
            return $appointment;
            
        } catch (\Exception $e) {
            DB::rollback();
            throw new AppointmentException("Erreur lors de la création du rendez-vous: " . $e->getMessage());
        }
    }

    public function confirmAppointment(Appointment $appointment): bool
    {
        if (!$appointment->isPending()) {
            throw new InvalidStatusException("Seuls les rendez-vous en attente peuvent être confirmés");
        }

        $appointment->update([
            'status' => Appointment::STATUS_CONFIRMED,
            'confirmed_at' => now()
        ]);

        // Notifications
        $this->notificationService->sendAppointmentConfirmed($appointment);
        
        // Rappel automatique 24h avant
        $this->scheduleReminder($appointment);

        return true;
    }

    public function cancelAppointment(Appointment $appointment, string $reason, User $cancelledBy): bool
    {
        if (!$appointment->canBeCancelled()) {
            throw new InvalidStatusException("Ce rendez-vous ne peut plus être annulé");
        }

        $appointment->update([
            'status' => Appointment::STATUS_CANCELLED,
            'cancelled_at' => now(),
            'cancellation_reason' => $reason
        ]);

        // Libérer le créneau
        $this->calendarService->freeTimeSlot($appointment);
        
        // Notifications
        $this->notificationService->sendAppointmentCancelled($appointment, $cancelledBy);

        return true;
    }

    private function validateDoctorAvailability(int $doctorId, string $date, string $time): void
    {
        $existingAppointment = Appointment::where('doctor_id', $doctorId)
            ->whereDate('appointment_date', $date)
            ->whereTime('appointment_time', $time)
            ->whereIn('status', [Appointment::STATUS_PENDING, Appointment::STATUS_CONFIRMED])
            ->exists();

        if ($existingAppointment) {
            throw new UnavailableSlotException("Ce créneau n'est pas disponible");
        }
    }

    private function calculateConsultationFee(int $doctorId, string $appointmentType): float
    {
        $doctor = Doctor::findOrFail($doctorId);
        $baseFee = $doctor->consultation_fee;

        return match($appointmentType) {
            Appointment::TYPE_EMERGENCY => $baseFee * 1.5,
            Appointment::TYPE_TELEMEDICINE => $baseFee * 0.8,
            default => $baseFee
        };
    }
}
```

##### NotificationService - Système de Notifications
```php
class NotificationService
{
    public function __construct(
        private MailService $mailService,
        private SmsService $smsService
    ) {}

    public function sendAppointmentCreated(Appointment $appointment): void
    {
        $patient = $appointment->patient;
        $doctor = $appointment->doctor;

        // Email au patient
        $this->mailService->send(
            $patient->user->email,
            'Demande de rendez-vous envoyée',
            'emails.appointment.created',
            compact('appointment', 'patient', 'doctor')
        );

        // Notification au médecin
        $this->mailService->send(
            $doctor->user->email,
            'Nouvelle demande de rendez-vous',
            'emails.appointment.new-request',
            compact('appointment', 'patient', 'doctor')
        );

        // SMS si numéro disponible
        if ($patient->phone) {
            $this->smsService->send(
                $patient->phone,
                "Votre demande de RDV avec Dr. {$doctor->user->name} a été envoyée. Vous recevrez une confirmation."
            );
        }
    }

    public function sendAppointmentConfirmed(Appointment $appointment): void
    {
        $patient = $appointment->patient;
        $doctor = $appointment->doctor;

        $this->mailService->send(
            $patient->user->email,
            'Rendez-vous confirmé',
            'emails.appointment.confirmed',
            compact('appointment', 'patient', 'doctor')
        );

        if ($patient->phone) {
            $this->smsService->send(
                $patient->phone,
                "RDV confirmé avec Dr. {$doctor->user->name} le {$appointment->appointment_date->format('d/m/Y')} à {$appointment->appointment_time->format('H:i')}"
            );
        }
    }

    public function sendAppointmentReminder(Appointment $appointment): void
    {
        $patient = $appointment->patient;
        $doctor = $appointment->doctor;

        // Rappel 24h avant
        $this->mailService->send(
            $patient->user->email,
            'Rappel de rendez-vous - Demain',
            'emails.appointment.reminder',
            compact('appointment', 'patient', 'doctor')
        );

        if ($patient->phone) {
            $this->smsService->send(
                $patient->phone,
                "Rappel: RDV demain avec Dr. {$doctor->user->name} à {$appointment->appointment_time->format('H:i')}"
            );
        }
    }
}
```

##### SearchService - Recherche Avancée
```php
class SearchService
{
    public function searchDoctors(array $criteria): Collection
    {
        $query = Doctor::with(['user', 'reviews'])
            ->available();

        // Filtres de base
        if (!empty($criteria['specialization'])) {
            $query->where('specialization', $criteria['specialization']);
        }

        if (!empty($criteria['city'])) {
            $query->where('city', $criteria['city']);
        }

        if (!empty($criteria['region'])) {
            $query->where('region', $criteria['region']);
        }

        // Recherche par nom
        if (!empty($criteria['name'])) {
            $query->whereHas('user', function ($q) use ($criteria) {
                $q->where('name', 'LIKE', '%' . $criteria['name'] . '%');
            });
        }

        // Filtres avancés
        if (!empty($criteria['min_experience'])) {
            $query->where('years_of_experience', '>=', $criteria['min_experience']);
        }

        if (!empty($criteria['max_fee'])) {
            $query->where('consultation_fee', '<=', $criteria['max_fee']);
        }

        if (!empty($criteria['languages'])) {
            $languages = is_array($criteria['languages']) ? $criteria['languages'] : [$criteria['languages']];
            $query->where(function ($q) use ($languages) {
                foreach ($languages as $language) {
                    $q->orWhereJsonContains('languages', $language);
                }
            });
        }

        // Tri
        $sortBy = $criteria['sort_by'] ?? 'rating';
        switch ($sortBy) {
            case 'rating':
                $query->withAvg('reviews', 'rating')
                      ->orderBy('reviews_avg_rating', 'desc');
                break;
            case 'experience':
                $query->orderBy('years_of_experience', 'desc');
                break;
            case 'fee_low':
                $query->orderBy('consultation_fee', 'asc');
                break;
            case 'fee_high':
                $query->orderBy('consultation_fee', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        return $query->get();
    }

    public function searchAvailableSlots(int $doctorId, string $date): array
    {
        $doctor = Doctor::findOrFail($doctorId);
        
        // Créneaux de travail standard (9h-17h)
        $workingHours = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
        ];

        // Récupérer les créneaux occupés
        $bookedSlots = Appointment::where('doctor_id', $doctorId)
            ->whereDate('appointment_date', $date)
            ->whereIn('status', [Appointment::STATUS_PENDING, Appointment::STATUS_CONFIRMED])
            ->pluck('appointment_time')
            ->map(fn($time) => Carbon::parse($time)->format('H:i'))
            ->toArray();

        // Retourner les créneaux disponibles
        return array_diff($workingHours, $bookedSlots);
    }
}
```

##### ValidationService - Validation Métier
```php
class ValidationService
{
    public function validateAppointmentData(array $data): array
    {
        $errors = [];

        // Validation de la date
        $appointmentDate = Carbon::parse($data['appointment_date']);
        if ($appointmentDate->isPast()) {
            $errors['appointment_date'] = 'La date du rendez-vous ne peut pas être dans le passé';
        }

        if ($appointmentDate->isWeekend()) {
            $errors['appointment_date'] = 'Les rendez-vous ne sont pas disponibles le weekend';
        }

        // Validation du médecin
        $doctor = Doctor::find($data['doctor_id']);
        if (!$doctor || !$doctor->is_available) {
            $errors['doctor_id'] = 'Ce médecin n\'est pas disponible';
        }

        // Validation du type de rendez-vous
        $validTypes = [
            Appointment::TYPE_CONSULTATION,
            Appointment::TYPE_FOLLOW_UP,
            Appointment::TYPE_EMERGENCY,
            Appointment::TYPE_TELEMEDICINE
        ];

        if (!in_array($data['appointment_type'], $validTypes)) {
            $errors['appointment_type'] = 'Type de rendez-vous invalide';
        }

        return $errors;
    }

    public function validateDoctorRegistration(array $data): array
    {
        $errors = [];

        // Vérifier l'unicité du numéro de licence
        if (Doctor::where('license_number', $data['license_number'])->exists()) {
            $errors['license_number'] = 'Ce numéro de licence est déjà utilisé';
        }

        // Validation de la spécialisation
        $validSpecializations = [
            'Médecine Générale', 'Cardiologie', 'Dermatologie', 'Pédiatrie',
            'Gynécologie', 'Neurologie', 'Psychiatrie', 'Orthopédie'
        ];

        if (!in_array($data['specialization'], $validSpecializations)) {
            $errors['specialization'] = 'Spécialisation non reconnue';
        }

        return $errors;
    }
}
```

#### Injection de Dépendances et Service Container
```php
// app/Providers/AppServiceProvider.php
class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Enregistrement des services
        $this->app->singleton(AppointmentService::class);
        $this->app->singleton(NotificationService::class);
        $this->app->singleton(SearchService::class);
        $this->app->singleton(ValidationService::class);
        
        // Interfaces et implémentations
        $this->app->bind(MailServiceInterface::class, MailService::class);
        $this->app->bind(SmsServiceInterface::class, SmsService::class);
    }

    public function boot()
    {
        // Configuration des services au démarrage
    }
}
```

### 📊 API Resources et Transformations

#### Transformation des Données
```php
// Resource pour formater les réponses API
class AppointmentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'date' => $this->appointment_date->format('Y-m-d H:i'),
            'status' => $this->status,
            'patient' => new PatientResource($this->whenLoaded('patient')),
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
            'can_cancel' => $this->canBeCancelled(),
            'created_at' => $this->created_at->toISOString()
        ];
    }
}
```

### 🔒 Validation et Sécurité

#### Form Requests
```php
class CreateAppointmentRequest extends FormRequest
{
    public function rules()
    {
        return [
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date|after:now',
            'reason_for_visit' => 'required|string|max:500',
            'appointment_type' => 'required|in:consultation,follow_up,emergency'
        ];
    }
    
    public function authorize()
    {
        return $this->user()->can('create-appointment');
    }
}
```

---

## 🏗️ Architecture Globale du Système

### 📡 Communication Frontend-Backend

#### API RESTful avec Axios
```typescript
// lib/api.ts - Configuration Axios centralisée
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour l'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour la gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Services API Typés
```typescript
// services/appointmentService.ts
interface CreateAppointmentData {
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_type: 'consultation' | 'follow_up' | 'emergency' | 'telemedicine';
  reason: string;
}

interface AppointmentResponse {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  doctor: {
    id: number;
    user: { name: string; email: string };
    specialization: string;
    consultation_fee: number;
  };
}

export const appointmentService = {
  async create(data: CreateAppointmentData): Promise<AppointmentResponse> {
    const response = await api.post('/appointments', data);
    return response.data.data;
  },

  async getMyAppointments(): Promise<AppointmentResponse[]> {
    const response = await api.get('/appointments');
    return response.data.data;
  },

  async confirm(id: number): Promise<AppointmentResponse> {
    const response = await api.patch(`/appointments/${id}/confirm`);
    return response.data.data;
  },

  async cancel(id: number, reason: string): Promise<void> {
    await api.patch(`/appointments/${id}/cancel`, { reason });
  }
};
```

### 🔄 Flux de Données et États

#### Gestion d'État avec Context API
```typescript
// contexts/AuthContext.tsx
interface User {
  id: number;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data.data;
      
      setUser(user);
      setToken(token);
      localStorage.setItem('auth_token', token);
    } catch (error) {
      throw new Error('Identifiants invalides');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 🚀 Déploiement et Infrastructure

#### Configuration de Production

##### Frontend Next.js (Vercel/Netlify)
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'api.kamercare.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: 'KamerCare',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

##### Backend Laravel (VPS/Cloud)
```php
// .env.production
APP_NAME=KamerCare
APP_ENV=production
APP_KEY=base64:generated_key
APP_DEBUG=false
APP_URL=https://api.kamercare.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kamercare_prod
DB_USERNAME=kamercare_user
DB_PASSWORD=secure_password

SANCTUM_STATEFUL_DOMAINS=kamercare.com,www.kamercare.com
SESSION_DOMAIN=.kamercare.com

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=noreply@kamercare.com
MAIL_PASSWORD=app_password
MAIL_ENCRYPTION=tls

QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

#### Scripts de Déploiement
```bash
#!/bin/bash
# deploy.sh - Script de déploiement automatisé

echo "🚀 Déploiement KamerCare Backend..."

# Mise à jour du code
git pull origin main

# Installation des dépendances
composer install --no-dev --optimize-autoloader

# Mise à jour de la base de données
php artisan migrate --force

# Optimisations Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Redémarrage des services
php artisan queue:restart
sudo systemctl reload nginx
sudo systemctl reload php8.2-fpm

echo "✅ Déploiement terminé avec succès!"
```

### 📊 Monitoring et Performance

#### Métriques de Performance
- **Frontend** : Core Web Vitals, Time to Interactive
- **Backend** : Temps de réponse API, Utilisation mémoire
- **Base de données** : Requêtes lentes, Index manquants

#### Outils de Monitoring
```php
// Monitoring Laravel avec Telescope (développement)
// config/telescope.php
'watchers' => [
    Watchers\QueryWatcher::class => [
        'enabled' => env('TELESCOPE_QUERY_WATCHER', true),
        'slow' => 100, // Requêtes > 100ms
    ],
    Watchers\RequestWatcher::class => [
        'enabled' => env('TELESCOPE_REQUEST_WATCHER', true),
        'size_limit' => 64,
    ],
],
```

### 🔒 Sécurité et Bonnes Pratiques

#### Sécurité Frontend
- **CSP Headers** : Protection contre XSS
- **HTTPS Obligatoire** : Chiffrement des communications
- **Validation côté client** : Première ligne de défense

#### Sécurité Backend
- **Rate Limiting** : Protection contre les attaques par déni de service
- **Validation stricte** : Sanitisation des entrées utilisateur
- **Logs de sécurité** : Traçabilité des actions sensibles

```php
// Middleware de rate limiting personnalisé
class ApiRateLimiter
{
    public function handle($request, Closure $next, $maxAttempts = 60, $decayMinutes = 1)
    {
        $key = $this->resolveRequestSignature($request);
        
        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            return response()->json([
                'message' => 'Trop de tentatives. Réessayez dans ' . $decayMinutes . ' minute(s).'
            ], 429);
        }
        
        RateLimiter::hit($key, $decayMinutes * 60);
        
        return $next($request);
    }
}
```

---

## 📝 Résumé Exécutif

### Points Clés de l'Architecture

#### Frontend Next.js
- **App Router** moderne avec layouts imbriqués
- **Composants réutilisables** avec Tailwind CSS et shadcn/ui
- **Authentification** sécurisée avec gestion d'état centralisée
- **Optimisations** automatiques (images, fonts, bundles)

#### Backend Laravel
- **API RESTful** complète avec 89 endpoints
- **Authentification Sanctum** avec gestion des rôles
- **Architecture en services** pour la logique métier
- **Base de données** optimisée avec relations Eloquent

#### Communication
- **API typée** avec intercepteurs Axios
- **Gestion d'erreurs** centralisée
- **Validation** côté client et serveur

Cette architecture garantit une **scalabilité**, une **maintenabilité** et une **sécurité** optimales pour la plateforme KamerCare.