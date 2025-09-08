# Suivi de l'origine des demandes de rendez-vous

## Vue d'ensemble

Le système KamerCare permet maintenant de tracer qui a créé chaque demande de rendez-vous grâce au champ `created_by_user_id` dans la table `appointments`.

## Structure de la base de données

### Nouveau champ ajouté

```sql
ALTER TABLE appointments ADD COLUMN created_by_user_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE appointments ADD FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE;
```

### Modèle Appointment mis à jour

```php
class Appointment extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'created_by_user_id', // Nouveau champ
        'appointment_date',
        // ... autres champs
    ];
    
    // Nouvelle relation
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
```

## Utilisation dans le contrôleur

### Création automatique du champ

```php
public function store(Request $request): JsonResponse
{
    $currentUser = auth()->user();
    
    $appointmentData = $validated;
    $appointmentData['created_by_user_id'] = $currentUser->id; // Automatique
    
    $appointment = Appointment::create($appointmentData);
    $appointment->load(['patient', 'doctor', 'createdBy']);
    
    return response()->json([
        'success' => true,
        'data' => $appointment,
        'creator_info' => [
            'created_by' => $currentUser->name,
            'creator_role' => $currentUser->role,
            'is_self_booking' => $currentUser->role === 'patient' && $appointment->patient_id === $currentUser->patient->id
        ]
    ]);
}
```

## Exemples d'utilisation

### 1. Identifier l'origine d'une demande

```php
$appointment = Appointment::with('createdBy')->find(1);

$creator = $appointment->createdBy;
echo "Rendez-vous créé par: {$creator->name} ({$creator->role})";

// Vérifier si c'est une auto-réservation
if ($creator->role === 'patient' && $appointment->patient_id === $creator->patient->id) {
    echo "Auto-réservation par le patient";
} elseif ($creator->role === 'doctor') {
    echo "Réservation faite par un docteur";
} elseif ($creator->role === 'admin') {
    echo "Réservation faite par un administrateur";
}
```

### 2. Filtrer les rendez-vous par créateur

```php
// Rendez-vous créés par des patients
$patientCreatedAppointments = Appointment::whereHas('createdBy', function($query) {
    $query->where('role', 'patient');
})->get();

// Rendez-vous créés par des docteurs
$doctorCreatedAppointments = Appointment::whereHas('createdBy', function($query) {
    $query->where('role', 'doctor');
})->get();

// Rendez-vous créés par un utilisateur spécifique
$userAppointments = Appointment::where('created_by_user_id', $userId)->get();
```

### 3. Statistiques par type de créateur

```php
$stats = Appointment::selectRaw('
    users.role as creator_role,
    COUNT(*) as total_appointments,
    COUNT(CASE WHEN appointments.status = "completed" THEN 1 END) as completed_appointments
')
->join('users', 'appointments.created_by_user_id', '=', 'users.id')
->groupBy('users.role')
->get();

foreach ($stats as $stat) {
    echo "Rôle: {$stat->creator_role} - Total: {$stat->total_appointments} - Complétés: {$stat->completed_appointments}\n";
}
```

### 4. Logique métier différenciée

```php
public function handleAppointmentCreation(Appointment $appointment)
{
    $creator = $appointment->createdBy;
    
    switch ($creator->role) {
        case 'patient':
            // Logique pour les réservations patients
            $this->sendPatientConfirmationEmail($appointment);
            $this->notifyDoctorOfNewBooking($appointment);
            break;
            
        case 'doctor':
            // Logique pour les réservations docteurs
            $this->sendDoctorCreatedAppointmentNotification($appointment);
            $this->notifyPatientOfDoctorBooking($appointment);
            break;
            
        case 'admin':
            // Logique pour les réservations admin
            $this->sendAdminCreatedAppointmentNotification($appointment);
            break;
    }
}
```

## Avantages

1. **Traçabilité complète** : Savoir qui a créé chaque rendez-vous
2. **Logique métier différenciée** : Workflows différents selon l'origine
3. **Statistiques précises** : Analyser les patterns de réservation
4. **Audit et conformité** : Traçabilité pour les audits médicaux
5. **Expérience utilisateur** : Notifications et interfaces adaptées

## Migration des données existantes

Pour les rendez-vous existants sans `created_by_user_id`, vous pouvez :

```php
// Assigner un utilisateur par défaut (ex: admin)
$adminUser = User::where('role', 'admin')->first();
Appointment::whereNull('created_by_user_id')
    ->update(['created_by_user_id' => $adminUser->id]);

// Ou essayer de deviner basé sur d'autres critères
Appointment::whereNull('created_by_user_id')
    ->chunk(100, function($appointments) {
        foreach($appointments as $appointment) {
            // Logique pour deviner le créateur
            $creatorId = $this->guessCreator($appointment);
            $appointment->update(['created_by_user_id' => $creatorId]);
        }
    });
```