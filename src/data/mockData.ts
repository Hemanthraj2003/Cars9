export interface CarPart {
  id: string;
  name: string;
  brand: string;
  subbrand: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  location: string;
  imageUrl?: string;
  specifications: {
    material?: string;
    dimensions?: string;
    weight?: string;
    oemNumber?: string;
    threadSize?: string;
    fitmentType?: string;
    operatingTemp?: string;
  };
}

export interface Brand {
  id: string;
  name: string;
  subbrands: string[];
}

export const initialBrands: Brand[] = [
  {
    id: "toyota",
    name: "Toyota",
    subbrands: ["Camry", "Prius", "RAV4", "Tacoma"],
  },
  {
    id: "ford",
    name: "Ford",
    subbrands: ["Mustang", "F-150", "Explorer"],
  },
  {
    id: "honda",
    name: "Honda",
    subbrands: ["Civic", "Accord", "CR-V"],
  },
  {
    id: "bmw",
    name: "BMW",
    subbrands: ["3-Series", "5-Series", "X5"],
  },
];

export const initialParts: CarPart[] = [
  {
    id: "9601K11",
    name: "Front Ceramic Brake Pad Set",
    brand: "Toyota",
    subbrand: "Camry",
    sku: "BP-TY-CAM-01",
    description: "Low-dust, quiet ceramic compound brake pads. Features chamfered slots and shims to eliminate vibrations and brake squeal under high temperatures.",
    price: 4050.00,
    stock: 24,
    imageUrl: "/images/brake_pads.png",
    location: "Aisle 04, Shelf B3",
    specifications: {
      material: "Ceramic / Copper-Free",
      dimensions: "134.5 mm x 57.2 mm x 17.5 mm",
      weight: "2.1 lbs",
      oemNumber: "04465-06100",
      fitmentType: "Direct Replacement",
    },
  },
  {
    id: "9601K12",
    name: "Laser Iridium Spark Plug (Pack of 4)",
    brand: "Toyota",
    subbrand: "Prius",
    sku: "SP-TY-PRI-02",
    description: "Premium iridium center electrode with platinum ground electrode for long-lasting spark and clean fuel combustion. High corrosion resistance.",
    price: 3000.00,
    stock: 45,
    imageUrl: "/images/spark_plug.png",
    location: "Aisle 02, Shelf A1",
    specifications: {
      material: "Iridium / Platinum",
      dimensions: "M14 x 1.25 Thread, 26.5 mm Reach",
      weight: "0.4 lbs (pack)",
      oemNumber: "90919-01217",
      threadSize: "M14 x 1.25",
      fitmentType: "Direct Fit",
    },
  },
  {
    id: "9601K13",
    name: "Spin-On Oil Filter",
    brand: "Honda",
    subbrand: "Civic",
    sku: "OF-HD-CIV-03",
    description: "Synthetic blend media designed to trap dirt particles as small as 20 microns. Heavy-duty steel canister housing with silicone anti-drainback valve.",
    price: 750.00,
    stock: 120,
    imageUrl: "/images/oil_filter.png",
    location: "Aisle 01, Shelf C2",
    specifications: {
      material: "Synthetic Fiber / Steel",
      dimensions: "65 mm Diameter x 85 mm Height",
      weight: "0.6 lbs",
      oemNumber: "15400-PLM-A02",
      threadSize: "M20 x 1.5",
      fitmentType: "Spin-on",
    },
  },
  {
    id: "9601K14",
    name: "Alternator Assembly - 130 Amp",
    brand: "Ford",
    subbrand: "F-150",
    sku: "AL-FD-F15-04",
    description: "Heavy-duty alternator manufactured with premium bearings and rectifiers. Rigorously tested to withstand extreme heat and vibration.",
    price: 15400.00,
    stock: 5,
    imageUrl: "/images/alternator.png",
    location: "Aisle 08, Shelf D1",
    specifications: {
      material: "Cast Aluminum Housing / Copper Windings",
      dimensions: "185 mm x 165 mm x 150 mm",
      weight: "12.8 lbs",
      oemNumber: "AL3Z-10346-A",
      fitmentType: "Direct Replacement",
      operatingTemp: "-40°F to 250°F",
    },
  },
  {
    id: "9601K15",
    name: "Molded Upper Radiator Hose",
    brand: "BMW",
    subbrand: "3-Series",
    sku: "RH-BM-3SE-05",
    description: "Heat and ozone resistant EPDM rubber construction. Pre-shaped for an exact engine bay clearance without kinking or rubbing.",
    price: 2000.00,
    stock: 15,
    imageUrl: "/images/radiator_hose.png",
    location: "Aisle 05, Shelf A4",
    specifications: {
      material: "EPDM Rubber",
      dimensions: "1.25\" Inner Diameter, 18\" Length",
      weight: "0.8 lbs",
      oemNumber: "17127531768",
      fitmentType: "Molded Direct Fit",
    },
  },
  {
    id: "9601K16",
    name: "Downstream Oxygen Sensor",
    brand: "Honda",
    subbrand: "Accord",
    sku: "OS-HD-ACC-06",
    description: "Dual protective layer of alumina coating keeps target gas element clean. Laser welded body ensures maximum strength and protection against water ingress.",
    price: 5300.00,
    stock: 18,
    imageUrl: "/images/oxygen_sensor.png",
    location: "Aisle 03, Shelf B2",
    specifications: {
      material: "Stainless Steel / Zirconia Ceramic",
      dimensions: "4-wire, 350 mm Lead Wire",
      weight: "0.3 lbs",
      oemNumber: "36532-R5A-A01",
      threadSize: "M18 x 1.5",
      fitmentType: "Direct Plug-In",
    },
  },
  {
    id: "9601K17",
    name: "Gas-Charged Strut Assembly (Front)",
    brand: "BMW",
    subbrand: "X5",
    sku: "SA-BM-X50-07",
    description: "Twin-tube gas pressure strut designed to restore original ride handling and control. Finished in anti-corrosive gloss black paint.",
    price: 9350.00,
    stock: 8,
    imageUrl: "/images/shock_absorber.png",
    location: "Aisle 09, Shelf B1",
    specifications: {
      material: "Alloy Steel",
      dimensions: "620 mm Length x 90 mm Tube Diameter",
      weight: "8.5 lbs",
      oemNumber: "31316781917",
      fitmentType: "Strut Assembly",
    },
  },
  {
    id: "9601K18",
    name: "High-Efficiency Cabin Air Filter",
    brand: "Ford",
    subbrand: "Explorer",
    sku: "CF-FD-EXP-08",
    description: "Multi-layer filter medium captures dust, pollen, soot, and active gases. Activated carbon layer neutralizes exhaust fumes and cabin odors.",
    price: 1300.00,
    stock: 60,
    imageUrl: "/images/cabin_air_filter.png",
    location: "Aisle 01, Shelf A3",
    specifications: {
      material: "Activated Carbon Non-Woven Fabric",
      dimensions: "220 mm x 200 mm x 30 mm",
      weight: "0.5 lbs",
      oemNumber: "GB5Z-19N619-A",
      fitmentType: "Direct Fit Panel",
    },
  },
  {
    id: "9601K19",
    name: "Denso Fuel Injector",
    brand: "Toyota",
    subbrand: "Tacoma",
    sku: "FI-TY-TAC-09",
    description: "Twelve-hole design with advanced fuel atomization. Internal seal ring protects coil against moisture and chemicals.",
    price: 6500.00,
    stock: 12,
    imageUrl: "/images/fuel_injector.png",
    location: "Aisle 07, Shelf C1",
    specifications: {
      material: "Stainless Steel / Composite",
      dimensions: "72 mm x 22 mm",
      weight: "0.2 lbs",
      oemNumber: "23250-0C010",
      fitmentType: "Multi-Port Fuel Injector",
    },
  },
  {
    id: "9601K20",
    name: "All-Season Wiper Blade (26 inch)",
    brand: "Honda",
    subbrand: "CR-V",
    sku: "WB-HD-CRV-10",
    description: "Premium rubber blade with graphite coating for streak-free wiping. Aerodynamic spoiler prevents blade lift at high wind speeds.",
    price: 1650.00,
    stock: 90,
    imageUrl: "/images/wiper_blade.png",
    location: "Aisle 01, Shelf E1",
    specifications: {
      material: "Natural Rubber / Steel Frame",
      dimensions: "26 inches (650 mm) length",
      weight: "0.7 lbs",
      oemNumber: "76620-T0A-A01",
      fitmentType: "J-Hook (9x3 and 9x4)",
    },
  },
];
