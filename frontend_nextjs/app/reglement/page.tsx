'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { 
  CreditCard, 
  Smartphone, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Shield,
  CheckCircle,
  Banknote,
  Zap
} from 'lucide-react';
import { Appointment } from '@/hooks/use-appointments';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
  color: string;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const appointmentId = searchParams.get('appointment');
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'orange-money',
      name: 'Orange Money',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Paiement mobile sécurisé',
      available: true,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'momo',
      name: 'MTN Mobile Money',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Paiement mobile MTN',
      available: true,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Paiement sécurisé PayPal',
      available: true,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, Mastercard, Amex',
      available: true,
      color: 'from-gray-600 to-gray-700'
    }
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isAuthenticated && appointmentId) {
      fetchAppointmentDetails();
    } else if (isAuthenticated && !appointmentId) {
      toast({
        title: "Erreur",
        description: "Aucun rendez-vous spécifié",
        variant: "destructive"
      });
      router.push('/dashboard');
    }
  }, [appointmentId, isAuthenticated, authLoading]);

  const fetchAppointmentDetails = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointment(data.data);
      } else {
        throw new Error('Impossible de récupérer les détails du rendez-vous');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du rendez-vous",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDoctorInitials = (doctorName: string): string => {
    if (!doctorName) return 'DR';
    const names = doctorName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase() + 'R';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getAppointmentTypeLabel = (type: string): string => {
    const types: { [key: string]: string } = {
      'consultation': 'Consultation',
      'follow_up': 'Suivi',
      'emergency': 'Urgence',
      'routine_checkup': 'Contrôle'
    };
    return types[type] || type;
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner un moyen de paiement",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      if (!token) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour effectuer un paiement",
          variant: "destructive"
        });
        return;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/appointments/${appointmentId}/pay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_method: selectedPaymentMethod
        })
      });

      if (response.ok) {
        toast({
          title: "Paiement réussi",
          description: "Votre paiement a été traité avec succès",
        });
        router.push('/dashboard?payment=success');
      } else {
        throw new Error('Échec du paiement');
      }
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full animate-pulse"></div>
          </div>
          <p className="text-slate-600 font-medium">
            {authLoading ? 'Vérification de l\'authentification...' : 'Chargement des détails du paiement...'}
          </p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-slate-600 font-medium">Rendez-vous introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header compact */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
              className="hover:bg-white/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div className="text-center flex-1 mx-4">
              <h1 className="text-xl font-bold text-slate-900">Règlement</h1>
              <p className="text-sm text-slate-600">Paiement sécurisé</p>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Card englobante élégante */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Card de gauche - Récapitulatif compact */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 border-r border-slate-200/50">
                <div className="space-y-4">
                  {/* En-tête docteur avec glassmorphisme */}
                   <div className="relative bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-md p-4 rounded-xl text-white border border-white/20 shadow-xl">
                     <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"></div>
                     <div className="relative flex items-center gap-3">
                       <Avatar className="w-12 h-12 border-2 border-white/40 shadow-lg">
                         <AvatarImage src="/doctor.png" alt="Doctor" />
                         <AvatarFallback className="bg-white/30 text-white font-bold text-sm">
                           {getDoctorInitials(appointment.doctor.first_name + ' ' + appointment.doctor.last_name)}
                         </AvatarFallback>
                       </Avatar>
                       <div className="flex-1 min-w-0">
                         <h3 className="font-bold text-lg leading-tight truncate drop-shadow-sm">
                           Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                         </h3>
                         <div className="flex items-center gap-2 mt-1">
                           {(() => {
                              // Les spécialisations sont stockées sous forme de tableau JSON
                              let specializations = [];
                              if (appointment.doctor.specialization) {
                                if (Array.isArray(appointment.doctor.specialization)) {
                                  specializations = appointment.doctor.specialization;
                                } else if (typeof appointment.doctor.specialization === 'string') {
                                  try {
                                    specializations = JSON.parse(appointment.doctor.specialization);
                                  } catch {
                                    specializations = [appointment.doctor.specialization];
                                  }
                                }
                              }
                              
                              const primarySpecialization = specializations[0] || 'Médecin généraliste';
                              const additionalCount = specializations.length - 1;
                              
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-100 text-sm font-medium">{primarySpecialization}</span>
                                  {additionalCount > 0 && (
                                    <Badge className="bg-white/20 text-white border-white/30 text-xs px-2 py-0.5 h-5">
                                      +{additionalCount} spécialité{additionalCount > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>
                              );
                            })()}
                         </div>
                       </div>
                     </div>
                   </div>

                  {/* Détails compacts */}
                   <div className="space-y-3">
                     <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                         <Calendar className="w-3 h-3 text-blue-600" />
                       </div>
                       <div>
                         <p className="text-xs text-slate-500 uppercase tracking-wide">Date</p>
                         <p className="font-semibold text-slate-900 text-sm">{formatDate(appointment.appointment_date)}</p>
                       </div>
                     </div>

                     <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                         <User className="w-3 h-3 text-purple-600" />
                       </div>
                       <div>
                         <p className="text-xs text-slate-500 uppercase tracking-wide">Type</p>
                         <Badge variant="secondary" className="text-xs h-5">
                           {getAppointmentTypeLabel(appointment.appointment_type)}
                         </Badge>
                       </div>
                     </div>

                     {appointment.appointment_type === 'presentiel' && appointment.location && (
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                           <MapPin className="w-3 h-3 text-green-600" />
                         </div>
                         <div className="min-w-0 flex-1">
                           <p className="text-xs text-slate-500 uppercase tracking-wide">Lieu</p>
                           <p className="font-medium text-slate-900 text-sm truncate">{appointment.location}</p>
                         </div>
                       </div>
                     )}

                     {appointment.reason_for_visit && (
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                           <Clock className="w-3 h-3 text-amber-600" />
                         </div>
                         <div className="min-w-0 flex-1">
                           <p className="text-xs text-slate-500 uppercase tracking-wide">Raison</p>
                           <p className="font-medium text-slate-900 text-sm truncate">{appointment.reason_for_visit}</p>
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Montant en bas avec typographie visible */}
                   <div className="mt-6 pt-4 border-t border-slate-200">
                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                       <div className="text-center">
                         <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Montant à payer</p>
                         <p className="text-3xl font-bold text-green-600">
                           {appointment?.consultation_fee?.toLocaleString()}
                           <span className="text-lg font-semibold ml-1">FCFA</span>
                         </p>
                       </div>
                     </div>
                   </div>
                </div>
              </div>

              {/* Card de droite - Moyens de paiement compacts */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-3 h-3 text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Moyens de paiement</h2>
                  </div>

                  <div className="space-y-2">
                    {paymentMethods.map((method) => {
                      const isSelected = selectedPaymentMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          className={`relative p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-md'
                              : 'bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm'
                          } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center text-white shadow-sm`}>
                              {method.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900 text-sm truncate">{method.name}</h3>
                                {isSelected && (
                                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 truncate">{method.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bouton de paiement compact */}
                  <div className="mt-6 space-y-3">
                    <Button 
                      onClick={handlePayment}
                      disabled={!selectedPaymentMethod || processing}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {processing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span className="text-sm">Traitement...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          <span>Payer {appointment?.consultation_fee?.toLocaleString()} FCFA</span>
                        </div>
                      )}
                    </Button>

                    <div className="text-center">
                      <div className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        <Shield className="w-3 h-3 text-green-500" />
                        <span>Paiement sécurisé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}