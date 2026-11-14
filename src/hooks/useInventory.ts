import useSWR from 'swr';
import { CarPart, Brand } from '../data/mockData';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data;
};

export function useInventory() {
  const { data: parts = [], mutate: mutateParts } = useSWR<CarPart[]>('/api/parts', fetcher);
  const { data: brands = [], mutate: mutateBrands } = useSWR<Brand[]>('/api/brands', fetcher);
  
  const isLoaded = parts.length > 0 || brands.length > 0;

  // Add a brand
  const addBrand = async (name: string) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (brands.some((b) => b.id === id || b.name.toLowerCase() === name.toLowerCase())) {
      alert("Brand already exists!");
      return;
    }

    const newBrand: Brand = { id, name, subbrands: [] };
    
    // Optimistic update
    mutateBrands([...brands, newBrand], false);

    await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'brand', name })
    });
    
    mutateBrands();
  };

  // Delete a brand
  const deleteBrand = async (id: string) => {
    // Optimistic update
    mutateBrands(brands.filter(b => b.id !== id), false);
    
    await fetch(`/api/brands/${id}`, { method: 'DELETE' });
    
    mutateBrands();
  };

  // Add a subbrand
  const addSubbrand = async (brandId: string, subbrandName: string) => {
    const targetBrand = brands.find((b) => b.id === brandId);
    if (!targetBrand) return;

    if (targetBrand.subbrands.some((s) => s.name.toLowerCase() === subbrandName.toLowerCase())) {
      alert("Subbrand already exists!");
      return;
    }

    const newSubObj = { name: subbrandName, years: ["2024", "2023", "2022", "2021", "2020"] };

    // Optimistic update
    const newBrands = brands.map((b) => 
      b.id === brandId ? { ...b, subbrands: [...b.subbrands, newSubObj] } : b
    );
    mutateBrands(newBrands, false);

    await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'subbrand', brandId, name: subbrandName, years: newSubObj.years })
    });
    
    mutateBrands();
  };

  // Delete a subbrand
  const deleteSubbrand = async (brandId: string, subbrandName: string) => {
    // Optimistic update
    const newBrands = brands.map((b) => 
      b.id === brandId ? { ...b, subbrands: b.subbrands.filter(s => s.name !== subbrandName) } : b
    );
    mutateBrands(newBrands, false);

    await fetch(`/api/brands/${brandId}/subbrands/${encodeURIComponent(subbrandName)}`, { method: 'DELETE' });

    mutateBrands();
  };

  // Add a part
  const addPart = async (part: any) => {
    const tempId = `temp-${Date.now()}`;
    const newPart = { ...part, id: tempId };
    mutateParts([newPart, ...parts], false);

    await fetch('/api/parts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(part)
    });

    mutateParts();
    return newPart;
  };

  // Update a part
  const updatePart = async (id: string, updatedFields: Partial<CarPart>) => {
    const newParts = parts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedFields,
          specifications: {
            ...p.specifications,
            ...(updatedFields.specifications || {}),
          },
        };
      }
      return p;
    });
    mutateParts(newParts, false);

    await fetch(`/api/parts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    });

    mutateParts();
  };

  // Delete a part
  const deletePart = async (id: string) => {
    mutateParts(parts.filter(p => p.id !== id), false);

    await fetch(`/api/parts/${id}`, { method: 'DELETE' });

    mutateParts();
  };

  // Quick adjust stock
  const adjustStock = async (id: string, amount: number) => {
    const part = parts.find(p => p.id === id);
    if (!part) return;

    const newStock = Math.max(0, part.stock + amount);

    const newParts = parts.map((p) => (p.id === id ? { ...p, stock: newStock } : p));
    mutateParts(newParts, false);

    await fetch(`/api/parts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock })
    });

    mutateParts();
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
