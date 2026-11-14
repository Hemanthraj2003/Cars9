const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'sqlite.db');
const db = new Database(dbPath);

console.log('Seeding database at:', dbPath);

// Drop old tables to migrate to new schema
db.exec(`
  DROP TABLE IF EXISTS warranties;
  DROP TABLE IF EXISTS quotations;
  DROP TABLE IF EXISTS banners;
  DROP TABLE IF EXISTS parts;
  DROP TABLE IF EXISTS subbrands;
  DROP TABLE IF EXISTS brands;
`);

// Create tables
db.exec(`
  CREATE TABLE brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT
  );
  
  CREATE TABLE subbrands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id TEXT NOT NULL,
    name TEXT NOT NULL,
    years TEXT,
    FOREIGN KEY(brand_id) REFERENCES brands(id) ON DELETE CASCADE
  );
  
  CREATE TABLE parts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    subbrand TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Accessories',
    sku TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    images TEXT,
    video_url TEXT,
    compatible_years TEXT,
    badge TEXT,
    warranty_months INTEGER DEFAULT 12,
    specifications TEXT
  );

  CREATE TABLE banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    badge TEXT,
    image_url TEXT NOT NULL,
    cta_text TEXT DEFAULT 'Explore Accessories',
    cta_link TEXT DEFAULT '#catalog',
    is_active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE quotations (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    vehicle_brand TEXT,
    vehicle_model TEXT,
    vehicle_year TEXT,
    items TEXT NOT NULL,
    subtotal REAL DEFAULT 0,
    labor_total REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    grand_total REAL DEFAULT 0,
    is_priced INTEGER DEFAULT 0,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'New Enquiry',
    created_at TEXT NOT NULL
  );

  CREATE TABLE warranties (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    invoice_no TEXT NOT NULL,
    vehicle_reg_no TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_id TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    purchase_date TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    warranty_months INTEGER NOT NULL DEFAULT 12,
    studio_location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active'
  );
`);

console.log('Tables recreated with new schema.');

// Insert initial brands
const insertBrand = db.prepare('INSERT INTO brands (id, name, logo) VALUES (?, ?, ?)');
const insertSubbrand = db.prepare('INSERT INTO subbrands (brand_id, name, years) VALUES (?, ?, ?)');

const brandsData = [
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
      { name: "Tucson", years: ["2024", "2023", "2022", "2021", "2020"] }
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
  }
];

for (const b of brandsData) {
  insertBrand.run(b.id, b.name, null);
  for (const sb of b.subbrands) {
    insertSubbrand.run(b.id, sb.name, JSON.stringify(sb.years));
  }
}
console.log('Brands & Models seeded.');

// Insert Relevant Accessory Banners (No generic cars)
const insertBanner = db.prepare(`
  INSERT INTO banners (title, subtitle, badge, image_url, cta_text, cta_link, is_active, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const bannersData = [
  {
    title: "12.3\" QLED Android 14 Cockpits",
    subtitle: "Anti-glare IPS touchscreen, wireless Apple CarPlay, 8-Core processor & Sony night-vision 360° cameras.",
    badge: "Smart Cockpit Upgrade",
    imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Explore Screens",
    ctaLink: "#catalog",
    isActive: 1,
    sortOrder: 1,
  },
  {
    title: "Audiophile Sound Dampening & 8-Ch DSP",
    subtitle: "Custom tuned acoustic chambers, 8-channel digital signal processors & high-fidelity focal speakers.",
    badge: "Acoustic Engineering",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Audio Upgrades",
    ctaLink: "#catalog",
    isActive: 1,
    sortOrder: 2,
  },
  {
    title: "Bi-LED Dual Laser Projector Headlamps",
    subtitle: "Extreme throw up to 600m with razor-sharp European cut-off lines and sequential amber turn signals.",
    badge: "Lighting & Visibility",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Upgrade Lighting",
    ctaLink: "#catalog",
    isActive: 1,
    sortOrder: 3,
  },
  {
    title: "64-Color Symphony Ambient Lighting",
    subtitle: "Sub-gasket concealed acrylic optic strips with dynamic flow, music synchronization & smartphone app.",
    badge: "Bespoke Interiors",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Ambient Lighting",
    ctaLink: "#catalog",
    isActive: 1,
    sortOrder: 4,
  },
  {
    title: "Custom 7D Diamond All-Weather Mats",
    subtitle: "3D laser-scanned for millimeter-perfect edge-to-edge coverage, 7-layer waterproof composite & heel pad.",
    badge: "Floor Protection",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Laser Measured Mats",
    ctaLink: "#catalog",
    isActive: 1,
    sortOrder: 5,
  }
];

for (const b of bannersData) {
  insertBanner.run(b.title, b.subtitle, b.badge, b.imageUrl, b.ctaText, b.ctaLink, b.isActive, b.sortOrder);
}
console.log('5 Hero Accessory Banners seeded.');

// Insert Parts
const insertPart = db.prepare(`
  INSERT INTO parts (
    id, name, brand, subbrand, category, sku, description, price, stock, location,
    image_url, images, video_url, compatible_years, badge, warranty_months, specifications
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const partsData = [
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
    imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
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

for (const p of partsData) {
  insertPart.run(
    p.id,
    p.name,
    p.brand,
    p.subbrand,
    p.category,
    p.sku,
    p.description,
    p.price,
    p.stock,
    p.location,
    p.imageUrl,
    JSON.stringify(p.images),
    p.videoUrl,
    JSON.stringify(p.compatibleYears),
    p.badge,
    p.warrantyMonths,
    JSON.stringify(p.specifications)
  );
}

// Insert Warranties
const insertWarranty = db.prepare(`
  INSERT INTO warranties (
    id, customer_name, customer_phone, customer_email, invoice_no, vehicle_reg_no,
    product_name, product_id, serial_number, purchase_date, expiry_date,
    warranty_months, studio_location, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const warrantiesData = [
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

for (const w of warrantiesData) {
  insertWarranty.run(
    w.id,
    w.customerName,
    w.customerPhone,
    w.customerEmail,
    w.invoiceNo,
    w.vehicleRegNo,
    w.productName,
    w.productId,
    w.serialNumber,
    w.purchaseDate,
    w.expiryDate,
    w.warrantyMonths,
    w.studioLocation,
    w.status
  );
}

console.log('Database seeded with accessories, banners & warranties.');
