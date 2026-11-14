"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Search, 
  Printer, 
  Calendar, 
  Phone, 
  User, 
  Car, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Cars9Logo } from "@/components/Cars9Logo";

interface WarrantyRecord {
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
  status: string;
}

export default function PublicWarrantyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WarrantyRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(`/api/warranties?q=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setHasSearched(true);
      }
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setSearching(false);
    }
  };

  const handleWhatsAppContact = () => {
    const text = `Hello Cars9 Studio! I am inquiring about my vehicle accessory warranty. Search query: ${searchQuery}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b11] text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#080b11]/85 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio Catalog</span>
          </Link>

          <Cars9Logo size="sm" href="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Hero Search Section */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
            Digital Warranty Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Verify Your Cars9 Studio Warranty
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            All custom accessories fitted at Cars9 Studio are backed by our zero-wire-slicing guarantee and registered digitally in our studio database.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 font-mono uppercase tracking-wider">
                Search By Phone Number / Vehicle Reg / Serial No
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210, KA-05-MB-1234, or C9-SN-8291..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-28 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#161e31] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  disabled={searching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
                >
                  {searching ? "Searching..." : "Verify"}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span>Instant lookup against our nationwide studio network</span>
              <span>100% On-Site Warranty</span>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {searchResults.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Found {searchResults.length} Verified Warranty Certificate(s)</span>
                  </span>
                </div>

                {searchResults.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white dark:bg-[#0f1523] border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 print:border-none print:shadow-none"
                  >
                    {/* Certificate Top Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                      <div className="space-y-1">
                        <Cars9Logo size="sm" href="/" />
                        <span className="text-[10px] font-mono text-slate-400 block pt-1">
                          Official Digital Warranty Certificate
                        </span>
                      </div>

                      <div className="text-left sm:text-right space-y-1">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {cert.status.toUpperCase()} • VERIFIED
                        </span>
                        <div className="text-[11px] font-mono text-slate-400">
                          Cert Ref: {cert.id}
                        </div>
                      </div>
                    </div>

                    {/* Product & Vehicle Specifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-[#161e31] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          FITTED ACCESSORY & COMPONENT
                        </span>
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white font-sans">
                          {cert.productName}
                        </div>
                        <div className="text-slate-500">
                          Serial Number: <strong className="text-slate-700 dark:text-slate-300">{cert.serialNumber}</strong>
                        </div>
                        <div className="text-slate-500">
                          Invoice Reference: {cert.invoiceNo}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          VEHICLE & REGISTRATION
                        </span>
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white font-sans">
                          {cert.vehicleRegNo}
                        </div>
                        <div className="text-slate-500">
                          Registered To: {cert.customerName}
                        </div>
                        <div className="text-slate-500">
                          Studio Fitting Bay: {cert.studioLocation}
                        </div>
                      </div>
                    </div>

                    {/* Warranty Dates & Validity */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161e31]/40">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Date of Fitment
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {new Date(cert.purchaseDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161e31]/40">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Warranty Expiry
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          {new Date(cert.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161e31]/40">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Coverage Period
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {cert.warrantyMonths} Months On-Site
                        </span>
                      </div>
                    </div>

                    {/* Guarantee Terms */}
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1.5 font-mono">
                      <div className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Cars9 Zero Wire Slicing Guarantee:</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                        Fitted strictly using factory-spec coupler sockets. If any factory electrical harness issues arise during the active warranty period, our master studio technicians provide complimentary on-site inspection and immediate component replacement.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 no-print">
                      <button
                        onClick={() => window.print()}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition hover:opacity-90 flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Official Certificate</span>
                      </button>

                      <button
                        onClick={handleWhatsAppContact}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Claim or Query on WhatsApp</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-sm">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Active Warranty Certificate Found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  We couldn&apos;t locate a warranty record matching &ldquo;<strong>{searchQuery}</strong>&rdquo;. Please verify your 10-digit phone number or vehicle registration number.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleWhatsAppContact}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Contact Studio Desk on WhatsApp</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
