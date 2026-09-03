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
  Info,
} from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  districtOrTown: string;
  state: string;
  tier: "Apex National (AIIMS)" | "State Medical College" | "District Hospital / Sub-Divisional";
  specialties: string[];
  ayushmanEmpanelled: boolean;
  bplQuota: boolean;
  estCostRange: string;
  baseCost: number;
  contact: string;
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
}

const EXPANDED_HOSPITALS: Hospital[] = [
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
  },
  {
    id: "bhu-ims-varanasi",
    name: "Sir Sunderlal Hospital, IMS Banaras Hindu University (BHU)",
    districtOrTown: "Varanasi / Purvanchal Rural Belt",
    state: "Uttar Pradesh",
    tier: "State Medical College",
    specialties: ["Cardiology", "Oncology (Cancer)", "General Surgery", "Orthopedics"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free under PM-JAY / ₹50 OPD",
    baseCost: 50,
    contact: "0542-2307500",
  },
  {
    id: "aiims-gorakhpur",
    name: "AIIMS Gorakhpur (Serving Rural UP & Bihar Border)",
    districtOrTown: "Gorakhpur (Kunraghat / Deoria Road)",
    state: "Uttar Pradesh",
    tier: "Apex National (AIIMS)",
    specialties: ["Pediatric Surgery", "Orthopedics", "Nephrology", "General Medicine"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free / 100% Cashless PM-JAY",
    baseCost: 0,
    contact: "0551-2205501",
  },
  {
    id: "sn-medical-agra",
    name: "Sarojini Naidu Medical College & District Referral Unit",
    districtOrTown: "Agra / Mathura Rural Periphery",
    state: "Uttar Pradesh",
    tier: "State Medical College",
    specialties: ["Orthopedics", "Cardiology", "Trauma Care"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Nominal Registration (₹10 - ₹200)",
    baseCost: 10,
    contact: "0562-2260353",
  },
  {
    id: "aiims-patna",
    name: "AIIMS Patna (Phulwari Sharif)",
    districtOrTown: "Patna / Rural Central Bihar",
    state: "Bihar",
    tier: "Apex National (AIIMS)",
    specialties: ["Oncology (Cancer)", "Cardiology", "Pediatric Surgery", "Nephrology"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free / 100% PM-JAY Coverage",
    baseCost: 0,
    contact: "0612-2451006",
  },
  {
    id: "dmch-darbhanga",
    name: "Darbhanga Medical College & Hospital (DMCH)",
    districtOrTown: "Darbhanga / Mithilanchal Rural",
    state: "Bihar",
    tier: "State Medical College",
    specialties: ["General Surgery", "Orthopedics", "Pediatric Care"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free / Nominal Govt Surcharge",
    baseCost: 20,
    contact: "06272-233228",
  },
  {
    id: "aiims-bhopal",
    name: "AIIMS Bhopal (Saket Nagar)",
    districtOrTown: "Bhopal / Bundelkhand Rural",
    state: "Madhya Pradesh",
    tier: "Apex National (AIIMS)",
    specialties: ["Oncology (Cancer)", "Cardiology", "Nephrology", "Burn Care"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free / PM-JAY Empanelled",
    baseCost: 0,
    contact: "0755-2672317",
  },
  {
    id: "gwalior-gr-med",
    name: "Gajra Raja Medical College & J.A. Hospital Group",
    districtOrTown: "Gwalior / Chambal Sub-Divisional",
    state: "Madhya Pradesh",
    tier: "State Medical College",
    specialties: ["Orthopedics", "Cardiology", "Trauma"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free / State Ayushman Portal",
    baseCost: 0,
    contact: "0751-2403200",
  },
  {
    id: "aiims-jodhpur",
    name: "AIIMS Jodhpur (Western Desert & Rural Marwar Hub)",
    districtOrTown: "Jodhpur (Basni / Barmer Link)",
    state: "Rajasthan",
    tier: "Apex National (AIIMS)",
    specialties: ["Cardiology", "Pediatric Surgery", "Oncology (Cancer)", "Nephrology"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free (Chiranjeevi / PM-JAY)",
    baseCost: 0,
    contact: "0291-2740741",
  },
  {
    id: "neigrihms-shillong",
    name: "North Eastern Indira Gandhi Regional Institute (NEIGRIHMS)",
    districtOrTown: "Shillong (Mawdiangdiang / East Khasi Hills)",
    state: "Meghalaya / NER",
    tier: "Apex National (AIIMS)",
    specialties: ["Cardiology", "Nephrology", "General Surgery", "Orthopedics"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free / Subsidized Tribal Health Mission",
    baseCost: 0,
    contact: "0364-2538013",
  },
  {
    id: "gmch-guwahati",
    name: "Gauhati Medical College & Hospital (Bhangagarh)",
    districtOrTown: "Guwahati / Brahmaputra Rural Gateway",
    state: "Assam / NER",
    tier: "State Medical College",
    specialties: ["Oncology (Cancer)", "Cardiology", "Orthopedics", "Burn & Trauma"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free under Atal Amrit / PM-JAY",
    baseCost: 0,
    contact: "0361-2529457",
  },
  {
    id: "aiims-bhubaneswar",
    name: "AIIMS Bhubaneswar (Sijua / Coastal Odisha Rural)",
    districtOrTown: "Bhubaneswar / Khordha Rural",
    state: "Odisha",
    tier: "Apex National (AIIMS)",
    specialties: ["Oncology (Cancer)", "Cardiology", "Nephrology", "Pediatric Surgery"],
    ayushmanEmpanelled: true,
    bplQuota: true,
    estCostRange: "Free / BSKY & PM-JAY Cashless",
    baseCost: 0,
    contact: "0674-2476789",
  },
];

const EXPANDED_SHELTERS: Shelter[] = [
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
  },
  {
    id: "bangla-sahib",
    name: "Gurudwara Shri Bangla Sahib Yatri Sarai",
    hospitalNearby: "Dr. RML / Safdarjung Hospital",
    districtOrTown: "New Delhi (Connaught Place)",
    state: "Delhi NCR",
    type: "Gurudwara Sarai",
    tariffPerNight: 0,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 3.1,
    contact: "DSGMC Reception Desk",
  },
  {
    id: "marwari-sewa-varanasi",
    name: "Marwari Sewa Sangh Marwari Dharamshala",
    hospitalNearby: "Sir Sunderlal Hospital (BHU)",
    districtOrTown: "Varanasi",
    state: "Uttar Pradesh",
    type: "Dharamshala / Vishram Sadan",
    tariffPerNight: 40,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 0.9,
    contact: "Lanka Gate Desk (Varanasi)",
  },
  {
    id: "gorakhpur-redcross",
    name: "Indian Red Cross Society Patient Transit Home",
    hospitalNearby: "AIIMS Gorakhpur",
    districtOrTown: "Gorakhpur",
    state: "Uttar Pradesh",
    type: "Red Cross / NGO Home",
    tariffPerNight: 30,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 0.6,
    contact: "Red Cross District Secretary Desk",
  },
  {
    id: "patna-gurudwara-sarai",
    name: "Takht Sri Patna Sahib Yatri Niwas",
    hospitalNearby: "AIIMS Patna / PMCH",
    districtOrTown: "Patna",
    state: "Bihar",
    type: "Gurudwara Sarai",
    tariffPerNight: 0,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 4.2,
    contact: "Gurudwara Management Office",
  },
  {
    id: "bhopal-vishram-sadan",
    name: "Sudarshan Vishram Sadan (AIIMS Campus)",
    hospitalNearby: "AIIMS Bhopal",
    districtOrTown: "Bhopal",
    state: "Madhya Pradesh",
    type: "Dharamshala / Vishram Sadan",
    tariffPerNight: 50,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 0.2,
    contact: "AIIMS Medical Social Welfare Dept",
  },
  {
    id: "jodhpur-dharamshala",
    name: "Shri Jain Shwetambar Nakoda Teerth Sarai",
    hospitalNearby: "AIIMS Jodhpur",
    districtOrTown: "Jodhpur",
    state: "Rajasthan",
    type: "Dharamshala / Vishram Sadan",
    tariffPerNight: 60,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 1.1,
    contact: "Basni Phase-2 Trust Desk",
  },
  {
    id: "guwahati-cancer-sarai",
    name: "Dr. B. Borooah Cancer Sewa Home",
    hospitalNearby: "Gauhati Medical College / BBCI",
    districtOrTown: "Guwahati",
    state: "Assam / NER",
    type: "Red Cross / NGO Home",
    tariffPerNight: 25,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 0.7,
    contact: "Bhangagarh Reception",
  },
  {
    id: "shillong-redcross",
    name: "Meghalaya Red Cross Patient Shelter",
    hospitalNearby: "NEIGRIHMS Shillong",
    districtOrTown: "Shillong",
    state: "Meghalaya / NER",
    type: "Red Cross / NGO Home",
    tariffPerNight: 35,
    hasPatientKitchen: true,
    wheelchairAccessible: true,
    distanceKm: 0.5,
    contact: "Mawdiangdiang Red Cross Unit",
  },
];

const SPECIALTY_OPTIONS = [
  "All Specialties",
  "Oncology (Cancer)",
  "Cardiology",
  "Pediatric Surgery",
  "Orthopedics",
  "Nephrology",
  "General Surgery",
  "Trauma Care",
];

const STATE_OPTIONS = [
  "All States & Regions",
  "Delhi NCR",
  "Uttar Pradesh",
  "Bihar",
  "Madhya Pradesh",
  "Rajasthan",
  "Assam / NER",
  "Meghalaya / NER",
  "Odisha",
];

export default function AarogyaNiwasPage() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All Specialties");
  const [selectedState, setSelectedState] = useState<string>("All States & Regions");
  const [hasAyushmanCard, setHasAyushmanCard] = useState<boolean>(true);
  const [maxBudget, setMaxBudget] = useState<number>(3000);
  const [stayDurationDays, setStayDurationDays] = useState<number>(7);

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

  // Web Audio Context Ref
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const playEmergencyBuzzer = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

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
      // Autoplay handler catch
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
            if (data.sosTriggered) {
              playEmergencyBuzzer();
            }
          }
        }
      } catch {
        // API offline
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const filteredHospitals = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return EXPANDED_HOSPITALS.filter((h) => {
      const matchQuery =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.districtOrTown.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q) ||
        h.specialties.some((s) => s.toLowerCase().includes(q));

      const matchSpecialty =
        selectedSpecialty === "All Specialties" || h.specialties.includes(selectedSpecialty);
      const matchState = selectedState === "All States & Regions" || h.state === selectedState;
      const matchScheme = hasAyushmanCard ? h.ayushmanEmpanelled : true;
      const matchBudget = hasAyushmanCard ? true : h.baseCost <= maxBudget;

      return matchQuery && matchSpecialty && matchState && matchScheme && matchBudget;
    });
  }, [searchTerm, selectedSpecialty, selectedState, hasAyushmanCard, maxBudget]);

  const filteredShelters = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return EXPANDED_SHELTERS.filter((s) => {
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.districtOrTown.toLowerCase().includes(q) ||
        s.hospitalNearby.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q);

      const matchState = selectedState === "All States & Regions" || s.state === selectedState;
      const totalCost = s.tariffPerNight * stayDurationDays;
      const matchBudget = hasAyushmanCard ? true : totalCost <= maxBudget;

      return matchQuery && matchState && matchBudget;
    });
  }, [searchTerm, selectedState, stayDurationDays, maxBudget, hasAyushmanCard]);

  const triggerSosSimulation = async () => {
    playEmergencyBuzzer();
    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heartRate: 124,
          spO2: 93,
          roomTemp: 25.2,
          sosTriggered: true,
        }),
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
        body: JSON.stringify({
          heartRate: 74,
          spO2: 98,
          roomTemp: 24.5,
          sosTriggered: false,
        }),
      });
    } catch {
      setSosTriggered(false);
    }
  };

  const handleGenerateToken = (shelter: Shelter) => {
    const token = `AN-${shelter.id.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setTokenGenerated(token);
  };

  // Dynamic Translations
  const t = {
    title: lang === "en" ? "AarogyaNiwas" : "आरोग्य निवास",
    tagline:
      lang === "en"
        ? "Rural Patient Transit, Subsidized Hospitality & Bedside Recovery Network"
        : "ग्रामीण मरीज पारगमन, रियायती आवास एवं बेडसाइड रिकवरी नेटवर्क",
    badge:
      lang === "en"
        ? "Rural & Tier-2/3 Patient Access • Ayushman Bharat (PM-JAY) & Free Sarais"
        : "ग्रामीण एवं टीयर-२/३ मरीज सुविधा • आयुष्मान भारत (PM-JAY) एवं निःशुल्क सराय",
    heroH1: lang === "en" ? "Universal Healthcare" : "सुलभ एवं सार्वभौमिक स्वास्थ्य",
    heroSub:
      lang === "en"
        ? "Dignified Stays for Villages & Small Towns"
        : "गांवों और छोटे कस्बों के मरीजों के लिए सम्मानजनक विश्राम",
    heroP:
      lang === "en"
        ? "Eliminating lodging poverty for rural families traveling for tertiary medical care. Pre-book verified Vishram Sadans, find generic Jan Aushadhi pharmacies, and monitor recovery via low-cost IoT."
        : "इलाज के लिए बड़े शहरों में भटकने वाले ग्रामीण परिवारों के लिए सुरक्षित और रियायती विश्राम सदन, जेनेरिक दवा केंद्र एवं कम लागत वाली बेडसाइड आपातकालीन सुविधा।",
    searchPlaceholder:
      lang === "en"
        ? "Search by district, village, city, hospital name, or ailment (e.g., Gorakhpur, Varanasi, Cancer, AIIMS)..."
        : "जिला, गांव, शहर, अस्पताल या बीमारी से खोजें (जैसे: गोरखपुर, वाराणसी, कैंसर, एम्स)...",
    triageHeader:
      lang === "en" ? "Socioeconomic Triage Parameters" : "सामाजिक एवं आर्थिक चयन मापदंड",
    triageSub:
      lang === "en"
        ? "Refine by State, Scheme, or Maximum Family Out-of-Pocket Budget"
        : "राज्य, सरकारी योजना या परिवार के कुल बजट के अनुसार चुनें",
    ayushmanLabel:
      lang === "en"
        ? "Ayushman (PM-JAY) / BPL / EWS Quota"
        : "आयुष्मान भारत (PM-JAY) / बी.पी.एल. / ई.डब्ल्यू.एस. कोटा",
    hospitalColTitle:
      lang === "en" ? "Tertiary & Rural Referral Hospitals" : "उच्च स्तरीय एवं रेफरल अस्पताल",
    shelterColTitle:
      lang === "en" ? "Subsidized Patient Stays" : "सत्यापित रियायती विश्राम सदन",
    preBookBtn: lang === "en" ? "Pre-Book Bed" : "बिस्तर आरक्षित करें",
    iotHubTitle:
      lang === "en"
        ? "AarogyaNiwas Bedside Recovery & SOS Hub"
        : "आरोग्य निवास बेडसाइड रिकवरी एवं आपातकालीन हब",
    iotHubSub:
      lang === "en"
        ? "Ultra low-cost ESP32 IoT bedside unit designed for Dharamshalas and community recovery dorms."
        : "धर्मशालाओं और रैन बसेरों के लिए डिजाइन किया गया किफायती ESP32 आधारित बेडसाइड मॉनिटर।",
    triggerSos: lang === "en" ? "Trigger Bedside SOS" : "आपातकालीन बटन दबाएं",
    clearAlarm: lang === "en" ? "Reset Alarm State" : "अलार्म रीसेट करें",
  };

  // Calculations for Savings Engine
  const sampleAvgTariff = filteredShelters[0]?.tariffPerNight ?? 50;
  const stayCost = sampleAvgTariff * stayDurationDays;
  const commercialHotelCost = 1500 * stayDurationDays;
  const genericMedsCost = 450;
  const commercialMedsCost = 2800;
  const totalOutPocket = stayCost + genericMedsCost;
  const totalCommercial = commercialHotelCost + commercialMedsCost;
  const netSaved = totalCommercial - totalOutPocket;
  const percentSaved = Math.round((netSaved / totalCommercial) * 100);

  return (
    <div className="min-h-screen bg-[#0d1210] text-[#f4f1ea] antialiased selection:bg-emerald-800 selection:text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        
        {/* Navigation Bar */}
        <header className="flex items-center justify-between py-4 px-6 rounded-2xl bg-[#151c18]/90 border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  {t.title}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {lang === "en" ? "आरोग्य निवास" : "AarogyaNiwas"}
                </span>
              </div>
              <p className="text-[11px] text-white/50">{t.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowHardwareModal(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition"
            >
              <Cpu className="h-3.5 w-3.5 text-amber-400" /> Circuit Pinout
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute Siren" : "Unmute Siren"}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-rose-400" />}
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold transition"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span>{lang === "en" ? "हिंदी में देखें" : "Switch to English"}</span>
            </button>
            <a
              href="#iot-hub"
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/40"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" /> Bedside IoT
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-6 space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.badge}
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal leading-tight">
            {t.heroH1} <br />
            <span className="italic text-emerald-400 font-light">{t.heroSub}</span>
          </h1>

          <p className="text-sm text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
            {t.heroP}
          </p>
        </section>

        {/* Global Live Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#151c18] text-white text-sm pl-12 pr-4 py-3.5 rounded-2xl border border-white/20 focus:border-emerald-500 outline-none shadow-2xl transition placeholder-white/40"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-3 text-xs text-white/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Out-of-Pocket Family Savings Bar */}
        <section className="bg-gradient-to-r from-emerald-950/40 via-[#151c18] to-amber-950/30 p-5 rounded-2xl border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Economic Equity Metrics ({stayDurationDays}-Day Treatment Stay)
              </span>
              <div className="text-sm font-semibold text-white">
                Family Lodging & Generic Medicine Savings
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div>
              <span className="text-white/40 block text-[10px] uppercase">Private Lodging & MRP</span>
              <span className="line-through text-white/60 font-mono">₹{totalCommercial.toLocaleString("en-IN")}</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[10px] uppercase font-bold">AarogyaNiwas + Jan Aushadhi</span>
              <span className="text-emerald-300 font-mono text-base font-bold">₹{totalOutPocket.toLocaleString("en-IN")}</span>
            </div>
            <div className="bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <span className="text-emerald-300 font-bold text-xs">₹{netSaved.toLocaleString("en-IN")} Saved ({percentSaved}%)</span>
            </div>
          </div>
        </section>

        {/* Socioeconomic Triage Filters */}
        <section className="bg-[#151c18] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                {t.triageHeader}
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {t.triageSub}
              </h2>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
              <input
                type="checkbox"
                id="ayushman"
                checked={hasAyushmanCard}
                onChange={(e) => setHasAyushmanCard(e.target.checked)}
                className="h-4 w-4 rounded bg-white/10 border-white/20 text-emerald-600 cursor-pointer accent-emerald-500"
              />
              <label htmlFor="ayushman" className="text-xs font-medium text-white/90 cursor-pointer">
                {t.ayushmanLabel}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60">Medical Problem / Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-[#1c241f] text-white text-xs rounded-xl p-3 border border-white/10 outline-none focus:border-emerald-500 cursor-pointer"
              >
                {SPECIALTY_OPTIONS.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60">State / Territorial Zone</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-[#1c241f] text-white text-xs rounded-xl p-3 border border-white/10 outline-none focus:border-emerald-500 cursor-pointer"
              >
                {STATE_OPTIONS.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-white/60">
                <span>Treatment Stay Duration</span>
                <span className="font-mono text-emerald-400 font-bold">{stayDurationDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={stayDurationDays}
                onChange={(e) => setStayDurationDays(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-white/60">
                <span>Total Out-of-Pocket Limit</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {maxBudget === 0 ? "₹0 (Free / Sarai Only)" : `₹${maxBudget.toLocaleString("en-IN")}`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30000"
                step="250"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>₹0 (Govt/Sarai)</span>
                <span>₹30k (Subsidized Max)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Grid: Hospitals + Shelters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Hospitals */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-400" />
                <h3 className="font-serif text-xl font-semibold text-white">
                  {t.hospitalColTitle}
                </h3>
              </div>
              <span className="text-xs font-mono text-white/50">
                {filteredHospitals.length} Found
              </span>
            </div>

            {filteredHospitals.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#151c18] border border-white/10 text-center text-xs text-white/50 space-y-2">
                <p>No hospitals matched your search terms and filters.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSpecialty("All Specialties");
                    setSelectedState("All States & Regions");
                  }}
                  className="px-3 py-1 bg-emerald-600/30 text-emerald-300 rounded-lg text-xs"
                >
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              filteredHospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  className="p-5 rounded-2xl bg-[#151c18] border border-white/10 hover:border-emerald-500/50 transition shadow-xl space-y-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          {hosp.tier}
                        </span>
                        {hosp.ayushmanEmpanelled && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            PM-JAY 100% Cashless
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-lg font-bold text-white mt-1.5">{hosp.name}</h4>
                      <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-white/40 shrink-0" />
                        <span>{hosp.districtOrTown} • <b>{hosp.state}</b></span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase text-white/40 block">Hospital Cost</span>
                      <span className="font-mono text-xs font-bold text-emerald-300">
                        {hosp.estCostRange}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hosp.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/10"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="text-white/50 font-mono">Central Desk: {hosp.contact}</span>
                    <a
                      href={`tel:${hosp.contact}`}
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      <PhoneCall className="h-3 w-3" /> Call Hospital Help Desk
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Shelters */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-amber-400" />
                <h3 className="font-serif text-xl font-semibold text-white">
                  {t.shelterColTitle}
                </h3>
              </div>
              <span className="text-xs font-mono text-white/50">
                {filteredShelters.length} Available
              </span>
            </div>

            {filteredShelters.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#151c18] border border-white/10 text-center text-xs text-white/50">
                No subsidized shelters found for this selection.
              </div>
            ) : (
              filteredShelters.map((shelter) => {
                const totalStayCost = shelter.tariffPerNight * stayDurationDays;
                return (
                  <div
                    key={shelter.id}
                    className="p-5 rounded-2xl bg-[#151c18] border border-white/10 hover:border-amber-500/50 transition shadow-xl space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          {shelter.type}
                        </span>
                        <h4 className="font-serif text-base font-bold text-white mt-0.5">
                          {shelter.name}
                        </h4>
                        <p className="text-xs text-white/60">
                          Near {shelter.hospitalNearby} ({shelter.distanceKm} km)
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-amber-300 block">
                          {shelter.tariffPerNight === 0 ? "FREE / Langar" : `₹${shelter.tariffPerNight}/night`}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">
                          {stayDurationDays}d Total: ₹{totalStayCost}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[10px] text-white/80">
                      {shelter.hasPatientKitchen && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          <Utensils className="h-3 w-3" /> Communal Patient Kitchen
                        </span>
                      )}
                      {shelter.wheelchairAccessible && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Wheelchair Ramp
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-white/50 pt-2 border-t border-white/5">
                      <span>{shelter.contact}</span>
                      <button
                        onClick={() => {
                          setActiveBookingShelter(shelter);
                          setTokenGenerated(null);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition"
                      >
                        <Ticket className="h-3.5 w-3.5" /> {t.preBookBtn}
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-600/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
                <Pill className="h-4 w-4" /> Pradhan Mantri Jan Aushadhi Kendras
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Generic drug distribution centers located within 500 meters of all listed medical college campuses. Post-operative medicines available at 50% to 90% below commercial retail MRP.
              </p>
            </div>
          </div>
        </div>

        {/* Live IoT Recovery Room Telemetry Hub Section */}
        <section id="iot-hub" className="bg-[#151c18] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Physical Hardware Integration (Live Polling Active)
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">
                {t.iotHubTitle}
              </h2>
              <p className="text-xs text-white/60 mt-0.5">{t.iotHubSub}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{bedLabel}</span>
            </div>
          </div>

          {sosTriggered && (
            <div className="p-4 rounded-2xl bg-red-950/90 border border-red-500 flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce text-red-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider">
                    CRITICAL EMERGENCY: ATTENDANT ALERT DISPATCHED
                  </div>
                  <div className="text-xs">Bedside Button pressed at Vishram Sadan Room 104 ({bedLabel}). Audio alarm sounding.</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono bg-red-900 px-3 py-1 rounded-full font-bold">Code Red</span>
                <button
                  onClick={clearSosAlert}
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-lg text-white font-semibold transition"
                >
                  {t.clearAlarm}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#1c241f] border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-bold text-white/50 flex items-center gap-1">
                <HeartPulse className="h-3.5 w-3.5 text-rose-500" /> Pulse (BPM)
              </div>
              <div className="font-mono text-3xl font-bold text-white">
                {iotHeartRate} <span className="text-xs font-normal text-white/50">bpm</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">Live Telemetry</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c241f] border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-bold text-white/50 flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-sky-400" /> Blood Oxygen (SpO₂)
              </div>
              <div className="font-mono text-3xl font-bold text-white">{iotSpO2}%</div>
              <div className="text-[10px] text-emerald-400 font-medium">Sensor Input</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c241f] border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-bold text-white/50 flex items-center gap-1">
                <Bed className="h-3.5 w-3.5 text-amber-400" /> Room Comfort
              </div>
              <div className="font-mono text-3xl font-bold text-white">{iotRoomTemp}&deg;C</div>
              <div className="text-[10px] text-white/60 font-medium">Ambient Temperature</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c241f] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-white/50">Hardware Simulation</div>
                <div className="text-xs text-white/70 mt-1">Triggers hardware POST request + audio buzzer:</div>
              </div>
              <button
                onClick={sosTriggered ? clearSosAlert : triggerSosSimulation}
                className={`w-full py-2.5 rounded-xl text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-1.5 ${
                  sosTriggered
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-red-600 hover:bg-red-500 shadow-red-900/40"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {sosTriggered ? t.clearAlarm : t.triggerSos}
              </button>
            </div>
          </div>
        </section>

        {/* Bed Pre-Booking & Token Modal */}
        {activeBookingShelter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#151c18] border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-5">
              <button
                onClick={() => setActiveBookingShelter(null)}
                className="absolute right-4 top-4 text-white/50 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-emerald-400">
                <Ticket className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  AarogyaNiwas Bed Requisition Pass
                </span>
              </div>

              {!tokenGenerated ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">
                      {activeBookingShelter.name}
                    </h3>
                    <p className="text-xs text-white/60">
                      Serving {activeBookingShelter.hospitalNearby} • {activeBookingShelter.tariffPerNight === 0 ? "Free Langar" : `₹${activeBookingShelter.tariffPerNight}/night`}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-white/60 block mb-1">Patient Full Name</label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full bg-[#1c241f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/60 block mb-1">Ayushman PM-JAY / ABHA ID</label>
                      <input
                        type="text"
                        value={abhaNumber}
                        onChange={(e) => setAbhaNumber(e.target.value)}
                        className="w-full bg-[#1c241f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200">
                      ✓ Instant token generated without registration fee.
                      <br />✓ Bed reserved for 24 hours from scheduled OPD reporting.
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerateToken(activeBookingShelter)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    Confirm & Generate Digital Transit Token
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-[#1c241f] border border-white/10 rounded-2xl space-y-3 text-left">
                    <div className="flex justify-between items-start border-b border-white/10 pb-2">
                      <div>
                        <span className="text-[10px] text-white/50 uppercase block">Transit Token ID</span>
                        <span className="font-mono text-base font-bold text-emerald-400">{tokenGenerated}</span>
                      </div>
                      <QrCode className="h-10 w-10 text-emerald-300" />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/50">Patient:</span>
                        <span className="text-white font-semibold">{patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">ABHA / Ration:</span>
                        <span className="font-mono text-white/80">{abhaNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Shelter:</span>
                        <span className="text-white truncate max-w-[180px]">{activeBookingShelter.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Allocated Dorm:</span>
                        <span className="text-amber-300 font-mono font-bold">Dorm-B / Bed #07</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" /> Print Pass
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

        {/* Hardware Schematics Modal */}
        {showHardwareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#151c18] border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-4">
              <button
                onClick={() => setShowHardwareModal(false)}
                className="absolute right-4 top-4 text-white/50 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-amber-400">
                <Cpu className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  ESP32 Bedside Recovery Hub Circuit Pinout
                </span>
              </div>

              <div className="space-y-3 text-xs text-white/80 font-mono bg-[#1c241f] p-4 rounded-2xl border border-white/10">
                <div className="text-emerald-400 font-bold">// Microcontroller: ESP32-WROOM-32 (CP2102)</div>
                <div>• GPIO 04 $\rightarrow$ Tactile SOS Button (Active LOW, Internal Pull-Up)</div>
                <div>• GPIO 18 $\rightarrow$ Active Piezo Buzzer Signal</div>
                <div>• GPIO 21 $\rightarrow$ I2C SDA (MAX30102 Vitals + SSD1306 OLED)</div>
                <div>• GPIO 22 $\rightarrow$ I2C SCL (Clock Bus)</div>
                <div>• VIN / 3V3 $\rightarrow$ Regulated USB 5V Input / 3.3V Sensor Rail</div>
                <div>• GND $\rightarrow$ Common Ground Rail</div>
              </div>

              <div className="text-xs text-white/60 leading-relaxed">
                Firmware establishes a lightweight Wi-Fi client connection, sending JSON payload bursts every 1.5 seconds to <code className="text-emerald-400">/api/telemetry</code> using non-blocking asynchronous timers.
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

        {/* Footer */}
        <footer className="pt-8 pb-12 border-t border-white/10 text-center text-xs text-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-emerald-400" />
            <span className="font-serif font-bold text-white">AarogyaNiwas</span>
            <span>• Smart India Hackathon Prototype</span>
          </div>
          <p className="text-[11px]">Rural Healthcare Hospitality, Subsidized Accommodations & Patient Equity Platform.</p>
        </footer>
      </div>
    </div>
  );
}