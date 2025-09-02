# Types de Rendez-vous - Documentation

## Vue d'ensemble

Le système KamerCare prend désormais en charge différents types de rendez-vous pour répondre aux besoins variés des patients et des médecins.

## Types de Rendez-vous Disponibles

### 1. Présentiel (`presentiel`)
- **Description** : Consultation en personne au cabinet médical ou à l'hôpital
- **Utilisation** : Consultations nécessitant un examen physique, premiers rendez-vous
- **Durée recommandée** : 30-60 minutes

### 2. Visioconférence (`visio`)
- **Description** : Consultation à distance via vidéoconférence
- **Utilisation** : Suivis, consultations de routine, télémédecine
- **Durée recommandée** : 15-30 minutes
- **Avantages** : Économie de temps et de déplacement

### 3. À domicile (`domicile`)
- **Description** : Visite médicale au domicile du patient
- **Utilisation** : Patients à mobilité réduite, soins post-opératoires
- **Durée recommandée** : 45-90 minutes (incluant le déplacement)

### 4. Urgence (`urgence`)
- **Description** : Consultation d'urgence nécessitant une prise en charge rapide
- **Utilisation** : Situations médicales urgentes mais non critiques
- **Durée recommandée** : 15-45 minutes
- **Priorité** : Haute

### 5. Suivi (`suivi`)
- **Description** : Rendez-vous de suivi pour un traitement en cours
- **Utilisation** : Contrôles réguliers, ajustements de traitement
- **Durée recommandée** : 15-30 minutes

## Utilisation dans l'API

### Création d'un rendez-vous

```json
{
  "patient_id": 1,
  "doctor_id": 2,
  "appointment_date": "2024-01-15 14:30:00",
  "appointment_type": "visio",
  "duration_minutes": 30,
  "reason_for_visit": "Consultation de suivi",
  "consultation_fee": 50.00
}
```

### Filtrage par type

```bash
# Récupérer tous les rendez-vous en visio
GET /api/appointments?appointment_type=visio

# Récupérer tous les rendez-vous présentiels
GET /api/appointments?presentiel=true

# Récupérer tous les rendez-vous en visio
GET /api/appointments?visio=true
```

### Récupération des types disponibles

```bash
GET /api/appointments/types
```

Réponse :
```json
{
  "success": true,
  "data": {
    "types": {
      "presentiel": "Présentiel",
      "visio": "Visioconférence",
      "domicile": "À domicile",
      "urgence": "Urgence",
      "suivi": "Suivi"
    },
    "constants": {
      "TYPE_PRESENTIEL": "presentiel",
      "TYPE_VISIO": "visio",
      "TYPE_DOMICILE": "domicile",
      "TYPE_URGENCE": "urgence",
      "TYPE_SUIVI": "suivi"
    }
  },
  "message": "Appointment types retrieved successfully"
}
```

## Utilisation dans le modèle Eloquent

### Scopes disponibles

```php
// Filtrer par type
$appointments = Appointment::byType('visio')->get();

// Rendez-vous en visio uniquement
$visioAppointments = Appointment::visio()->get();

// Rendez-vous présentiels uniquement
$presentielAppointments = Appointment::presentiel()->get();
```

### Accesseurs

```php
$appointment = Appointment::find(1);

// Obtenir le libellé du type
echo $appointment->appointment_type_label; // "Visioconférence"

// Vérifier le type
if ($appointment->is_visio) {
    // Logique spécifique aux rendez-vous en visio
}

if ($appointment->is_presentiel) {
    // Logique spécifique aux rendez-vous présentiels
}
```

## Constantes du modèle

```php
use App\Models\Appointment;

// Utilisation des constantes
$appointment = new Appointment([
    'appointment_type' => Appointment::TYPE_VISIO,
    // autres champs...
]);

// Récupération de tous les types
$allTypes = Appointment::APPOINTMENT_TYPES;
```

## Migration

Le champ `appointment_type` a été ajouté à la table `appointments` avec :
- Type : `ENUM`
- Valeurs possibles : `'presentiel', 'visio', 'domicile', 'urgence', 'suivi'`
- Valeur par défaut : `'presentiel'`
- Position : Après le champ `status`

## Évolutions futures possibles

- **Téléconsultation spécialisée** : Pour des consultations spécialisées à distance
- **Consultation de groupe** : Pour des séances de groupe (éducation thérapeutique)
- **Consultation express** : Pour des consultations très courtes (renouvellement d'ordonnance)
- **Consultation préventive** : Pour les bilans de santé et dépistages

## Notes importantes

1. Le type de rendez-vous influence la durée recommandée et les modalités de prise en charge
2. Certains types peuvent nécessiter des équipements spécifiques (caméra pour la visio)
3. Les tarifs peuvent varier selon le type de consultation
4. Les rendez-vous d'urgence ont une priorité plus élevée dans l'affichage