import React from "react";

interface TechnicalDrawingProps {
  partName: string;
  className?: string;
}

export default function TechnicalDrawing({ partName, className = "w-24 h-24" }: TechnicalDrawingProps) {
  const name = partName.toLowerCase();

  // Pick drawing based on keywords
  if (name.includes("brake") || name.includes("pad")) {
    // Brake pads SVG
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Outer pad backing plate */}
        <path d="M 15 35 C 15 35, 50 20, 85 35 C 85 35, 90 60, 85 65 C 80 70, 20 70, 15 65 C 10 60, 15 35, 15 35 Z" fill="#f5f5f5" />
        {/* Friction material */}
        <path d="M 22 38 C 22 38, 50 26, 78 38 C 78 38, 82 56, 78 60 C 74 64, 26 64, 22 60 C 18 56, 22 38, 22 38 Z" fill="#e5e5e5" strokeDasharray="2 2" />
        {/* Metal tabs/ears */}
        <rect x="8" y="47" width="7" height="8" rx="1" fill="#d4d4d4" />
        <rect x="85" y="47" width="7" height="8" rx="1" fill="#d4d4d4" />
        {/* Dimension lines */}
        <line x1="8" y1="80" x2="92" y2="80" stroke="#999" strokeWidth="0.8" />
        <path d="M 8 77 L 8 83 M 92 77 L 92 83 M 12 80 L 18 80 M 88 80 L 82 80" stroke="#999" strokeWidth="0.8" />
        <text x="50" y="90" fontSize="8" fontFamily="monospace" textAnchor="middle" fill="#666">134.5mm</text>
      </svg>
    );
  }

  if (name.includes("spark") || name.includes("plug")) {
    // Spark plug SVG
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Terminal */}
        <rect x="46" y="10" width="8" height="8" rx="1" fill="#d4d4d4" />
        {/* Ceramic insulator ribs */}
        <rect x="42" y="18" width="16" height="6" fill="#fff" />
        <rect x="40" y="24" width="20" height="6" fill="#fff" />
        <rect x="42" y="30" width="16" height="6" fill="#fff" />
        <rect x="42" y="36" width="16" height="8" fill="#fff" />
        {/* Hex nut portion */}
        <path d="M 36 44 L 64 44 L 60 54 L 40 54 Z" fill="#d4d4d4" />
        <line x1="45" y1="44" x2="45" y2="54" />
        <line x1="55" y1="44" x2="55" y2="54" />
        {/* Metal threaded shell */}
        <rect x="42" y="54" width="16" height="22" fill="#a3a3a3" />
        <line x1="42" y1="58" x2="58" y2="58" />
        <line x1="42" y1="62" x2="58" y2="62" />
        <line x1="42" y1="66" x2="58" y2="66" />
        <line x1="42" y1="70" x2="58" y2="70" />
        <line x1="42" y1="74" x2="58" y2="74" />
        {/* Electrode tip */}
        <rect x="48" y="76" width="4" height="6" fill="#404040" />
        <path d="M 42 76 L 42 84 L 46 84" strokeWidth="1.2" />
        {/* Dimension markings */}
        <line x1="28" y1="54" x2="28" y2="76" stroke="#999" strokeWidth="0.8" />
        <line x1="25" y1="54" x2="31" y2="54" stroke="#999" strokeWidth="0.8" />
        <line x1="25" y1="76" x2="31" y2="76" stroke="#999" strokeWidth="0.8" />
        <text x="20" y="68" fontSize="8" fontFamily="monospace" textAnchor="end" fill="#666">M14</text>
      </svg>
    );
  }

  if (name.includes("filter") && (name.includes("oil") || name.includes("spin"))) {
    // Oil Filter
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Canister body */}
        <rect x="28" y="20" width="44" height="52" rx="2" fill="#fff" />
        {/* Grip ribs at top */}
        <path d="M 28 25 L 72 25 M 28 30 L 72 30" stroke="#d4d4d4" />
        {/* Bottom base plate */}
        <rect x="30" y="72" width="40" height="6" fill="#a3a3a3" />
        {/* Threaded hole simulation */}
        <rect x="44" y="78" width="12" height="6" fill="#737373" />
        <line x1="44" y1="81" x2="56" y2="81" stroke="#fff" strokeWidth="1" />
        {/* Inner gasket circle */}
        <ellipse cx="50" cy="72" rx="14" ry="2" fill="#404040" />
        {/* Labels & dimensions */}
        <line x1="20" y1="20" x2="20" y2="72" stroke="#999" strokeWidth="0.8" />
        <line x1="17" y1="20" x2="23" y2="20" stroke="#999" strokeWidth="0.8" />
        <line x1="17" y1="72" x2="23" y2="72" stroke="#999" strokeWidth="0.8" />
        <text x="14" y="50" fontSize="8" fontFamily="monospace" textAnchor="end" fill="#666">85mm</text>
        <text x="50" y="50" fontSize="8" fontFamily="sans-serif" textAnchor="middle" fill="#a3a3a3" fontWeight="bold">FILTER</text>
      </svg>
    );
  }

  if (name.includes("alternator")) {
    // Alternator
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Outer casing */}
        <circle cx="50" cy="50" r="30" fill="#fff" />
        {/* Cooling slots (radial lines) */}
        <circle cx="50" cy="50" r="22" stroke="#e5e5e5" strokeDasharray="4 2" />
        {/* Front Pulley */}
        <circle cx="50" cy="50" r="12" fill="#d4d4d4" />
        <circle cx="50" cy="50" r="6" fill="#737373" />
        {/* Mounting ears */}
        <rect x="42" y="14" width="16" height="8" rx="2" fill="#a3a3a3" />
        <circle cx="50" cy="18" r="3" fill="#fff" />
        <rect x="42" y="78" width="16" height="8" rx="2" fill="#a3a3a3" />
        <circle cx="50" cy="82" r="3" fill="#fff" />
        {/* Electrical connection plug */}
        <rect x="76" y="42" width="8" height="16" fill="#737373" />
        {/* Dimension lines */}
        <line x1="14" y1="50" x2="86" y2="50" stroke="#999" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="50" y="93" fontSize="8" fontFamily="monospace" textAnchor="middle" fill="#666">130 Amp</text>
      </svg>
    );
  }

  if (name.includes("hose")) {
    // Radiator Hose
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Curved hose path */}
        <path d="M 15 35 C 45 35, 35 75, 85 75" stroke="#404040" strokeWidth="16" strokeLinecap="square" fill="none" />
        <path d="M 15 35 C 45 35, 35 75, 85 75" stroke="#f5f5f5" strokeWidth="12" strokeLinecap="square" fill="none" />
        {/* Hose clamps */}
        <rect x="18" y="26" width="6" height="18" fill="#d4d4d4" stroke="#404040" strokeWidth="1" />
        <rect x="76" y="66" width="6" height="18" fill="#d4d4d4" stroke="#404040" strokeWidth="1" />
        {/* Diameter callout */}
        <line x1="10" y1="23" x2="10" y2="47" stroke="#999" strokeWidth="0.8" />
        <line x1="7" y1="23" x2="13" y2="23" stroke="#999" strokeWidth="0.8" />
        <line x1="7" y1="47" x2="13" y2="47" stroke="#999" strokeWidth="0.8" />
        <text x="5" y="38" fontSize="8" fontFamily="monospace" textAnchor="end" fill="#666">1.25" ID</text>
      </svg>
    );
  }

  if (name.includes("oxygen") || name.includes("sensor")) {
    // Oxygen Sensor
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Wires */}
        <path d="M 50 10 C 48 18, 52 22, 50 30" stroke="#737373" strokeWidth="2" />
        <path d="M 47 10 C 45 18, 49 22, 47 30" stroke="#a3a3a3" />
        <path d="M 53 10 C 51 18, 55 22, 53 30" stroke="#e5e5e5" />
        {/* Rubber boot */}
        <rect x="44" y="30" width="12" height="10" rx="1" fill="#404040" />
        {/* Metal body */}
        <rect x="42" y="40" width="16" height="24" fill="#fff" />
        <path d="M 38 52 L 62 52 L 60 58 L 40 58 Z" fill="#d4d4d4" /> {/* Hex head */}
        {/* Threaded area */}
        <rect x="44" y="64" width="12" height="8" fill="#a3a3a3" />
        <line x1="44" y1="67" x2="56" y2="67" />
        <line x1="44" y1="70" x2="56" y2="70" />
        {/* Protective sensor tip */}
        <rect x="46" y="72" width="8" height="14" rx="2" fill="#737373" />
        <circle cx="50" cy="76" r="1" fill="#fff" />
        <circle cx="50" cy="81" r="1" fill="#fff" />
        {/* Dimensions */}
        <text x="66" y="60" fontSize="8" fontFamily="monospace" fill="#666">M18 x 1.5</text>
      </svg>
    );
  }

  if (name.includes("strut") || name.includes("absorber") || name.includes("shock")) {
    // Strut assembly
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Mounting pin at top */}
        <rect x="48" y="10" width="4" height="10" fill="#a3a3a3" />
        {/* Top mounting plate */}
        <rect x="36" y="20" width="28" height="6" rx="1" fill="#fff" />
        {/* Piston rod */}
        <rect x="47" y="26" width="6" height="24" fill="#e5e5e5" />
        {/* Cylinder body */}
        <rect x="40" y="50" width="20" height="34" rx="1" fill="#404040" />
        {/* Lower mounting eye */}
        <circle cx="50" cy="88" r="6" fill="#a3a3a3" />
        <circle cx="50" cy="88" r="2.5" fill="#fff" />
        {/* Coil spring overlay (simplified zigzag) */}
        <path d="M 36 28 L 64 33 L 36 38 L 64 43 L 36 48 L 64 53 L 44 56" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("cabin") || (name.includes("air") && name.includes("filter"))) {
    // Cabin Air Filter (pleated structure)
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Frame */}
        <rect x="15" y="25" width="70" height="50" fill="#fff" />
        {/* Pleat lines (diagonal patterns) */}
        <path d="M 20 25 L 20 75 M 28 25 L 28 75 M 36 25 L 36 75 M 44 25 L 44 75 M 52 25 L 52 75 M 60 25 L 60 75 M 68 25 L 68 75 M 76 25 L 76 75 M 80 25 L 80 75" stroke="#d4d4d4" strokeWidth="1.5" />
        {/* Airflow direction arrow */}
        <line x1="50" y1="10" x2="50" y2="20" stroke="#15803d" strokeWidth="1.5" />
        <path d="M 46 16 L 50 20 L 54 16" stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round" />
        <text x="58" y="17" fontSize="7" fontFamily="sans-serif" fill="#15803d" fontWeight="bold">AIR FLOW</text>
        {/* Dimensions */}
        <text x="50" y="87" fontSize="8" fontFamily="monospace" textAnchor="middle" fill="#666">220 x 200 x 30 mm</text>
      </svg>
    );
  }

  if (name.includes("injector")) {
    // Fuel injector
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Top fuel inlet */}
        <rect x="46" y="12" width="8" height="10" fill="#d4d4d4" />
        <ellipse cx="50" cy="12" rx="4" ry="1.5" fill="#737373" />
        {/* O-Ring */}
        <rect x="44" y="16" width="12" height="3" rx="1" fill="#dc2626" />
        {/* Main body */}
        <path d="M 42 22 L 58 22 L 54 62 L 46 62 Z" fill="#fff" />
        {/* Electrical connector plug on side */}
        <path d="M 54 30 L 68 34 L 66 42 L 52 38 Z" fill="#404040" />
        <rect x="64" y="38" width="4" height="2" fill="#a3a3a3" />
        {/* Bottom pintle/nozzle */}
        <rect x="47" y="62" width="6" height="14" fill="#a3a3a3" />
        <circle cx="50" cy="76" r="1.5" fill="#404040" />
        {/* O-Ring bottom */}
        <rect x="46" y="70" width="8" height="2.5" rx="0.5" fill="#dc2626" />
        {/* Spray pattern simulation */}
        <path d="M 50 78 L 42 90 M 50 78 L 46 91 M 50 78 L 54 91 M 50 78 L 58 90" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="1 1" />
      </svg>
    );
  }

  if (name.includes("wiper") || name.includes("blade")) {
    // Wiper blade
    return (
      <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Main curved wiper frame */}
        <path d="M 10 65 Q 50 45, 90 65" stroke="#404040" strokeWidth="2.5" fill="none" />
        {/* Rubber squeegee blade */}
        <path d="M 11 67 Q 50 47, 89 67" stroke="#737373" strokeWidth="1" fill="none" />
        {/* Secondary support claws */}
        <path d="M 25 59 Q 35 56, 45 57" stroke="#171717" strokeWidth="1.5" fill="none" />
        <path d="M 55 57 Q 65 56, 75 59" stroke="#171717" strokeWidth="1.5" fill="none" />
        {/* Central connector bridge */}
        <rect x="46" y="46" width="8" height="8" rx="1" fill="#d4d4d4" />
        {/* J-Hook clip shape */}
        <path d="M 48 42 C 48 40, 52 40, 52 44 L 52 48" stroke="#171717" strokeWidth="1.2" fill="none" />
        <text x="50" y="85" fontSize="8" fontFamily="monospace" textAnchor="middle" fill="#666">26 Inch</text>
      </svg>
    );
  }

  // Fallback generic mechanical nut/bolt SVG drawing
  return (
    <svg className={`${className} text-neutral-800`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Hex bolt head */}
      <path d="M 30 35 L 50 20 L 70 35 L 70 55 L 50 70 L 30 55 Z" fill="#fff" />
      <circle cx="50" cy="45" r="14" fill="#f5f5f5" />
      {/* Thread lines inside center hole */}
      <circle cx="50" cy="45" r="10" stroke="#a3a3a3" strokeDasharray="3 3" />
      <circle cx="50" cy="45" r="6" fill="#737373" />
      {/* Thread lines */}
      <line x1="50" y1="20" x2="50" y2="70" stroke="#e5e5e5" strokeDasharray="2 2" />
      <text x="50" y="85" fontSize="8" fontFamily="monospace" textAnchor="middle" fill="#666">Part Dwg</text>
    </svg>
  );
}
