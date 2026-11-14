export interface CarPart {
  id: string;
  name: string;
  brand: string;
  subbrand: string;
  category: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  videoUrl?: string;
  compatibleYears?: string[];
  badge?: string;
  warrantyMonths?: number;
  specifications: Record<string, string>;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string | null;
  rank?: number;
  isDeleted?: boolean;
  deletedAt?: string | null;
  subbrands: {
    id?: number;
    name: string;
    imageUrl?: string | null;
    years: string[];
    isDeleted?: boolean;
    deletedAt?: string | null;
  }[];
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface WarrantyRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  invoiceNo: string;
  vehicleRegNo: string;
  productName: string;
  productId: string;
  serialNumber: string;
  purchaseDate: string;
  expiryDate: string;
  warrantyMonths: number;
  studioLocation: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export const initialBanners: Banner[] = [
  {
    id: 1,
    title: "12.3\" QLED Android 14 Cockpits",
    subtitle: "Anti-glare IPS touchscreen, wireless Apple CarPlay, 8-Core processor & Sony night-vision 360° cameras.",
    badge: "Smart Cockpit Upgrade",
    imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Screens",
    ctaLink: "#catalog",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 2,
    title: "Audiophile Sound Dampening & 8-Ch DSP",
    subtitle: "Custom tuned acoustic chambers, 8-channel digital signal processors & high-fidelity focal speakers.",
    badge: "Acoustic Engineering",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Audio Upgrades",
    ctaLink: "#catalog",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 3,
    title: "Bi-LED Dual Laser Projector Headlamps",
    subtitle: "Extreme throw up to 600m with razor-sharp European cut-off lines and sequential amber turn signals.",
    badge: "Lighting & Visibility",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Upgrade Lighting",
    ctaLink: "#catalog",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 4,
    title: "64-Color Symphony Ambient Lighting",
    subtitle: "Sub-gasket concealed acrylic optic strips with dynamic flow, music synchronization & smartphone app.",
    badge: "Bespoke Interiors",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Ambient Lighting",
    ctaLink: "#catalog",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 5,
    title: "Custom 7D Diamond All-Weather Mats",
    subtitle: "3D laser-scanned for millimeter-perfect edge-to-edge coverage, 7-layer waterproof composite & heel pad.",
    badge: "Floor Protection",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Laser Measured Mats",
    ctaLink: "#catalog",
    isActive: true,
    sortOrder: 5,
  }
];

export const initialWarranties: WarrantyRecord[] = [
  {
    id: "C9-WRN-8492",
    customerName: "Vikramaditya Sharma",
    customerPhone: "9876543210",
    customerEmail: "vikram.sharma@gmail.com",
    invoiceNo: "INV-2026-0812",
    vehicleRegNo: "KA-04-MM-8492",
    productName: "ApexPro 8-Channel DSP Amplifier with 31-Band Parametric EQ",
    productId: "C9-AUD-001",
    serialNumber: "SN-DSP8-8492",
    purchaseDate: "2026-01-15",
    expiryDate: "2028-01-15",
    warrantyMonths: 24,
    studioLocation: "Cars9 Flagship Studio, Indiranagar, Bangalore",
    status: "Active"
  },
  {
    id: "C9-WRN-3921",
    customerName: "Rohan Varma",
    customerPhone: "9845012345",
    customerEmail: "rohan.v@yahoo.com",
    invoiceNo: "INV-2026-0490",
    vehicleRegNo: "KA-01-EQ-3921",
    productName: "12.3\" QLED Ultra-HD Android 14 Digital Cockpit with 360° Cam",
    productId: "C9-SCR-002",
    serialNumber: "SN-QLED12-3921",
    purchaseDate: "2026-02-10",
    expiryDate: "2027-08-10",
    warrantyMonths: 18,
    studioLocation: "Cars9 Studio Bay 2, HSR Layout, Bangalore",
    status: "Active"
  }
];

export const initialBrands: Brand[] = [
  {
    id: "toyota",
    name: "Toyota",
    subbrands: [
      { name: "Fortuner", years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"] },
      { name: "Innova Crysta / Hycross", years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"] },
      { name: "Hilux", years: ["2024", "2023", "2022", "2021"] },
      { name: "Camry", years: ["2024", "2023", "2022", "2021", "2020", "2019"] },
      { name: "Urban Cruiser Hyryder", years: ["2024", "2023", "2022"] },
      { name: "Glanza", years: ["2024", "2023", "2022", "2021", "2020"] }
    ],
  },
  {
    id: "mahindra",
    name: "Mahindra",
    subbrands: [
      { name: "Thar / Thar Roxx", years: ["2024", "2023", "2022", "2021", "2020"] },
      { name: "Scorpio-N / Classic", years: ["2024", "2023", "2022", "2021", "2020"] },
      { name: "XUV700", years: ["2024", "2023", "2022", "2021"] },
      { name: "XUV 3XO / 300", years: ["2024", "2023", "2022", "2021", "2020"] },
      { name: "Bolero Neo", years: ["2024", "2023", "2022", "2021"] }
    ],
  },
  {
    id: "tata",
    name: "Tata",
    subbrands: [
      { name: "Harrier / Safari", years: ["2024", "2023", "2022", "2021", "2020", "2019"] },
      { name: "Nexon / Nexon EV", years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"] },
      { name: "Curvv / Curvv EV", years: ["2024"] },
      { name: "Punch / Punch EV", years: ["2024", "2023", "2022", "2021"] },
      { name: "Altroz", years: ["2024", "2023", "2022", "2021", "2020"] }
    ],
  },
  {
    id: "hyundai",
    name: "Hyundai",
    subbrands: [
      { name: "Creta / Creta N-Line", years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"] },
      { name: "Alcazar", years: ["2024", "2023", "2022", "2021"] },
      { name: "Verna", years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"] },
      { name: "Venue / Venue N-Line", years: ["2024", "2023", "2022", "2021", "2020", "2019"] },
      { name: "Tucson", years: ["2024", "2023", "2022", "2021", "2020"] },
      { name: "i20 / i20 N-Line", years: ["2024", "2023", "2022", "2021", "2020"] }
    ],
  },
  {
    id: "kia",
    name: "Kia",
    subbrands: [
      { name: "Seltos / X-Line", years: ["2024", "2023", "2022", "2021", "2020", "2019"] },
      { name: "Sonet", years: ["2024", "2023", "2022", "2021", "2020"] },
      { name: "Carens", years: ["2024", "2023", "2022"] },
      { name: "Carnival", years: ["2024", "2023", "2022", "2021", "2020"] },
      { name: "EV6", years: ["2024", "2023", "2022"] }
    ],
  },
  {
    id: "bmw",
    name: "BMW",
    subbrands: [
      { name: "3-Series / Gran Limousine", years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"] },
      { name: "5-Series", years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"] },
      { name: "X1", years: ["2024", "2023", "2022", "2021", "2020", "2019"] },
      { name: "X5", years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"] }
    ],
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz",
    subbrands: [
      { name: "C-Class", years: ["2024", "2023", "2022", "2021", "2020", "2019"] },
      { name: "E-Class", years: ["2024", "2023", "2022", "2021", "2020", "2019"] },
      { name: "GLC", years: ["2024", "2023", "2022", "2021", "2020"] },
      { name: "GLE", years: ["2024", "2023", "2022", "2021", "2020"] }
    ],
  },
  {
    id: "volkswagen-skoda",
    name: "Volkswagen / Skoda",
    subbrands: [
      { name: "Virtus / Slavia", years: ["2024", "2023", "2022"] },
      { name: "Taigun / Kushaq", years: ["2024", "2023", "2022", "2021"] },
      { name: "Tiguan / Kodiaq", years: ["2024", "2023", "2022", "2021", "2020"] }
    ],
  }
];

export const initialParts: CarPart[] = [
  {
    id: "C9-AUD-001",
    name: "ApexPro 8-Channel DSP Amplifier with 31-Band Parametric EQ",
    brand: "Toyota",
    subbrand: "Fortuner",
    category: "Infotainment & Audio",
    sku: "C9-DSP-8CH-TY",
    description: "Military-grade digital signal processor engineered specifically for OEM vehicle acoustics. Provides 8 channels of clean class-D amplification, high-res optical input, 31-band parametric equalizer, and zero-wire-slicing OEM coupler kit.",
    price: 34500.00,
    stock: 18,
    location: "Studio Bay A-1",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    compatibleYears: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"],
    badge: "Studio Signature",
    warrantyMonths: 24,
    specifications: {
      "Output Power": "8 x 75W RMS @ 4Ω / 8 x 120W RMS @ 2Ω",
      "Signal Processor": "32-Bit Dual-Core DSP Engine @ 192kHz",
      "Wiring": "OEM Plug-and-Play Coupler (Zero Wire Slicing)",
      "Audio Inputs": "Optical Toslink, High-Level OEM, Bluetooth 5.2 LDAC",
      "Warranty": "2 Years On-Site Replacement"
    }
  },
  {
    id: "C9-SCR-002",
    name: "12.3\" QLED Ultra-HD Android 14 Digital Cockpit with 360° Cam",
    brand: "Mahindra",
    subbrand: "Thar / Thar Roxx",
    category: "Infotainment & Audio",
    sku: "C9-QLED-123-THAR",
    description: "Ultra-wide 1920x720 anti-glare QLED capacitive touch screen running Android 14. Integrated wireless Apple CarPlay & Android Auto, 8-Core processor, and includes 4 high-definition Sony Starvis night-vision 360° cameras.",
    price: 42000.00,
    stock: 12,
    location: "Studio Bay B-2",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    compatibleYears: ["2024", "2023", "2022", "2021", "2020"],
    badge: "Best Seller",
    warrantyMonths: 18,
    specifications: {
      "Display": "12.3\" QLED IPS Anti-Glare 1920x720p",
      "Processor & Memory": "Snapdragon 665 Octa-Core, 8GB RAM + 128GB ROM",
      "Connectivity": "4G LTE SIM Slot, 5GHz WiFi, Wireless CarPlay & Auto",
      "Cameras": "4x Sony Starvis 1080p Ultra-Wide Angle with 3D View",
      "Installation": "Direct OEM fascia replacement with original steering wheel controls"
    }
  },
  {
    id: "C9-LGT-003",
    name: "HyperBeam Bi-LED Dual Laser Projector Headlamp Assembly",
    brand: "Hyundai",
    subbrand: "Creta / Creta N-Line",
    category: "Lighting & Electrical",
    sku: "C9-LED-LASER-CRETA",
    description: "Custom retrofit Bi-LED headlight system featuring integrated auxiliary laser chips delivering an intense 600-meter focused illumination throw. Features crisp European cutoff lines and dynamic sequential startup amber turn indicators.",
    price: 28500.00,
    stock: 15,
    location: "Studio Bay C-1",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    compatibleYears: ["2024", "2023", "2022", "2021", "2020"],
    badge: "Extreme Visibility",
    warrantyMonths: 36,
    specifications: {
      "Total Lumens": "14,000 Lumens per pair @ 6000K Pure White",
      "Laser Assist": "Direct focus auxiliary diode for high beam highway driving",
      "Thermal Control": "Magnesium heat sink with dual magnetic levitation cooling fans",
      "Wiring": "OEM relay harness with waterproof IP68 Deutsch connectors",
      "Compliance": "ECE R112 Compliant sharp cutoff - zero glare to oncoming traffic"
    }
  },
  {
    id: "C9-INT-004",
    name: "AeroGlow 64-Color Symphony Fiber-Optic Ambient Lighting System",
    brand: "Tata",
    subbrand: "Harrier / Safari",
    category: "Interior Styling",
    sku: "C9-AMB-64C-TAT",
    description: "Concealed acrylic fiber optic light strips delivering buttery smooth color transitions, music sync rhythm visualization, and door open warning indicators. Controlled via smartphone iOS/Android app and factory steering wheel controls.",
    price: 13500.00,
    stock: 25,
    location: "Studio Bay D-3",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    compatibleYears: ["2024", "2023", "2022", "2021", "2020", "2019"],
    badge: "Trending",
    warrantyMonths: 12,
    specifications: {
      "Illumination Zones": "Dashboard, 4x Doors, Footwells, Center Console & Door Pockets",
      "LED Technology": "RGBIC Symphony Individually Addressable Micro-LEDs",
      "Control Mode": "Bluetooth BLE app with custom palette creation + Physical OEM switch",
      "Fitment": "OEM sub-gasket hidden channel insertion with zero trim disfigurement",
      "Safety": "Built-in low voltage cutoff & fuse box tap protection"
    }
  },
  {
    id: "C9-EXT-005",
    name: "Aerotech High-Gloss Carbon Fiber Performance Body Kit & Diffuser",
    brand: "BMW",
    subbrand: "3-Series / Gran Limousine",
    category: "Exterior Styling",
    sku: "C9-CF-BK-BMW3",
    description: "Vacuum-infused authentic carbon fiber aero kit comprising a front chin splitter, side skirt extensions, high-kick rear trunk ducktail spoiler, and dual-outlet quad diffuser with integrated F1 LED rain strobe.",
    price: 78000.00,
    stock: 6,
    location: "Studio Bay E-1",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    compatibleYears: ["2024", "2023", "2022", "2021", "2020", "2019"],
    badge: "M-Sport Grade",
    warrantyMonths: 24,
    specifications: {
      "Material": "Autoclave 3K 2x2 Twill Weave Dry Carbon Fiber",
      "Coating": "Anti-UV PPG High Gloss Automotive Clearcoat",
      "Mounting": "Factory mounting points + 3M VHB industrial tape (No chassis drilling)",
      "Aerodynamics": "Wind-tunnel verified downforce enhancement @ 120km/h",
      "Fitment": "G20 / G28 3-Series Pre-LCI & LCI M-Sport Bumpers"
    }
  },
  {
    id: "C9-AUD-006",
    name: "UltraDamp 3-Layer Acoustic & Thermal Multi-Butyl Sound Deadening",
    brand: "Toyota",
    subbrand: "Innova Crysta / Hycross",
    category: "Infotainment & Audio",
    sku: "C9-DAMP-PRO-3L",
    description: "Premium 2.5mm aerospace-grade aluminum foil + pure butyl rubber compound sound deadening sheets. Dramatically cuts road rumble, wind howl, tire vibration, and improves speaker bass response by up to 8dB.",
    price: 18500.00,
    stock: 30,
    location: "Studio Bay A-2",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    compatibleYears: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"],
    badge: "NVH Master",
    warrantyMonths: 60,
    specifications: {
      "Thickness": "2.5mm Pure Odorless Viscoelastic Butyl + 100μm Embossed Foil",
      "Temperature Range": "-45°C to +150°C (Zero Tar Melting or Odor)",
      "Coverage": "Bulk Studio Pack (40 sq. ft. - 4 Doors, Floor & Boot)",
      "Acoustic Loss Factor": "0.33 @ 200Hz Resonance",
      "Warranty": "5 Years studio adhesion & delamination warranty"
    }
  },
  {
    id: "C9-UTL-007",
    name: "StealthPro Dual 4K+2K GPS WiFi Dashcam with Hardwire Parking Guard",
    brand: "Kia",
    subbrand: "Seltos / X-Line",
    category: "Car Care & Utility",
    sku: "C9-DASH-4K-GPS",
    description: "Compact screenless stealth dashcam with Sony Starvis 2 IMX678 sensor capturing true 4K front and 2K rear. Includes smart hardwire kit with 24/7 radar motion parking surveillance and battery drainage prevention.",
    price: 16900.00,
    stock: 22,
    location: "Studio Bay D-1",
    imageUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    compatibleYears: ["2024", "2023", "2022", "2021", "2020", "2019"],
    badge: "Security Guard",
    warrantyMonths: 24,
    specifications: {
      "Resolution": "Front: 4K 3840x2160 @ 30fps | Rear: 2560x1440 @ 30fps",
      "Night Vision": "Sony STARVIS 2 with HDR / WDR Extreme Contrast",
      "Parking Mode": "Buffered Time-lapse & G-sensor collision trigger with ACC tap",
      "Storage": "Supports up to 256GB High Endurance MicroSD card",
      "Smartphone App": "High speed 5GHz Wi-Fi direct video streaming & export"
    }
  },
  {
    id: "C9-INT-008",
    name: "Custom 7D All-Weather Diamond Matrix Laser-Measured Floor Mats",
    brand: "Mahindra",
    subbrand: "Scorpio-N / Classic",
    category: "Interior Styling",
    sku: "C9-7D-MAT-SCN",
    description: "Digitally 3D laser-scanned for millimeter-perfect edge-to-edge coverage. Crafted with five layers of high-density EVA foam, anti-skid backing, premium diamond quilted leatherette, and detachable curly grass dirt trap mats.",
    price: 8900.00,
    stock: 35,
    location: "Studio Bay E-3",
    imageUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    compatibleYears: ["2024", "2023", "2022"],
    badge: "Laser Measured",
    warrantyMonths: 24,
    specifications: {
      "Structure": "7-Layer Heavy Duty Waterproof composite with heel pad reinforcement",
      "Coverage": "100% Floor area + elevated side-wall threshold containment",
      "Colorways": "Obsidian Black with Red Stitch, Saddle Tan, Carbon Texture",
      "Cleaning": "Detachable anti-spill noodle layer washable in under 60 seconds",
      "Vehicle Fit": "Specifically engineered for Scorpio-N 6-Seater / 7-Seater layout"
    }
  }
];
