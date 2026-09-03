"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  HeartPulse,
  ShieldCheck,
  Building2,
  Home,
  IndianRupee,
  MapPin,
  Search,
  Utensils,
  Pill,
  AlertTriangle,
  PhoneCall,
  Activity,
  Bed,
  CheckCircle2,
  Globe,
  Radio,
  Ticket,
  Printer,
  X,
  QrCode,
  Volume2,
  VolumeX,
  Cpu,
  TrendingDown,
  Navigation,
  Loader2,
  Layers,
} from "lucide-react";

interface BedAvailability {
  generalAvailable: number;
  generalTotal: number;
  icuAvailable: number;
  icuTotal: number;
  lastUpdatedMinutesAgo: number;
}

interface Hospital {
  id: string;
  name: string;
  districtOrTown: string;
  state: string;
  tier: string;
  specialties: string[];
  ayushmanEmpanelled: boolean;
  bplQuota: boolean;
  estCostRange: string;
  baseCost: number;
  contact: string;
  liveBeds: BedAvailability;
}

interface Shelter {
  id: string;
  name: string;
  hospitalNearby: string;
  districtOrTown: string;
  state: string;
  type: "Dharamshala / Vishram Sadan" | "Gurudwara Sarai" | "Red Cross / NGO Home";
  tariffPerNight: number;
  hasPatientKitchen: boolean;
  wheelchairAccessible: boolean;
  distanceKm: number;
  contact: string;
  bedsAvailable: number;
}

interface ProcedureCost {
  name: string;
  pmjayRate: string;
  privateCost: string;
  code: string;
}

const DEFAULT_APEX_HOSPITALS: Hospital[] = [
  {
    id: "aiims-delhi",
    name: "All India Institute of Medical Sciences (AIIMS)",
    districtOrTown: "New Delhi (Ansari Nagar)",
    state: "Delhi NCR",
    tier: "Apex National (AIIMS)",
    specialties: ["Oncology (Cancer)", "Cardiology", "Pediatric Surgery", "Orthopedics", "Nephrology"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free to ₹1,000 (Govt Subsidized)",
    baseCost: 0,
    contact: "011-26588500",
    liveBeds: { generalAvailable: 28, generalTotal: 2478, icuAvailable: 3, icuTotal: 240, lastUpdatedMinutesAgo: 4 },
  },
  {
    id: "pgimer-chandigarh",
    name: "Postgraduate Institute of Medical Education & Research (PGIMER)",
    districtOrTown: "Chandigarh (Sector 12)",
    state: "Punjab & Haryana",
    tier: "Apex National (AIIMS)",
    specialties: ["Cardiology", "Nephrology", "Neurology", "Pediatric Care"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free under PM-JAY / Nominal OPD",
    baseCost: 20,
    contact: "0172-2746018",
    liveBeds: { generalAvailable: 41, generalTotal: 1948, icuAvailable: 5, icuTotal: 180, lastUpdatedMinutesAgo: 8 },
  },
  {
    id: "bhu-ims-varanasi",
    name: "Sir Sunderlal Hospital, IMS Banaras Hindu University (BHU)",
    districtOrTown: "Varanasi (Purvanchal Gateway)",
    state: "Uttar Pradesh",
    tier: "State Medical College",
    specialties: ["Cardiology", "Oncology (Cancer)", "General Surgery", "Orthopedics"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free under PM-JAY / ₹50 OPD",
    baseCost: 50,
    contact: "0542-2307500",
    liveBeds: { generalAvailable: 64, generalTotal: 1500, icuAvailable: 8, icuTotal: 110, lastUpdatedMinutesAgo: 12 },
  },
  {
    id: "aiims-gorakhpur",
    name: "AIIMS Gorakhpur (Serving Rural UP & Bihar Border)",
    districtOrTown: "Gorakhpur (Kunraghat)",
    state: "Uttar Pradesh",
    tier: "Apex National (AIIMS)",
    specialties: ["Pediatric Surgery", "Orthopedics", "Nephrology", "General Medicine"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free / 100% Cashless PM-JAY",
    baseCost: 0,
    contact: "0551-2205501",
    liveBeds: { generalAvailable: 52, generalTotal: 750, icuAvailable: 6, icuTotal: 60, lastUpdatedMinutesAgo: 6 },
  },
  {
    id: "aiims-patna",
    name: "AIIMS Patna (Phulwari Sharif)",
    districtOrTown: "Patna / Central Rural Bihar",
    state: "Bihar",
    tier: "Apex National (AIIMS)",
    specialties: ["Oncology (Cancer)", "Cardiology", "Pediatric Surgery", "Nephrology"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free / 100% PM-JAY Coverage",
    baseCost: 0,
    contact: "0612-2451006",
    liveBeds: { generalAvailable: 34, generalTotal: 960, icuAvailable: 2, icuTotal: 90, lastUpdatedMinutesAgo: 15 },
  },
];

const DEFAULT_SHELTERS: Shelter[] = [
  {
    id: "aiims-vishram",
    name: "AIIMS Powergrid Vishram Sadan",
    hospitalNearby: "AIIMS New Delhi",
    districtOrTown: "New Delhi",
    state: "Delhi NCR",
    type: "Dharamshala / Vishram Sadan",
    tariffPerNight: 50,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 0.3,
    contact: "Ground Desk Counter 4",
    bedsAvailable: 14,
  },
  {
    id: "bangla-sahib",
    name: "Gurudwara Shri Bangla Sahib Yatri Sarai",
    hospitalNearby: "Dr. RML / Safdarjung Hospital",
    districtOrTown: "New Delhi",
    state: "Delhi NCR",
    type: "Gurudwara Sarai",
    tariffPerNight: 0,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 3.1,
    contact: "DSGMC Reception Desk",
    bedsAvailable: 28,
  },
  {
    id: "marwari-sewa-varanasi",
    name: "Marwari Sewa Sangh Vishram Sadan",
    hospitalNearby: "Sir Sunderlal Hospital (BHU)",
    districtOrTown: "Varanasi",
    state: "Uttar Pradesh",
    type: "Dharamshala / Vishram Sadan",
    tariffPerNight: 40,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 0.9,
    contact: "Lanka Gate Desk",
    bedsAvailable: 19,
  },
];

const STANDARD_PROCEDURES: ProcedureCost[] = [
  { name: "Cataract Surgery with IOL", pmjayRate: "₹9,000 (Cashless)", privateCost: "₹28,000 - ₹45,000", code: "PMJAY-OPH-01" },
  { name: "Normal Delivery & Care", pmjayRate: "₹9,000 (Cashless)", privateCost: "₹25,000 - ₹50,000", code: "PMJAY-OBS-04" },
  { name: "Cesarean Section (C-Section)", pmjayRate: "₹14,000 (Cashless)", privateCost: "₹55,000 - ₹95,000", code: "PMJAY-OBS-09" },
  { name: "Hemodialysis (Per Session)", pmjayRate: "₹1,500 (Cashless)", privateCost: "₹3,500 - ₹5,500", code: "PMJAY-NEP-02" },
  { name: "Coronary Angioplasty (with Stent)", pmjayRate: "₹45,000 (Cashless)", privateCost: "₹1,40,000 - ₹2,20,000", code: "PMJAY-CAR-11" },
  { name: "Total Knee Replacement", pmjayRate: "₹85,000 (Cashless)", privateCost: "₹2,10,000 - ₹3,50,000", code: "PMJAY-ORT-18" },
];

export default function AarogyaNiwasPage() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasAyushmanCard, setHasAyushmanCard] = useState<boolean>(true);
  const [maxBudget, setMaxBudget] = useState<number>(3000);
  const [stayDurationDays, setStayDurationDays] = useState<number>(7);

  // Dynamic Live Query States
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);
  const [localHospitals, setLocalHospitals] = useState<Hospital[]>([]);
  const [localShelter, setLocalShelter] = useState<Shelter | null>(null);
  const [matchedLocation, setMatchedLocation] = useState<string | null>(null);

  // Live Hardware Telemetry States
  const [iotHeartRate, setIotHeartRate] = useState<number>(74);
  const [iotSpO2, setIotSpO2] = useState<number>(98);
  const [iotRoomTemp, setIotRoomTemp] = useState<number>(24.5);
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);
  const [bedLabel, setBedLabel] = useState<string>("Bed #14 (Vishram Sadan)");

  // Modals
  const [activeBookingShelter, setActiveBookingShelter] = useState<Shelter | null>(null);
  const [patientName, setPatientName] = useState<string>("Ramesh Kumar");
  const [abhaNumber, setAbhaNumber] = useState<string>("ABHA-9821-4412-9011");
  const [tokenGenerated, setTokenGenerated] = useState<string | null>(null);
  const [showHardwareModal, setShowHardwareModal] = useState<boolean>(false);

  // Audio Context Ref
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Live Pan-India Query Trigger
  useEffect(() => {
    const timer = setTimeout(async () => {
      const q = searchTerm.trim();
      if (q.length >= 3) {
        setIsSearchingLive(true);
        try {
          const res = await fetch(`/api/hospitals-live?q=${encodeURIComponent(q)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.hospitals && data.hospitals.length > 0) {
              setLocalHospitals(data.hospitals);
              setLocalShelter(data.shelter || null);
              setMatchedLocation(data.searchedLocation || q);
            }
          }
        } catch {
          // Fallback handled
        } finally {
          setIsSearchingLive(false);
        }
      } else {
        setLocalHospitals([]);
        setLocalShelter(null);
        setMatchedLocation(null);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const playEmergencyBuzzer = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio autoplay restrictions
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/telemetry");
        if (res.ok) {
          const data = await res.json();
          if (data.heartRate !== undefined) setIotHeartRate(data.heartRate);
          if (data.spO2 !== undefined) setIotSpO2(data.spO2);
          if (data.roomTemp !== undefined) setIotRoomTemp(data.roomTemp);
          if (data.bedId) setBedLabel(data.bedId);

          if (data.sosTriggered !== undefined) {
            setSosTriggered(data.sosTriggered);
            if (data.sosTriggered) playEmergencyBuzzer();
          }
        }
      } catch {
        // API offline
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Merge Display Hospitals
  const displayHospitals = useMemo(() => {
    if (localHospitals.length > 0) return localHospitals;
    return DEFAULT_APEX_HOSPITALS;
  }, [localHospitals]);

  // Merge Display Shelters
  const displayShelters = useMemo(() => {
    if (localShelter) return [localShelter, ...DEFAULT_SHELTERS];
    return DEFAULT_SHELTERS;
  }, [localShelter]);

  const triggerSosSimulation = async () => {
    playEmergencyBuzzer();
    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heartRate: 124, spO2: 93, roomTemp: 25.2, sosTriggered: true }),
      });
    } catch {
      setSosTriggered(true);
    }
  };

  const clearSosAlert = async () => {
    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heartRate: 74, spO2: 98, roomTemp: 24.5, sosTriggered: false }),
      });
    } catch {
      setSosTriggered(false);
    }
  };

  const handleGenerateToken = (shelter: Shelter) => {
    const token = `AN-${shelter.id.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setTokenGenerated(token);
  };

  const t = {
    title: lang === "en" ? "AarogyaNiwas" : "आरोग्य निवास",
    tagline:
      lang === "en"
        ? "Universal Rural Patient Transit, Lodging & Bedside Telemetry Network"
        : "ग्रामीण मरीज पारगमन, विश्राम एवं बेडसाइड टेलीमेट्री नेटवर्क",
    badge:
      lang === "en"
        ? "Covering All 800+ Districts & Villages in India • PM-JAY Fixed Pricing"
        : "भारत के सभी 800+ जिलों और गांवों का कवरेज • PM-JAY निर्धारित दरें",
    heroH1: lang === "en" ? "Universal Healthcare" : "सुलभ एवं सार्वभौमिक स्वास्थ्य",
    heroSub:
      lang === "en"
        ? "Dignified Stays for Villages & Small Towns"
        : "गांवों और छोटे कस्बों के मरीजों के लिए सम्मानजनक विश्राम",
    heroP:
      lang === "en"
        ? "Type ANY Indian district, town, block, or village. Discover your local District Referral Hospital, Community Health Centre, Ayushman procedure costs, and subsidized Vishram Sadans."
        : "भारत का कोई भी जिला, कस्बा, ब्लॉक या गांव खोजें। अपना स्थानीय जिला अस्पताल, सामुदायिक स्वास्थ्य केंद्र, आयुष्मान उपचार पैकेज और रियायती विश्राम सदन देखें।",
    searchPlaceholder:
      lang === "en"
        ? "Type ANY Indian District, Village, Town, or Pincode (e.g., Sultanpur, Darbhanga, 201310, Alwar)..."
        : "भारत का कोई भी जिला, गांव, शहर या पिनकोड दर्ज करें (जैसे: सुल्तानपुर, दरभंगा, 201310)...",
    hospitalColTitle:
      lang === "en" ? "Matched Hospitals & Health Centres" : "संबद्ध अस्पताल एवं स्वास्थ्य केंद्र",
    shelterColTitle:
      lang === "en" ? "Subsidized Vishram Sadans & Sarais" : "सत्यापित रियायती विश्राम सदन",
    preBookBtn: lang === "en" ? "Pre-Book Bed" : "बिस्तर आरक्षित करें",
    procedureHeader:
      lang === "en" ? "Ayushman Bharat (PM-JAY) Treatment Cost Comparison" : "आयुष्मान भारत (PM-JAY) उपचार दर तुलना",
  };

  const sampleAvgTariff = displayShelters[0]?.tariffPerNight ?? 50;
  const stayCost = sampleAvgTariff * stayDurationDays;
  const commercialHotelCost = 1500 * stayDurationDays;
  const genericMedsCost = 450;
  const commercialMedsCost = 2800;
  const totalOutPocket = stayCost + genericMedsCost;
  const totalCommercial = commercialHotelCost + commercialMedsCost;
  const netSaved = totalCommercial - totalOutPocket;
  const percentSaved = Math.round((netSaved / totalCommercial) * 100);

  return (
    <div className="min-h-screen bg-[#090d0b] text-[#f4f1ea] antialiased selection:bg-emerald-800 selection:text-white pb-12">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-10">
        
        {/* Responsive Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-6 sm:py-4 rounded-2xl bg-[#131916]/90 border border-white/10 backdrop-blur-md shadow-2xl gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                  {t.title}
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {lang === "en" ? "आरोग्य निवास" : "AarogyaNiwas"}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/50 truncate max-w-[240px] sm:max-w-none">
                {t.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowHardwareModal(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition"
            >
              <Cpu className="h-3.5 w-3.5 text-sky-400" /> Circuit Pinout
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute Siren" : "Unmute Siren"}
              className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-rose-400" />}
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold transition"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span>{lang === "en" ? "हिंदी" : "English"}</span>
            </button>
            <a
              href="#iot-hub"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-bold transition shadow-lg shadow-emerald-900/40 shrink-0"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" /> IoT Hub
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-4 sm:py-6 space-y-2.5 max-w-3xl mx-auto px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t.badge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal leading-tight">
            {t.heroH1} <br />
            <span className="italic text-emerald-400 font-light block sm:inline mt-1 sm:mt-0">
              {t.heroSub}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
            {t.heroP}
          </p>
        </section>

        {/* Universal Pan-India Search Bar */}
        <div className="max-w-2xl mx-auto px-1 space-y-2">
          <div className="relative">
            {isSearchingLive ? (
              <Loader2 className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-400 animate-spin" />
            ) : (
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-400" />
            )}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#131916] text-white text-xs sm:text-sm pl-10 pr-12 py-3 rounded-xl sm:rounded-2xl border border-white/20 focus:border-emerald-500 outline-none shadow-2xl transition placeholder-white/40"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setLocalHospitals([]);
                  setLocalShelter(null);
                  setMatchedLocation(null);
                }}
                className="absolute right-3.5 top-3 text-[11px] text-white/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {matchedLocation && (
            <div className="flex items-center gap-1.5 text-xs text-sky-400 px-2 font-mono">
              <Navigation className="h-3.5 w-3.5" />
              <span>Resolved Location: <b>{matchedLocation}</b> — Health Infrastructure Mapped</span>
            </div>
          )}
        </div>

        {/* Economic Ledger Bar */}
        <section className="bg-gradient-to-r from-emerald-950/40 via-[#131916] to-sky-950/30 p-4 sm:p-5 rounded-2xl border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Economic Equity Metrics ({stayDurationDays}-Day Treatment Stay)
              </span>
              <div className="text-xs sm:text-sm font-semibold text-white">
                Family Lodging & Generic Medicine Savings
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 text-xs border-t border-white/5 sm:border-t-0 pt-2 sm:pt-0">
            <div>
              <span className="text-white/40 block text-[9px] uppercase">Private Lodging & MRP</span>
              <span className="line-through text-white/60 font-mono text-xs">₹{totalCommercial.toLocaleString("en-IN")}</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[9px] uppercase font-bold">AarogyaNiwas + Jan Aushadhi</span>
              <span className="text-emerald-300 font-mono text-sm font-bold">₹{totalOutPocket.toLocaleString("en-IN")}</span>
            </div>
            <div className="bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 shrink-0">
              <span className="text-emerald-300 font-bold text-[11px]">₹{netSaved.toLocaleString("en-IN")} ({percentSaved}%) Saved</span>
            </div>
          </div>
        </section>

        {/* Results Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Hospital Matches */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-white">
                  {t.hospitalColTitle}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-white/50">
                {displayHospitals.length} Found {localHospitals.length > 0 ? "(Local District Hierarchy)" : "(Apex Directory)"}
              </span>
            </div>

            {displayHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#131916] border border-white/10 hover:border-emerald-500/50 transition shadow-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {hosp.tier}
                      </span>
                      {hosp.ayushmanEmpanelled && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          PM-JAY 100% Cashless
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                      {hosp.name}
                    </h4>
                    <p className="text-[11px] text-white/60 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-white/40 shrink-0" />
                      <span>{hosp.districtOrTown} • <b>{hosp.state}</b></span>
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0 bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <span className="text-[9px] uppercase text-white/40 block">Hospital Cost</span>
                    <span className="font-mono text-xs font-bold text-emerald-300">
                      {hosp.estCostRange}
                    </span>
                  </div>
                </div>

                {/* Live Bed Telemetry Strip */}
                <div className="p-2.5 rounded-xl bg-[#18201c] border border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Bed className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-white/40 block uppercase">General Beds</span>
                      <span className="font-mono font-bold text-white text-xs">
                        {hosp.liveBeds.generalAvailable} / {hosp.liveBeds.generalTotal}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-white/40 block uppercase">ICU / HDU Beds</span>
                      <span className="font-mono font-bold text-rose-300 text-xs">
                        {hosp.liveBeds.icuAvailable} / {hosp.liveBeds.icuTotal}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-1.5 border-t sm:border-t-0 border-white/5 pt-1.5 sm:pt-0">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sync: {hosp.liveBeds.lastUpdatedMinutesAgo}m ago
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {hosp.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-medium px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2 border-t border-white/5 text-[11px]">
                  <span className="text-white/50 font-mono text-[10px] sm:text-[11px]">Contact: {hosp.contact}</span>
                  <a
                    href={`tel:${hosp.contact}`}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold text-xs"
                  >
                    <PhoneCall className="h-3 w-3" /> Call Hospital Desk
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Subsidized Shelters */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <Home className="h-4 w-4 text-sky-400 shrink-0" />
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-white">
                  {t.shelterColTitle}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-white/50">
                {displayShelters.length} Available
              </span>
            </div>

            {displayShelters.map((shelter) => {
              const totalStayCost = shelter.tariffPerNight * stayDurationDays;
              return (
                <div
                  key={shelter.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#131916] border border-white/10 hover:border-sky-500/50 transition shadow-xl space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400">
                        {shelter.type}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-white mt-0.5">
                        {shelter.name}
                      </h4>
                      <p className="text-[11px] text-white/60">
                        Near {shelter.hospitalNearby} ({shelter.distanceKm} km)
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0 bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-xl flex sm:block justify-between items-center">
                      <span className="text-xs font-mono font-bold text-sky-300">
                        {shelter.tariffPerNight === 0 ? "FREE / Langar" : `₹${shelter.tariffPerNight}/night`}
                      </span>
                      <span className="text-[9px] text-white/40 font-mono block">
                        {stayDurationDays}d Total: ₹{totalStayCost}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[9px] text-white/80">
                    {shelter.hasPatientKitchen && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        <Utensils className="h-2.5 w-2.5" /> Communal Kitchen
                      </span>
                    )}
                    {shelter.wheelchairAccessible && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Ramp Access
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/60 font-mono">
                      {shelter.bedsAvailable} Beds Vacant
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-white/50 pt-2 border-t border-white/5">
                    <span className="truncate max-w-[140px]">{shelter.contact}</span>
                    <button
                      onClick={() => {
                        setActiveBookingShelter(shelter);
                        setTokenGenerated(null);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 text-xs font-bold transition shrink-0"
                    >
                      <Ticket className="h-3 w-3" /> {t.preBookBtn}
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-600/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase">
                <Pill className="h-3.5 w-3.5" /> PM Jan Aushadhi Generic Network
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Generic drug dispensaries available at every block and district hospital. Saves 50% to 90% below commercial MRP.
              </p>
            </div>
          </div>
        </div>

        {/* Ayushman Bharat Standard Treatment Cost Table */}
        <section className="bg-[#131916] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Layers className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                Standard Government Health Pricing
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                {t.procedureHeader}
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-white/5 text-white/60 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Medical Procedure / Surgery</th>
                  <th className="p-3">Package Code</th>
                  <th className="p-3 text-emerald-400">Ayushman Bharat (PM-JAY)</th>
                  <th className="p-3 text-rose-400">Typical Private Hospital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#18201c]">
                {STANDARD_PROCEDURES.map((p, i) => (
                  <tr key={i} className="hover:bg-white/5 transition">
                    <td className="p-3 font-medium text-white">{p.name}</td>
                    <td className="p-3 font-mono text-white/50">{p.code}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{p.pmjayRate}</td>
                    <td className="p-3 font-mono text-white/60 line-through">{p.privateCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Live IoT Recovery Hub */}
        <section id="iot-hub" className="bg-[#131916] p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/10 pb-3 sm:pb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Physical Hardware Integration (Live Poller Active)
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                Bedside Recovery & SOS Hub
              </h2>
              <p className="text-[11px] text-white/60">Ultra low-cost ESP32 IoT bedside unit designed for Dharamshalas.</p>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{bedLabel}</span>
            </div>
          </div>

          {sosTriggered && (
            <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-bounce text-red-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    CRITICAL EMERGENCY: ATTENDANT ALERT DISPATCHED
                  </div>
                  <div className="text-[11px]">Bedside Button pressed at Vishram Sadan ({bedLabel}). Audio sounding.</div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[10px] font-mono bg-red-900 px-2 py-0.5 rounded font-bold">Code Red</span>
                <button
                  onClick={clearSosAlert}
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-lg text-white font-semibold transition"
                >
                  Reset Alarm
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-xl bg-[#18201c] border border-white/10 space-y-0.5">
              <div className="text-[9px] uppercase font-bold text-white/50 flex items-center gap-1">
                <HeartPulse className="h-3 w-3 text-rose-500" /> Pulse (BPM)
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white">
                {iotHeartRate} <span className="text-[10px] font-normal text-white/50">bpm</span>
              </div>
              <div className="text-[9px] text-emerald-400 font-medium">Live Telemetry</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18201c] border border-white/10 space-y-0.5">
              <div className="text-[9px] uppercase font-bold text-white/50 flex items-center gap-1">
                <Activity className="h-3 w-3 text-sky-400" /> Oxygen (SpO₂)
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white">{iotSpO2}%</div>
              <div className="text-[9px] text-emerald-400 font-medium">Sensor Input</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18201c] border border-white/10 space-y-0.5">
              <div className="text-[9px] uppercase font-bold text-white/50 flex items-center gap-1">
                <Bed className="h-3 w-3 text-sky-400" /> Room Comfort
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white">{iotRoomTemp}&deg;C</div>
              <div className="text-[9px] text-white/60 font-medium">Ambient Temp</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18201c] border border-white/10 flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="text-[9px] uppercase font-bold text-white/50 mb-1">Hardware Trigger</div>
              <button
                onClick={sosTriggered ? clearSosAlert : triggerSosSimulation}
                className={`w-full py-2 rounded-xl text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-1 ${
                  sosTriggered
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-red-600 hover:bg-red-500 shadow-red-900/40"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {sosTriggered ? "Reset Alarm State" : "Trigger Bedside SOS"}
              </button>
            </div>
          </div>
        </section>

        {/* Modal: Bed Pre-Booking */}
        {activeBookingShelter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#131916] border border-white/20 rounded-2xl p-5 max-w-md w-full shadow-2xl relative space-y-4">
              <button
                onClick={() => setActiveBookingShelter(null)}
                className="absolute right-3.5 top-3.5 text-white/50 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5 text-emerald-400">
                <Ticket className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Bed Requisition Pass
                </span>
              </div>

              {!tokenGenerated ? (
                <div className="space-y-3.5">
                  <div>
                    <h3 className="text-base font-serif font-bold text-white">
                      {activeBookingShelter.name}
                    </h3>
                    <p className="text-[11px] text-white/60">
                      Serving {activeBookingShelter.hospitalNearby} • {activeBookingShelter.tariffPerNight === 0 ? "Free Langar" : `₹${activeBookingShelter.tariffPerNight}/night`}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] text-white/60 block mb-1">Patient Full Name</label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full bg-[#18201c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-white/60 block mb-1">Ayushman PM-JAY / ABHA ID</label>
                      <input
                        type="text"
                        value={abhaNumber}
                        onChange={(e) => setAbhaNumber(e.target.value)}
                        className="w-full bg-[#18201c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerateToken(activeBookingShelter)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    Generate Transit Token
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5 text-center">
                  <div className="p-3.5 bg-[#18201c] border border-white/10 rounded-xl space-y-2 text-left">
                    <div className="flex justify-between items-start border-b border-white/10 pb-2">
                      <div>
                        <span className="text-[9px] text-white/50 uppercase block">Transit Token ID</span>
                        <span className="font-mono text-sm font-bold text-emerald-400">{tokenGenerated}</span>
                      </div>
                      <QrCode className="h-8 w-8 text-emerald-300" />
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-white/50">Patient:</span>
                        <span className="text-white font-semibold">{patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Allocated:</span>
                        <span className="text-sky-300 font-mono font-bold">Dorm-B / Bed #07</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center justify-center gap-1"
                    >
                      <Printer className="h-3 w-3" /> Print
                    </button>
                    <button
                      onClick={() => setActiveBookingShelter(null)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Hardware Schematics */}
        {showHardwareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#131916] border border-white/20 rounded-2xl p-5 max-w-lg w-full shadow-2xl relative space-y-3">
              <button
                onClick={() => setShowHardwareModal(false)}
                className="absolute right-3.5 top-3.5 text-white/50 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5 text-sky-400">
                <Cpu className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  ESP32 Bedside Recovery Hub Circuit Pinout
                </span>
              </div>

              <div className="space-y-2 text-[11px] text-white/80 font-mono bg-[#18201c] p-3 rounded-xl border border-white/10">
                <div className="text-emerald-400 font-bold">// ESP32-WROOM-32 (CP2102)</div>
                <div>• GPIO 04 $\rightarrow$ Tactile SOS Button (Pull-Up)</div>
                <div>• GPIO 18 $\rightarrow$ Active Piezo Buzzer</div>
                <div>• GPIO 21 (SDA) / 22 (SCL) $\rightarrow$ MAX30102 + OLED</div>
                <div>• VIN / GND $\rightarrow$ Regulated 5V Rail</div>
              </div>

              <button
                onClick={() => setShowHardwareModal(false)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Close Schematics
              </button>
            </div>
          </div>
        )}

        <footer className="pt-6 border-t border-white/10 text-center text-[10px] sm:text-xs text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <HeartPulse className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-serif font-bold text-white">AarogyaNiwas</span>
            <span>• SIH 2026</span>
          </div>
          <p>Pan-India Universal Healthcare Transit & Bedside Recovery Network.</p>
        </footer>
      </div>
    </div>
  );
}