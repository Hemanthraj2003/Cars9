import { useState, useEffect } from "react";
import { CarPart, Brand, initialBrands, initialParts } from "../data/mockData";

export function useInventory() {
  const [parts, setParts] = useState<CarPart[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedParts = localStorage.getItem("carparts_inventory_parts");
      const storedBrands = localStorage.getItem("carparts_inventory_brands");

      if (storedParts) {
        setParts(JSON.parse(storedParts));
      } else {
        setParts(initialParts);
        localStorage.setItem("carparts_inventory_parts", JSON.stringify(initialParts));
      }

      if (storedBrands) {
        setBrands(JSON.parse(storedBrands));
      } else {
        setBrands(initialBrands);
        localStorage.setItem("carparts_inventory_brands", JSON.stringify(initialBrands));
      }
      setIsLoaded(true);
    }
  }, []);

  // Sync state changes with localStorage
  const saveParts = (newParts: CarPart[]) => {
    setParts(newParts);
    if (typeof window !== "undefined") {
      localStorage.setItem("carparts_inventory_parts", JSON.stringify(newParts));
    }
  };

  const saveBrands = (newBrands: Brand[]) => {
    setBrands(newBrands);
    if (typeof window !== "undefined") {
      localStorage.setItem("carparts_inventory_brands", JSON.stringify(newBrands));
    }
  };

  // Add a brand
  const addBrand = (name: string) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (brands.some((b) => b.id === id || b.name.toLowerCase() === name.toLowerCase())) {
      alert("Brand already exists!");
      return;
    }
    const newBrands = [...brands, { id, name, subbrands: [] }];
    saveBrands(newBrands);
  };

  // Delete a brand
  const deleteBrand = (id: string) => {
    const brandToDelete = brands.find((b) => b.id === id);
    if (!brandToDelete) return;
    
    // Also delete all parts belonging to this brand
    const newParts = parts.filter((p) => p.brand.toLowerCase() !== brandToDelete.name.toLowerCase());
    const newBrands = brands.filter((b) => b.id !== id);
    
    saveParts(newParts);
    saveBrands(newBrands);
  };

  // Add a subbrand to a brand
  const addSubbrand = (brandId: string, subbrandName: string) => {
    const targetBrand = brands.find((b) => b.id === brandId);
    if (!targetBrand) return;

    if (targetBrand.subbrands.some((s) => s.toLowerCase() === subbrandName.toLowerCase())) {
      alert("Subbrand already exists!");
      return;
    }

    const newBrands = brands.map((b) => {
      if (b.id === brandId) {
        return {
          ...b,
          subbrands: [...b.subbrands, subbrandName],
        };
      }
      return b;
    });
    saveBrands(newBrands);
  };

  // Delete a subbrand
  const deleteSubbrand = (brandId: string, subbrandName: string) => {
    const targetBrand = brands.find((b) => b.id === brandId);
    if (!targetBrand) return;

    // Filter out parts of this subbrand under this brand
    const newParts = parts.filter(
      (p) =>
        !(p.brand.toLowerCase() === targetBrand.name.toLowerCase() &&
          p.subbrand.toLowerCase() === subbrandName.toLowerCase())
    );

    const newBrands = brands.map((b) => {
      if (b.id === brandId) {
        return {
          ...b,
          subbrands: b.subbrands.filter((s) => s.toLowerCase() !== subbrandName.toLowerCase()),
        };
      }
      return b;
    });

    saveParts(newParts);
    saveBrands(newBrands);
  };

  // Add a part
  const addPart = (part: Omit<CarPart, "id">) => {
    // Generate an ID similar to McMaster (e.g. 9601K21)
    const maxNum = parts.reduce((max, p) => {
      const match = p.id.match(/9601K(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 20);
    
    const newId = `9601K${maxNum + 1}`;
    const newPart: CarPart = {
      ...part,
      id: newId,
    };

    const newParts = [newPart, ...parts];
    saveParts(newParts);
    return newPart;
  };

  // Update a part
  const updatePart = (id: string, updatedFields: Partial<CarPart>) => {
    const newParts = parts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedFields,
          // Ensure nested specs merge correctly if provided
          specifications: {
            ...p.specifications,
            ...(updatedFields.specifications || {}),
          },
        };
      }
      return p;
    });
    saveParts(newParts);
  };

  // Delete a part
  const deletePart = (id: string) => {
    const newParts = parts.filter((p) => p.id !== id);
    saveParts(newParts);
  };

  // Quick adjust stock
  const adjustStock = (id: string, amount: number) => {
    const newParts = parts.map((p) => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + amount);
        return { ...p, stock: newStock };
      }
      return p;
    });
    saveParts(newParts);
  };

  return {
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
  };
}
