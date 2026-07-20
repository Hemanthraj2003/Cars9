"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useInventory } from "@/hooks/useInventory";
import { CarPart, Brand } from "@/data/mockData";

import {
  Search,
  Edit2,
  Trash2,
  Plus,
  Minus,
  Download,
  RefreshCw,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Info,
  Menu,
  FileText,
} from "lucide-react";

const ImageWithLoader = ({ src, alt, id }: { src: string, alt: string, id: string }) => {
  const [loading, setLoading] = React.useState(true);
  return (
    <div className="relative w-48 h-48 my-2 flex items-center justify-center">
      {loading && <div className="absolute inset-0 flex items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin text-neutral-300" /></div>}
      <img key={id} src={src} alt={alt} onLoad={() => setLoading(false)} className={`w-full h-full object-contain relative z-10 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
};

const SearchableSelect = ({ options, value, onChange, placeholder }: { options: string[], value: string, onChange: (v: string) => void, placeholder: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState(value);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) setSearch(value);
  }, [value, isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch(value); // Revert to previous valid selection if closed without selecting
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : value}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearch(""); // Clear search to show all options
          }}
          placeholder={placeholder}
          className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600 font-sans"
        />
        <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-neutral-400 pointer-events-none" />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 shadow-lg max-h-40 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <div
                key={opt}
                className="px-2 py-1.5 hover:bg-green-50 cursor-pointer text-sm text-neutral-800"
                onClick={() => {
                  onChange(opt);
                  setSearch(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-2 py-1.5 text-neutral-500 text-[10px] italic bg-neutral-50">No matches (Must select from list)</div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const {
    parts,
    brands,
    isLoaded,
    addBrand,
    deleteBrand,
    addSubbrand,
    deleteSubbrand,
    addPart,
    updatePart,
    deletePart,
    adjustStock,
  } = useInventory();

  // Table slide animation on load for mobile discovery
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [sidebarPeekOffset, setSidebarPeekOffset] = useState("-100%");

  useEffect(() => {
    if (isLoaded && !hasAnimated && tableContainerRef.current) {
      const container = tableContainerRef.current;
      // If container is horizontally scrollable (e.g. on mobile)
      if (container.scrollWidth > container.clientWidth) {
        setHasAnimated(true);
        
        // Peek the sidebar
        setTimeout(() => setSidebarPeekOffset("-30%"), 200);
        setTimeout(() => setSidebarPeekOffset("-100%"), 1000);

        // Peek the table
        setTimeout(() => {
          container.scrollTo({ left: 120, behavior: "smooth" });
          setTimeout(() => {
            container.scrollTo({ left: 0, behavior: "smooth" });
          }, 600);
        }, 800);
      }
    }
  }, [isLoaded, hasAnimated]);

  // Mode & UI State
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSubbrand, setSelectedSubbrand] = useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string>("all");

  // Mobile View Toggles
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);

  // Collapsible brand folders in sidebar
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({
    toyota: true,
    ford: true,
    honda: true,
    bmw: true,
  });

  const [downloadAlert, setDownloadAlert] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Forms / Modals State
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingPart, setEditingPart] = useState<CarPart | null>(null);
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [showSubbrandInput, setShowSubbrandInput] = useState<string | null>(null);
  const [newSubbrandName, setNewSubbrandName] = useState("");

  // Part Form State
  const [partForm, setPartForm] = useState({
    name: "",
    brand: "",
    subbrand: "",
    sku: "",
    description: "",
    price: 0,
    stock: 0,
    location: "",
    material: "",
    dimensions: "",
    weight: "",
    oemNumber: "",
    threadSize: "",
    fitmentType: "",
  });

  const toggleBrandExpand = (brandId: string) => {
    setExpandedBrands((prev) => ({ ...prev, [brandId]: !prev[brandId] }));
  };

  // Filter and search logic
  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      // Search term matching
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        part.name.toLowerCase().includes(query) ||
        part.id.toLowerCase().includes(query) ||
        part.sku.toLowerCase().includes(query) ||
        part.brand.toLowerCase().includes(query) ||
        part.subbrand.toLowerCase().includes(query) ||
        part.location.toLowerCase().includes(query) ||
        part.specifications.oemNumber?.toLowerCase().includes(query) ||
        part.specifications.material?.toLowerCase().includes(query);

      // Sidebar Brand / Subbrand filters
      let matchesBrand = true;
      if (selectedBrand) {
        matchesBrand = part.brand.toLowerCase() === selectedBrand.toLowerCase();
      }
      let matchesSubbrand = true;
      if (selectedSubbrand) {
        matchesSubbrand = part.subbrand.toLowerCase() === selectedSubbrand.toLowerCase();
      }

      // Stock filter
      const matchesStock = !showOnlyInStock || part.stock > 0;

      // Price filter
      let matchesPrice = true;
      if (priceFilter === "under5000") {
        matchesPrice = part.price < 5000;
      } else if (priceFilter === "5000to10000") {
        matchesPrice = part.price >= 5000 && part.price <= 10000;
      } else if (priceFilter === "over10000") {
        matchesPrice = part.price > 10000;
      }

      return matchesSearch && matchesBrand && matchesSubbrand && matchesStock && matchesPrice;
    });
  }, [parts, searchTerm, selectedBrand, selectedSubbrand, showOnlyInStock, priceFilter]);

  // Set default selected part if current selected is no longer in filtered list or null
  useEffect(() => {
    if (filteredParts.length > 0) {
      if (!selectedPartId || !filteredParts.some((p) => p.id === selectedPartId)) {
        setSelectedPartId(filteredParts[0].id);
      }
    } else {
      setSelectedPartId(null);
    }
  }, [filteredParts, selectedPartId]);

  const selectedPart = useMemo(() => {
    return parts.find((p) => p.id === selectedPartId) || null;
  }, [parts, selectedPartId]);

  // Handle open modal for add/edit part
  const openPartModal = (part: CarPart | null = null) => {
    if (part) {
      setEditingPart(part);
      setPartForm({
        name: part.name,
        brand: part.brand,
        subbrand: part.subbrand,
        sku: part.sku,
        description: part.description,
        price: part.price,
        stock: part.stock,
        location: part.location,
        material: part.specifications.material || "",
        dimensions: part.specifications.dimensions || "",
        weight: part.specifications.weight || "",
        oemNumber: part.specifications.oemNumber || "",
        threadSize: part.specifications.threadSize || "",
        fitmentType: part.specifications.fitmentType || "",
      });
    } else {
      setEditingPart(null);
      setPartForm({
        name: "",
        brand: "",
        subbrand: "",
        sku: "",
        description: "",
        price: 0,
        stock: 0,
        location: "Aisle 01, Shelf A1",
        material: "",
        dimensions: "",
        weight: "",
        oemNumber: "",
        threadSize: "",
        fitmentType: "Direct Fit",
      });
    }
    setImageFile(null);
    setShowPartModal(true);
  };

  const handlePartFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partForm.name || !partForm.brand || !partForm.subbrand || !partForm.sku) {
      alert("Name, Brand, Subbrand, and SKU are required!");
      return;
    }

    const partData = {
      name: partForm.name,
      brand: partForm.brand,
      subbrand: partForm.subbrand,
      sku: partForm.sku,
      description: partForm.description,
      price: Number(partForm.price),
      stock: Number(partForm.stock),
      location: partForm.location,
      specifications: {
        material: partForm.material || undefined,
        dimensions: partForm.dimensions || undefined,
        weight: partForm.weight || undefined,
        oemNumber: partForm.oemNumber || undefined,
        threadSize: partForm.threadSize || undefined,
        fitmentType: partForm.fitmentType || undefined,
      },
      imageUrl: editingPart?.imageUrl || undefined,
    };

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.file_id) {
          partData.imageUrl = `/api/images/${data.file_id}`;
        }
      } catch (err) {
        console.error("Failed to upload image", err);
      }
    }

    if (editingPart) {
      await updatePart(editingPart.id, partData);
    } else {
      const added = await addPart(partData);
      setSelectedPartId(added.id);
    }

    setShowPartModal(false);
  };

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBrandName.trim()) {
      addBrand(newBrandName.trim());
      setNewBrandName("");
      setShowBrandInput(false);
    }
  };

  const handleCreateSubbrand = (e: React.FormEvent, brandId: string) => {
    e.preventDefault();
    if (newSubbrandName.trim()) {
      addSubbrand(brandId, newSubbrandName.trim());
      setNewSubbrandName("");
      setShowSubbrandInput(null);
    }
  };

  // Simulated CAD Download action
  const handleCadDownload = (part: CarPart, format: string) => {
    const fileContent = `MCMASTER-CARR SIMULATED CAD DATA\nPART ID: ${part.id}\nNAME: ${part.name}\nOEM: ${part.specifications.oemNumber || "N/A"}\nFORMAT: ${format}\nDIMENSIONS: ${part.specifications.dimensions || "N/A"}\nMATERIAL: ${part.specifications.material || "N/A"}\nGENERATED: ${new Date().toISOString()}`;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${part.id}_cad.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadAlert(`Downloaded simulated CAD model: ${part.id}.${format}`);
    setTimeout(() => {
      setDownloadAlert(null);
    }, 4000);
  };

  // Helper to list subbrands for the selected brand in Part Form
  const formSubbrands = useMemo(() => {
    const currentBrandObj = brands.find(
      (b) => b.name.toLowerCase() === partForm.brand.toLowerCase()
    );
    return currentBrandObj ? currentBrandObj.subbrands : [];
  }, [brands, partForm.brand]);

  // Automatically update subbrand when brand changes in the form
  useEffect(() => {
    if (formSubbrands.length > 0 && !formSubbrands.includes(partForm.subbrand)) {
      setPartForm((prev) => ({ ...prev, subbrand: formSubbrands[0] }));
    }
  }, [formSubbrands, partForm.subbrand]);

  // Loading indicator for McMaster style speed
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white font-mono text-xs text-neutral-500">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-neutral-800" />
          <span>LOADING INVENTORY DATABASE...</span>
        </div>
      </div>
    );
  }

  // Sidebar tree component rendered inside both desktop & mobile sidebar
  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-neutral-200 font-mono font-bold uppercase tracking-wider text-neutral-500 text-[10px]">
          <span>Categories / Brands</span>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowBrandInput(!showBrandInput)}
                title="Add Brand"
                className="text-green-700 hover:text-green-900"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => setShowDesktopSidebar(false)}
              title="Collapse Sidebar"
              className="text-neutral-400 hover:text-neutral-600 hidden md:block"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Add Brand input inline */}
        {showBrandInput && (
          <form onSubmit={handleCreateBrand} className="mb-2 p-1.5 border border-neutral-300 bg-white">
            <input
              type="text"
              placeholder="New Brand Name..."
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="w-full px-1.5 py-0.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600 mb-1 text-[11px]"
              autoFocus
            />
            <div className="flex justify-end gap-1">
              <button
                type="button"
                onClick={() => {
                  setShowBrandInput(false);
                  setNewBrandName("");
                }}
                className="px-1 py-0.2 bg-neutral-200 text-neutral-700 hover:bg-neutral-300 text-[10px]"
              >
                Cancel
              </button>
              <button type="submit" className="px-1 py-0.2 bg-green-700 text-white hover:bg-green-800 text-[10px]">
                Add
              </button>
            </div>
          </form>
        )}

        {/* Tree Navigation */}
        <div className="space-y-1">
          <button
            onClick={() => {
              setSelectedBrand(null);
              setSelectedSubbrand(null);
              setShowMobileSidebar(false);
            }}
            className={`w-full text-left font-mono py-1.5 px-1.5 flex items-center justify-between border ${
              !selectedBrand
                ? "bg-green-50 border-green-200 font-bold text-green-800"
                : "border-transparent hover:bg-neutral-100 text-neutral-700"
            }`}
          >
            <span>ALL PRODUCTS</span>
            <span className="bg-neutral-200/60 text-neutral-600 text-[9px] px-1 rounded-full font-sans font-normal">
              {parts.length}
            </span>
          </button>

          {brands.map((brand) => {
            const isSelected = selectedBrand?.toLowerCase() === brand.id;
            const isExpanded = expandedBrands[brand.id];
            const brandPartsCount = parts.filter(
              (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
            ).length;

            return (
              <div key={brand.id} className="space-y-0.5">
                <div
                  className={`w-full flex items-center justify-between py-0.5 px-1 border ${
                    isSelected && !selectedSubbrand
                      ? "bg-green-50 border-green-200 font-bold text-green-800"
                      : "border-transparent hover:bg-neutral-100 text-neutral-700"
                  }`}
                >
                  <button
                    onClick={() => toggleBrandExpand(brand.id)}
                    className="p-0.5 text-neutral-400 hover:text-neutral-600"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>

                  <span
                    onClick={() => {
                      setSelectedBrand(brand.id);
                      setSelectedSubbrand(null);
                      setShowMobileSidebar(false);
                    }}
                    className="flex-1 text-left pl-1 font-mono cursor-pointer truncate"
                  >
                    {brand.name}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="bg-neutral-200/60 text-neutral-500 text-[9px] px-1 rounded-full font-sans font-normal">
                      {brandPartsCount}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => deleteBrand(brand.id)}
                        title={`Delete brand ${brand.name}`}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Subbrands listing */}
                {isExpanded && (
                  <div className="pl-4 border-l border-neutral-200 ml-2 space-y-0.5">
                    {brand.subbrands.map((subbrand) => {
                      const isSubSelected =
                        isSelected && selectedSubbrand?.toLowerCase() === subbrand.toLowerCase();
                      const subPartsCount = parts.filter(
                        (p) =>
                          p.brand.toLowerCase() === brand.name.toLowerCase() &&
                          p.subbrand.toLowerCase() === subbrand.toLowerCase()
                      ).length;

                      return (
                        <div
                          key={subbrand}
                          className={`flex items-center justify-between py-0.5 px-1.5 border text-[11px] ${
                            isSubSelected
                              ? "bg-green-50 border-green-200 font-bold text-green-800"
                              : "border-transparent hover:bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          <span
                            onClick={() => {
                              setSelectedBrand(brand.id);
                              setSelectedSubbrand(subbrand);
                              setShowMobileSidebar(false);
                            }}
                            className="flex-1 text-left font-sans cursor-pointer truncate"
                          >
                            {subbrand}
                          </span>

                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-neutral-400">({subPartsCount})</span>
                            {isAdmin && (
                              <button
                                onClick={() => deleteSubbrand(brand.id, subbrand)}
                                title={`Delete subbrand ${subbrand}`}
                                className="text-neutral-400 hover:text-red-600"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Add subbrand button inside brand folder */}
                    {isAdmin && (
                      <div className="pt-0.5">
                        {showSubbrandInput === brand.id ? (
                          <form
                            onSubmit={(e) => handleCreateSubbrand(e, brand.id)}
                            className="p-1 border border-neutral-300 bg-white"
                          >
                            <input
                              type="text"
                              placeholder="Subbrand..."
                              value={newSubbrandName}
                              onChange={(e) => setNewSubbrandName(e.target.value)}
                              className="w-full px-1 py-0.2 border border-neutral-200 text-neutral-800 text-[10px]"
                              autoFocus
                            />
                            <div className="flex justify-end gap-0.5 mt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowSubbrandInput(null);
                                  setNewSubbrandName("");
                                }}
                                className="px-1 bg-neutral-200 text-[9px] py-0.1"
                              >
                                Cancel
                              </button>
                              <button type="submit" className="px-1 bg-green-700 text-white text-[9px] py-0.1">
                                Add
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => setShowSubbrandInput(brand.id)}
                            className="text-[10px] text-blue-700 hover:underline flex items-center gap-0.5 font-mono ml-1 py-0.5"
                          >
                            <Plus className="h-2.5 w-2.5" /> Add Subbrand
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-200 text-neutral-500 font-mono text-[10px] space-y-1">
        <span className="font-bold text-neutral-600">INVENTORY METRICS:</span>
        <div>Unique parts: {parts.length}</div>
        <div>Total items: {parts.reduce((sum, p) => sum + p.stock, 0)}</div>
      </div>
    </div>
  );

  // Specifications panel details content (shared between desktop drawer & mobile modal)
  const SpecificationsContent = (
    selectedPart: CarPart,
    isMobile: boolean = false
  ) => {
    const inStock = selectedPart.stock > 0;
    return (
      <div className="space-y-4">
        {/* Part Title and ID */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold tracking-wider">
              PART ID: {selectedPart.id}
            </div>
            <h2 className="text-sm font-bold text-neutral-900 leading-tight mt-0.5">
              {selectedPart.name}
            </h2>
            <div className="font-mono text-[10px] text-neutral-500 mt-1">
              SKU: {selectedPart.sku} | OEM: {selectedPart.specifications.oemNumber || "N/A"}
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setShowMobileDetails(false)}
              className="text-neutral-400 hover:text-neutral-600 bg-neutral-100 p-1 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Product Image */}
        <div className="border border-neutral-300 bg-white p-3 flex flex-col items-center justify-center relative rounded shadow-sm">
          <span className="absolute top-1 left-1.5 text-[8px] font-mono text-neutral-400 uppercase tracking-widest font-bold z-10">
            PRODUCT IMAGE
          </span>
          {selectedPart.imageUrl ? (
            <ImageWithLoader id={selectedPart.id} src={selectedPart.imageUrl} alt={selectedPart.name} />
          ) : (
            <div className="w-48 h-48 bg-neutral-50 flex items-center justify-center text-neutral-300 font-mono text-[10px] my-2">NO IMAGE</div>
          )}
          <div className="w-full border-t border-neutral-200 mt-2 pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-500">
            <span>VERIFIED FIT</span>
            <span>HIGH RES</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="font-mono font-bold uppercase text-[9px] text-neutral-400 tracking-wider">
            Description
          </div>
          <p className="text-neutral-700 leading-normal text-[11px] font-sans">
            {selectedPart.description}
          </p>
        </div>

        {/* Tech Specs Table */}
        <div className="space-y-1.5">
          <div className="font-mono font-bold uppercase text-[9px] text-neutral-400 tracking-wider">
            Technical Specifications
          </div>
          <table className="w-full text-left border-collapse text-[10px] font-mono">
            <tbody>
              <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                <td className="py-1 text-neutral-500 font-bold uppercase w-24">Brand</td>
                <td className="py-1 text-neutral-800">{selectedPart.brand}</td>
              </tr>
              <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                <td className="py-1 text-neutral-500 font-bold uppercase">Subbrand</td>
                <td className="py-1 text-neutral-800">{selectedPart.subbrand}</td>
              </tr>
              {selectedPart.specifications.material && (
                <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                  <td className="py-1 text-neutral-500 font-bold uppercase">Material</td>
                  <td className="py-1 text-neutral-800">{selectedPart.specifications.material}</td>
                </tr>
              )}
              {selectedPart.specifications.dimensions && (
                <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                  <td className="py-1 text-neutral-500 font-bold uppercase">Dimensions</td>
                  <td className="py-1 text-neutral-800">{selectedPart.specifications.dimensions}</td>
                </tr>
              )}
              {selectedPart.specifications.weight && (
                <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                  <td className="py-1 text-neutral-500 font-bold uppercase">Weight</td>
                  <td className="py-1 text-neutral-800">{selectedPart.specifications.weight}</td>
                </tr>
              )}
              {selectedPart.specifications.threadSize && (
                <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                  <td className="py-1 text-neutral-500 font-bold uppercase">Thread Size</td>
                  <td className="py-1 text-neutral-800">{selectedPart.specifications.threadSize}</td>
                </tr>
              )}
              {selectedPart.specifications.fitmentType && (
                <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                  <td className="py-1 text-neutral-500 font-bold uppercase">Fitment Type</td>
                  <td className="py-1 text-neutral-800">{selectedPart.specifications.fitmentType}</td>
                </tr>
              )}
              {selectedPart.specifications.operatingTemp && (
                <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                  <td className="py-1 text-neutral-500 font-bold uppercase">Temp Range</td>
                  <td className="py-1 text-neutral-800">{selectedPart.specifications.operatingTemp}</td>
                </tr>
              )}
              <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                <td className="py-1 text-neutral-500 font-bold uppercase">Warehouse Loc</td>
                <td className="py-1 text-neutral-800">{selectedPart.location}</td>
              </tr>
              <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                <td className="py-1 text-neutral-500 font-bold uppercase">Current Stock</td>
                <td className={`py-1 font-bold ${selectedPart.stock === 0 ? "text-red-600" : "text-neutral-800"}`}>
                  {selectedPart.stock} units
                </td>
              </tr>
              <tr className="border-b border-neutral-200 hover:bg-neutral-100">
                <td className="py-1 text-neutral-500 font-bold uppercase">Unit Price</td>
                <td className="py-1 text-neutral-800 font-bold">₹{selectedPart.price.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>


      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-white text-neutral-800 font-sans text-xs">
      
      {/* 1. TOP DENSE BANNER */}
      <div className="bg-[#005a2b] text-[#ffd600] px-4 py-3 flex justify-between items-center border-b border-neutral-300 font-mono text-[11px] font-bold tracking-wide">
        <div className="flex items-center gap-2">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="md:hidden text-white mr-1 hover:text-[#ffd600]"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-white text-xs font-serif font-black tracking-normal">CarParts.</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/25 px-2 py-0.5 rounded text-white font-normal">
            <span className="text-neutral-300 text-[9px] sm:text-[10px]">ROLE:</span>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition-colors ${
                isAdmin ? "bg-red-600 text-white" : "bg-blue-600 text-white"
              }`}
            >
              {isAdmin ? "ADMIN CONSOLE" : "USER (BROWSE)"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & SEARCH BAR */}
      <div className="border-b border-neutral-200 px-4 py-3 bg-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 max-w-2xl relative">
          <div className="flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Find parts by Name, Brand, SKU, OEM Number, Material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-neutral-300 bg-white text-neutral-800 font-mono focus:border-green-600 focus:outline-none placeholder:text-neutral-400 text-sm shadow-sm"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button className="bg-[#ffd600] border border-l-0 border-neutral-300 px-4 py-1.5 font-bold font-mono text-neutral-900 hover:bg-[#ffe554] active:bg-[#e6c100] text-xs shadow-sm transition-colors uppercase">
              Search
            </button>
          </div>
          {/* Quick links below search */}
          <div className="flex gap-3 mt-1.5 py-2 text-neutral-500 font-mono text-[10px] items-center overflow-x-auto whitespace-nowrap">
            <span className="font-bold">QUICK SEARCH:</span>
            {["Brake Pad", "Spark Plug", "Oil Filter", "Alternator", "Strut"].map((term) => (
              <button
                key={term}
                onClick={() => setSearchTerm(term)}
                className="text-blue-700 hover:underline cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and View Controls */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-neutral-600 font-mono">
          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs">
            <input
              type="checkbox"
              checked={showOnlyInStock}
              onChange={(e) => setShowOnlyInStock(e.target.checked)}
              className="rounded border-neutral-300 text-green-700 focus:ring-green-600"
            />
            <span>In-Stock Only</span>
          </label>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
            <span>Price:</span>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="bg-white border border-neutral-300 rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-green-600 font-mono"
            >
              <option value="all">All Prices</option>
              <option value="under5000">Under ₹5000</option>
              <option value="5000to10000">₹5000 to ₹10000</option>
              <option value="over10000">Over ₹10000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert message for CAD downloads */}
      {downloadAlert && (
        <div className="bg-green-50 border-b border-green-200 text-green-800 px-4 py-1.5 font-mono text-[11px] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-green-600" />
            {downloadAlert}
          </span>
          <button onClick={() => setDownloadAlert(null)} className="text-green-600 hover:text-green-800">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* 3. WORKSPACE CONTAINER */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* MOBILE SIDEBAR DRAWERS */}
        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/40" onClick={() => setShowMobileSidebar(false)} />
            <div className="relative w-64 max-w-xs bg-white h-full shadow-2xl flex flex-col p-3 z-50 animate-slide-in">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono font-bold text-xs uppercase text-neutral-800">NAVIGATE BRANDS</span>
                <button onClick={() => setShowMobileSidebar(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent />
              </div>
            </div>
          </div>
        )}

        {/* MOBILE SIDEBAR PEEK ANIMATION */}
        {!showMobileSidebar && (
          <div 
            className="fixed inset-y-0 left-0 z-40 flex md:hidden pointer-events-none transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(${sidebarPeekOffset})` }}
          >
            <div className="relative w-64 max-w-xs bg-white h-full shadow-2xl flex flex-col p-3 z-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono font-bold text-xs uppercase text-neutral-800">NAVIGATE BRANDS</span>
                <button className="text-neutral-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden opacity-50">
                <SidebarContent />
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP SIDEBAR */}
        <aside className={`border-r border-neutral-200 bg-neutral-50/70 select-none hidden md:flex flex-col transition-all duration-300 ${showDesktopSidebar ? 'w-56 p-3 overflow-y-auto' : 'w-10 py-3 items-center'}`}>
          {!showDesktopSidebar && (
            <div className="flex justify-center w-full">
              <button
                onClick={() => setShowDesktopSidebar(true)}
                className="text-neutral-500 hover:text-neutral-800"
                title="Expand Sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          )}
          {showDesktopSidebar && <SidebarContent />}
        </aside>

        {/* MIDDLE CONTENT: TABLE & RESULTS */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Path breadcrumbs */}
          <div className="px-4 py-2 border-b border-neutral-200 bg-neutral-50/40 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="text-blue-700 hover:underline cursor-pointer" onClick={() => { setSelectedBrand(null); setSelectedSubbrand(null); }}>
                PARTS CATALOG
              </span>
              {selectedBrand && (
                <>
                  <span className="mx-1 text-neutral-300">&gt;</span>
                  <span
                    className="text-blue-700 hover:underline cursor-pointer"
                    onClick={() => {
                      setSelectedSubbrand(null);
                    }}
                  >
                    {brands.find((b) => b.id === selectedBrand)?.name}
                  </span>
                </>
              )}
              {selectedSubbrand && (
                <>
                  <span className="mx-1 text-neutral-300">&gt;</span>
                  <span className="text-neutral-700 font-bold uppercase">{selectedSubbrand}</span>
                </>
              )}
            </div>
            <div className="text-neutral-500 font-sans text-[10px] shrink-0">
              Showing <span className="font-bold text-neutral-800">{filteredParts.length}</span> items
            </div>
          </div>

          {/* Add Part Button in Admin View */}
          {isAdmin && (
            <div className="px-4 py-2 border-b border-neutral-200 bg-red-50/30 flex justify-between items-center">
              <span className="font-mono text-red-800 text-[10px] sm:text-[11px] font-bold">ADMIN ACTIONS AVAILABLE</span>
              <button
                onClick={() => openPartModal(null)}
                className="bg-green-700 hover:bg-green-800 text-white font-bold px-3 py-1 flex items-center gap-1 border border-green-800 font-mono shadow-sm transition-colors text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>ADD NEW PART</span>
              </button>
            </div>
          )}

          {/* Tabular Parts Grid */}
          <div ref={tableContainerRef} className="flex-1 overflow-auto">
            {filteredParts.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-mono">
                NO PARTS MATCH THE CURRENT SEARCH OR FILTER CRITERIA.
              </div>
            ) : (
              <div className="min-w-full inline-block align-middle">
                {/* Mobile scroll indicator */}
                <div className="md:hidden flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-neutral-500 font-mono text-[10px] rounded mb-2 border border-neutral-200">
                  <Info className="h-3 w-3" />
                  <span>Swipe table left/right to view more columns</span>
                </div>
                <table className="min-w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 font-mono text-[10px] tracking-wider sticky top-0 uppercase">
                      <th className="py-2 px-3 border-r border-neutral-200 w-24">Part ID</th>
                      <th className="py-2 px-3 border-r border-neutral-200 min-w-[150px]">Product Name</th>
                      <th className="py-2 px-3 border-r border-neutral-200 w-20">Brand</th>
                      <th className="py-2 px-3 border-r border-neutral-200 w-20">Model</th>
                      <th className="py-2 px-3 border-r border-neutral-200 w-20 hidden sm:table-cell">Location</th>
                      <th className="py-2 px-3 border-r border-neutral-200 w-24 text-center">Stock Level</th>
                      <th className="py-2 px-3 border-r border-neutral-200 w-16 text-right">Price</th>
                      {isAdmin && <th className="py-2 px-3 text-center w-20">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-[11px] font-mono">
                    {filteredParts.map((part) => {
                      const isSelected = part.id === selectedPartId;
                      const inStock = part.stock > 0;

                      return (
                        <tr
                          key={part.id}
                          className={`hover:bg-[#fffdeb] cursor-pointer group ${
                            isSelected ? "bg-[#fffde0] font-medium" : ""
                          }`}
                          onClick={() => {
                            setSelectedPartId(part.id);
                            // On mobile, selecting a part triggers the slide-up modal details
                            if (window.innerWidth < 768) {
                              setShowMobileDetails(true);
                            }
                          }}
                        >
                          {/* Part Number */}
                          <td className="py-2 px-3 border-r border-neutral-200 text-blue-700 font-bold font-mono">
                            <span className="hover:underline">{part.id}</span>
                          </td>

                          {/* Product Name */}
                          <td className="py-2 px-3 border-r border-neutral-200 font-sans text-neutral-900 font-medium">
                            {part.name}
                          </td>

                          {/* Brand */}
                          <td className="py-2 px-3 border-r border-neutral-200 truncate">{part.brand}</td>

                          {/* Subbrand */}
                          <td className="py-2 px-3 border-r border-neutral-200 truncate">{part.subbrand}</td>

                          {/* Location */}
                          <td className="py-2 px-3 border-r border-neutral-200 text-neutral-500 font-mono text-[10px] hidden sm:table-cell">
                            {part.location}
                          </td>

                          {/* Stock Level */}
                          <td className="py-2 px-3 border-r border-neutral-200" onClick={(e) => e.stopPropagation()}>
                            {isAdmin ? (
                              <div className="flex items-center justify-between px-1 w-full gap-1">
                                <button
                                  onClick={() => adjustStock(part.id, -1)}
                                  className="p-0.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded border border-neutral-300"
                                >
                                  <Minus className="h-2.5 w-2.5" />
                                </button>
                                <span className={`w-6 text-center font-bold ${!inStock ? "text-red-600" : ""}`}>
                                  {part.stock}
                                </span>
                                <button
                                  onClick={() => adjustStock(part.id, 1)}
                                  className="p-0.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded border border-neutral-300"
                                >
                                  <Plus className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-center">
                                {inStock ? (
                                  <span className="text-green-700 font-bold">{part.stock}</span>
                                ) : (
                                  <span className="bg-red-50 text-red-700 border border-red-200 px-1 py-0.2 text-[8px] rounded font-bold uppercase">
                                    OUT
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Price */}
                          <td className="py-2 px-3 border-r border-neutral-200 text-right text-neutral-900 font-bold">
                            ₹{part.price.toFixed(2)}
                          </td>

                          {/* Actions (Admin Only) */}
                          {isAdmin && (
                            <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => openPartModal(part)}
                                  className="text-blue-700 hover:text-blue-900 p-0.5"
                                  title="Edit Part Details"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete part ${part.name} (${part.id})?`)) {
                                      deletePart(part.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-800 p-0.5"
                                  title="Delete Part"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* MOBILE BOTTOM SPECS DRAWING PREVIEW BUTTON */}
        {!isAdmin && selectedPart && (
          <button
            onClick={() => setShowMobileDetails(true)}
            className="md:hidden fixed bottom-4 right-4 z-40 bg-[#005a2b] hover:bg-[#004722] text-[#ffd600] px-4 py-2 rounded-full border border-green-800 flex items-center gap-1.5 shadow-lg font-mono font-bold text-xs"
          >
            <FileText className="h-4 w-4" />
            <span>VIEW TECH SPECS</span>
          </button>
        )}

        {/* MOBILE DETAILS MODAL */}
        {showMobileDetails && selectedPart && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileDetails(false)} />
            <div className="relative w-full max-w-md bg-white ml-auto h-full shadow-2xl flex flex-col p-4 z-50 overflow-y-auto animate-slide-in">
              {SpecificationsContent(selectedPart, true)}
            </div>
          </div>
        )}

        {/* DESKTOP DETAILS DRAWER (RIGHT PANEL) */}
        <aside className="w-80 border-l border-neutral-200 overflow-y-auto bg-neutral-50/50 p-4 hidden md:flex md:flex-col gap-4">
          {selectedPart ? (
            SpecificationsContent(selectedPart, false)
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-400 font-mono text-center p-4">
              SELECT A ROW IN THE TABLE TO VIEW CAD DRAWINGS AND DETAILED SPECS.
            </div>
          )}
        </aside>

      </div>

      {/* 4. MODAL: ADD / EDIT PART */}
      {showPartModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col rounded">
            
            {/* Modal Header */}
            <div className="bg-[#005a2b] text-[#ffd600] px-4 py-2.5 flex justify-between items-center font-mono text-xs font-bold">
              <span>{editingPart ? `EDIT PART DETAILS - ${editingPart.id}` : "ADD NEW CAR PART TO CATALOG"}</span>
              <button onClick={() => setShowPartModal(false)} className="text-white hover:text-[#ffd600]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handlePartFormSubmit} className="p-4 space-y-4 text-[11px] font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Image Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-neutral-500 font-bold mb-1">PRODUCT IMAGE (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600 bg-white"
                  />
                  {editingPart?.imageUrl && !imageFile && (
                    <div className="mt-1 text-[10px] text-green-600">Current image is kept if no new image is uploaded.</div>
                  )}
                </div>

                {/* Part Name */}
                <div className="sm:col-span-2">
                  <label className="block text-neutral-500 font-bold mb-1">PRODUCT NAME *</label>
                  <input
                    type="text"
                    required
                    value={partForm.name}
                    onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600 font-sans"
                    placeholder="e.g. Front Brake Pad Set"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">BRAND *</label>
                  <SearchableSelect 
                    options={brands.map(b => b.name)} 
                    value={partForm.brand} 
                    onChange={(v) => setPartForm({ ...partForm, brand: v })} 
                    placeholder="Search or type new brand..."
                  />
                </div>

                {/* Subbrand */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">SUBBRAND (MODEL) *</label>
                  <SearchableSelect 
                    options={formSubbrands} 
                    value={partForm.subbrand} 
                    onChange={(v) => setPartForm({ ...partForm, subbrand: v })} 
                    placeholder="Search or type new model..."
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">SKU / MFG CODE *</label>
                  <input
                    type="text"
                    required
                    value={partForm.sku}
                    onChange={(e) => setPartForm({ ...partForm, sku: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                    placeholder="e.g. BP-TY-CAM-10"
                  />
                </div>

                {/* Warehouse Location */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">WAREHOUSE LOCATION</label>
                  <input
                    type="text"
                    value={partForm.location}
                    onChange={(e) => setPartForm({ ...partForm, location: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                    placeholder="e.g. Aisle 04, Shelf C1"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">PRICE (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={partForm.price || ""}
                    onChange={(e) => setPartForm({ ...partForm, price: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                  />
                </div>

                {/* Stock Level */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">INITIAL STOCK LEVEL</label>
                  <input
                    type="number"
                    min="0"
                    value={partForm.stock === 0 ? "0" : partForm.stock}
                    onChange={(e) => setPartForm({ ...partForm, stock: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-neutral-500 font-bold mb-1">TECHNICAL DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={partForm.description}
                    onChange={(e) => setPartForm({ ...partForm, description: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600 font-sans"
                    placeholder="Provide description of fitting, use, safety ratings, etc."
                  />
                </div>

                {/* SPECIFICATIONS SUB-HEADER */}
                <div className="sm:col-span-2 border-b border-neutral-200 pb-1 mt-2 text-neutral-500 font-bold uppercase text-[10px]">
                  Technical Dimensions & Specifications
                </div>

                {/* Material */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">MATERIAL COMPOSITION</label>
                  <input
                    type="text"
                    value={partForm.material}
                    onChange={(e) => setPartForm({ ...partForm, material: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                    placeholder="e.g. Ceramic / Alloy Steel"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">DIMENSIONS</label>
                  <input
                    type="text"
                    value={partForm.dimensions}
                    onChange={(e) => setPartForm({ ...partForm, dimensions: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                    placeholder="e.g. 134.5 mm x 57.2 mm"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">WEIGHT</label>
                  <input
                    type="text"
                    value={partForm.weight}
                    onChange={(e) => setPartForm({ ...partForm, weight: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                    placeholder="e.g. 2.1 lbs"
                  />
                </div>

                {/* OEM Number */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">OEM PART NUMBER REFERENCE</label>
                  <input
                    type="text"
                    value={partForm.oemNumber}
                    onChange={(e) => setPartForm({ ...partForm, oemNumber: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                    placeholder="e.g. 04465-06100"
                  />
                </div>

                {/* Thread Size */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">THREAD SIZE (IF APPLICABLE)</label>
                  <input
                    type="text"
                    value={partForm.threadSize}
                    onChange={(e) => setPartForm({ ...partForm, threadSize: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                    placeholder="e.g. M14 x 1.25"
                  />
                </div>

                {/* Fitment Type */}
                <div>
                  <label className="block text-neutral-500 font-bold mb-1">FITMENT TYPE</label>
                  <input
                    type="text"
                    value={partForm.fitmentType}
                    onChange={(e) => setPartForm({ ...partForm, fitmentType: e.target.value })}
                    className="w-full px-2 py-1.5 border border-neutral-300 text-neutral-800 focus:outline-none focus:border-green-600"
                    placeholder="e.g. Direct Fit / Press-on"
                  />
                </div>

              </div>

              {/* Form Footer */}
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPartModal(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100 font-bold shadow-sm transition-colors text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-700 text-white hover:bg-green-800 font-bold shadow-sm transition-colors text-xs border border-green-800"
                >
                  {editingPart ? "UPDATE PART" : "SAVE TO CATALOG"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
