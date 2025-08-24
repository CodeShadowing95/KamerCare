"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Phone,
  Mail,
  Heart,
  Shield,
  Clock,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import { Footer, HeroBanner, CommentCaMarche, ServiceSpecialites, HopitauxParRegion, Engagements, PrendreRDV } from "@/components/landing-page-sections"

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false)
  const [language, setLanguage] = useState("fr")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedHospital, setSelectedHospital] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")

  const regions = [
    { id: "adamaoua", name: "Adamaoua" },
    { id: "centre", name: "Centre" },
    { id: "est", name: "Est" },
    { id: "extreme-nord", name: "Extrême-Nord" },
    { id: "littoral", name: "Littoral" },
    { id: "nord-ouest", name: "Nord-Ouest" },
    { id: "ouest", name: "Ouest" },
    { id: "sud", name: "Sud" },
    { id: "sud-ouest", name: "Sud-Ouest" },
    { id: "autres", name: "Autres" },
  ]

  const hospitals = [
    {
      id: 1,
      name: "Hôpital Central de Yaoundé",
      city: "Yaoundé",
      region: "Centre",
      services: ["Urgences 24/7", "Chirurgie", "Maternité", "Cardiologie", "Neurologie"],
      rating: 4.2,
      phone: "+237 222 23 40 29",
      address: "Avenue Henri Dunant, Yaoundé",
      coordinates: { lat: 3.8480, lng: 11.5021 }
    },
    {
      id: 2,
      name: "Hôpital Laquintinie",
      city: "Douala",
      region: "Littoral",
      services: ["Urgences 24/7", "Pédiatrie", "Cardiologie", "Orthopédie"],
      rating: 4.0,
      phone: "+237 233 42 24 69",
      address: "Boulevard de la Liberté, Douala",
      coordinates: { lat: 4.0511, lng: 9.7679 }
    },
    {
      id: 3,
      name: "Hôpital Régional de Bafoussam",
      city: "Bafoussam",
      region: "Ouest",
      services: ["Médecine générale", "Gynécologie", "Pédiatrie"],
      rating: 3.8,
      phone: "+237 244 44 12 34",
      address: "Rue de l'Hôpital, Bafoussam",
      coordinates: { lat: 5.4781, lng: 10.4167 }
    },
    {
      id: 4,
      name: "Hôpital Régional de Garoua",
      city: "Garoua",
      region: "Nord",
      services: ["Urgences", "Chirurgie", "Maternité", "Ophtalmologie"],
      rating: 3.9,
      phone: "+237 222 27 15 82",
      address: "Quartier Plateau, Garoua",
      coordinates: { lat: 9.3265, lng: 13.3958 }
    },
    {
      id: 5,
      name: "Hôpital Régional de Maroua",
      city: "Maroua",
      region: "Extrême-Nord",
      services: ["Médecine générale", "Pédiatrie", "Gynécologie"],
      rating: 3.7,
      phone: "+237 229 29 12 45",
      address: "Avenue de la République, Maroua",
      coordinates: { lat: 10.5913, lng: 14.3153 }
    },
    {
      id: 6,
      name: "Hôpital de District de Dschang",
      city: "Dschang",
      region: "Ouest",
      services: ["Médecine générale", "Maternité", "Laboratoire"],
      rating: 3.6,
      phone: "+237 233 45 12 78",
      address: "Centre-ville, Dschang",
      coordinates: { lat: 5.4444, lng: 10.0594 }
    },
    {
      id: 7,
      name: "Hôpital de Référence de Bertoua",
      city: "Bertoua",
      region: "Est",
      services: ["Urgences", "Chirurgie", "Radiologie", "Pharmacie"],
      rating: 3.8,
      phone: "+237 222 24 31 67",
      address: "Quartier Administratif, Bertoua",
      coordinates: { lat: 4.5774, lng: 13.6848 }
    },
    {
      id: 8,
      name: "Hôpital Régional de Bamenda",
      city: "Bamenda",
      region: "Nord-Ouest",
      services: ["Urgences 24/7", "Cardiologie", "Neurologie", "Oncologie"],
      rating: 4.1,
      phone: "+237 233 36 24 89",
      address: "Hospital Street, Bamenda",
      coordinates: { lat: 5.9597, lng: 10.1453 }
    },
    {
      id: 9,
      name: "Hôpital de District de Buea",
      city: "Buea",
      region: "Sud-Ouest",
      services: ["Médecine générale", "Pédiatrie", "Dermatologie"],
      rating: 3.9,
      phone: "+237 233 32 45 67",
      address: "Government Station, Buea",
      coordinates: { lat: 4.1560, lng: 9.2649 }
    },
    {
      id: 10,
      name: "Hôpital Régional d'Ebolowa",
      city: "Ebolowa",
      region: "Sud",
      services: ["Urgences", "Maternité", "Laboratoire", "Pharmacie"],
      rating: 3.7,
      phone: "+237 222 28 34 56",
      address: "Avenue Nkol-Eton, Ebolowa",
      coordinates: { lat: 2.9156, lng: 11.1543 }
    },
    {
      id: 11,
      name: "Hôpital de District de Kribi",
      city: "Kribi",
      region: "Sud",
      services: ["Médecine générale", "Urgences", "Maternité"],
      rating: 3.5,
      phone: "+237 243 46 12 89",
      address: "Quartier Bord de Mer, Kribi",
      coordinates: { lat: 2.9373, lng: 9.9073 }
    },
    {
      id: 12,
      name: "Hôpital de Référence de Ngaoundéré",
      city: "Ngaoundéré",
      region: "Adamaoua",
      services: ["Urgences 24/7", "Chirurgie", "Cardiologie", "Radiologie"],
      rating: 4.0,
      phone: "+237 222 25 67 89",
      address: "Quartier Administratif, Ngaoundéré",
      coordinates: { lat: 7.3167, lng: 13.5833 }
    }
  ]

  const specialties = [
    "Médecine générale",
    "Pédiatrie",
    "Gynécologie-Obstétrique",
    "Chirurgie",
    "Ophtalmologie",
    "ORL",
    "Cardiologie",
    "Dermatologie",
  ]

  const texts = {
    fr: {
      title: "Prenez rendez-vous à l'hôpital public, en quelques clics",
      subtitle: "Service gratuit et sécurisé du Ministère de la Santé Publique du Cameroun",
      searchPlaceholder: "Rechercher un hôpital ou une spécialité...",
      bookAppointment: "Prendre RDV",
      howItWorks: "Comment ça marche",
      step1: "Chercher un hôpital",
      step2: "Choisir un créneau",
      step3: "Recevoir la confirmation",
      services: "Services & Spécialités",
      hospitals: "Hôpitaux par région",
      advantages: "Nos engagements",
      testimonials: "Témoignages",
      faq: "Questions fréquentes",
      createAccount: "Créer mon compte patient",
      login: "Se connecter",
    },
    en: {
      title: "Book your public hospital appointment in just a few clicks",
      subtitle: "Free and secure service from Cameroon's Ministry of Public Health",
      searchPlaceholder: "Search for a hospital or specialty...",
      bookAppointment: "Book Appointment",
      howItWorks: "How it works",
      step1: "Find a hospital",
      step2: "Choose a time slot",
      step3: "Get confirmation",
      services: "Services & Specialties",
      hospitals: "Hospitals by region",
      advantages: "Our commitments",
      testimonials: "Testimonials",
      faq: "Frequently asked questions",
      createAccount: "Create patient account",
      login: "Sign in",
    },
  }

  const t = texts[language as keyof typeof texts]

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr")
  }

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      {/* Header */}
      <Navbar
        isDark={isDark}
        language={language}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
      />



      {/* Hero Section */}
      <HeroBanner
        language={language as 'fr' | 'en'}
        selectedRegion={selectedRegion}
        selectedCity={selectedCity}
        selectedHospital={selectedHospital}
        selectedSpecialty={selectedSpecialty}
        setSelectedRegion={setSelectedRegion}
        setSelectedCity={setSelectedCity}
        setSelectedHospital={setSelectedHospital}
        setSelectedSpecialty={setSelectedSpecialty}
        regions={regions}
        hospitals={hospitals}
        specialties={specialties}
      />

      {/* How it works */}
      <CommentCaMarche language={language as 'fr' | 'en'} />

      {/* Services & Specialties */}
      <ServiceSpecialites language={language as 'fr' | 'en'} />

      {/* Hospitals by Region */}
      <HopitauxParRegion hospitals={hospitals} language={language as 'fr' | 'en'} />

      {/* Our Commitments */}
      <Engagements language={language as 'fr' | 'en'} />

      {/* Ready to Book CTA */}
      <PrendreRDV language={language as 'fr' | 'en'} />

      {/* Footer */}
      <Footer language={language as 'fr' | 'en'} />
    </div>
  )
}
