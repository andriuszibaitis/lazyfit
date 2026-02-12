"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, X } from "lucide-react";

interface FoodProduct {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: number;
  servingUnit: string;
}

interface FoodProductSelectProps {
  value: FoodProduct | null;
  onChange: (product: FoodProduct) => void;
  placeholder?: string;
  className?: string;
}

const CATEGORIES = [
  "Mėsos gaminiai",
  "Žuvis ir jūros gėrybės",
  "Pieno produktai",
  "Kiaušiniai",
  "Daržovės",
  "Vaisiai ir uogos",
  "Grūdai ir kruopos",
  "Duonos gaminiai",
  "Riešutai ir sėklos",
  "Aliejus ir riebalai",
  "Saldumynai",
  "Gėrimai",
  "Padažai ir prieskoniai",
  "Kita",
];

export default function FoodProductSelect({
  value,
  onChange,
  placeholder = "Produkto pavadinimas",
  className = "",
}: FoodProductSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [allProducts, setAllProducts] = useState<FoodProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: CATEGORIES[0],
    serving: 100,
    servingUnit: "g",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load all products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/food-products/search?all=true`);
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data);
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search query
  useEffect(() => {
    if (query.length === 0) {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
    }
  }, [query, allProducts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (product: FoodProduct) => {
    onChange(product);
    setIsOpen(false);
    setQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (value) {
      setQuery("");
    }
  };

  const handleOpenCreateModal = () => {
    setNewProduct({
      name: query, // Pre-fill with search query
      category: CATEGORIES[0],
      serving: 100,
      servingUnit: "g",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
    setShowCreateModal(true);
    setIsOpen(false);
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/food-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const createdProduct = await response.json();
        // Add to local list
        setAllProducts((prev) => [createdProduct, ...prev]);
        // Select the new product
        onChange(createdProduct);
        setShowCreateModal(false);
        setQuery("");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayValue = isOpen ? query : value ? value.name : query;

  return (
    <>
      <div ref={selectRef} className={`relative ${className}`}>
        {/* Input field */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="w-full px-3 py-3 pr-8 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] placeholder:text-[#9FA4B0] hover:border-[#60988E] focus:outline-none focus:border-[#60988E] transition-colors"
          />
          <ChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9FA4B0] transition-transform pointer-events-none ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-lg">
            {/* Products list */}
            <div className="max-h-[250px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#60988E]" />
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelect(product)}
                    className={`w-full px-3 py-2.5 text-left hover:bg-[#F7F7F7] flex items-center justify-between transition-colors ${
                      value?.id === product.id ? "bg-[#FFF7DF]" : ""
                    }`}
                  >
                    <div>
                      <p className="text-[13px] font-medium text-[#101827]">{product.name}</p>
                      <p className="text-[11px] text-[#9FA4B0]">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-medium text-[#101827]">{product.calories} kcal</p>
                      <p className="text-[10px] text-[#9FA4B0]">100g</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-4 px-3 text-center">
                  <p className="text-[13px] text-[#9FA4B0]">Nieko nerasta...</p>
                </div>
              )}
            </div>

            {/* Create new product button */}
            <div className="border-t border-[#E6E6E6]">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="w-full px-3 py-3 text-left hover:bg-[#F7F7F7] flex items-center gap-2 text-[#60988E] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-[13px] font-medium">Sukurti naują produktą</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-[#101827]">Pridėti naują produktą</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">Kategorija</label>
                <div className="relative">
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-3 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] appearance-none bg-white focus:outline-none focus:border-[#60988E] cursor-pointer"
                    style={{ WebkitAppearance: "none", MozAppearance: "none" } as React.CSSProperties}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9FA4B0] pointer-events-none" />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">Produkto pavadinimas</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-3 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] focus:outline-none focus:border-[#60988E]"
                  placeholder="Įveskite pavadinimą"
                />
              </div>

              {/* Serving size */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">Kiekis</label>
                <div className="flex">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newProduct.serving}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      setNewProduct({ ...newProduct, serving: parseFloat(val) || 0 });
                    }}
                    className="flex-1 px-3 py-3 border border-[#E6E6E6] rounded-l-lg text-[14px] text-[#101827] focus:outline-none focus:border-[#60988E]"
                  />
                  <div className="flex border border-l-0 border-[#E6E6E6] rounded-r-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, servingUnit: "g" })}
                      className={`px-4 py-3 text-[14px] font-medium transition-colors ${
                        newProduct.servingUnit === "g"
                          ? "bg-[#60988E] text-white"
                          : "bg-white text-[#6B7280] hover:bg-gray-50"
                      }`}
                    >
                      g
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, servingUnit: "vnt" })}
                      className={`px-4 py-3 text-[14px] font-medium transition-colors ${
                        newProduct.servingUnit === "vnt"
                          ? "bg-[#60988E] text-white"
                          : "bg-white text-[#6B7280] hover:bg-gray-50"
                      }`}
                    >
                      vnt
                    </button>
                  </div>
                </div>
              </div>

              {/* Macros row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-1.5">Kalorijos</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newProduct.calories || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      setNewProduct({ ...newProduct, calories: parseFloat(val) || 0 });
                    }}
                    className="w-full px-3 py-3 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] focus:outline-none focus:border-[#60988E]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-1.5">Baltymai (g)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newProduct.protein || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      setNewProduct({ ...newProduct, protein: parseFloat(val) || 0 });
                    }}
                    className="w-full px-3 py-3 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] focus:outline-none focus:border-[#60988E]"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Macros row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-1.5">Riebalai (g)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newProduct.fat || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      setNewProduct({ ...newProduct, fat: parseFloat(val) || 0 });
                    }}
                    className="w-full px-3 py-3 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] focus:outline-none focus:border-[#60988E]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-1.5">Angliavandeniai (g)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newProduct.carbs || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      setNewProduct({ ...newProduct, carbs: parseFloat(val) || 0 });
                    }}
                    className="w-full px-3 py-3 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] focus:outline-none focus:border-[#60988E]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 border border-[#E6E6E6] rounded-xl text-[14px] font-medium text-[#101827] hover:bg-gray-50"
              >
                Atšaukti
              </button>
              <button
                onClick={handleCreateProduct}
                disabled={!newProduct.name.trim() || isSaving}
                className="flex-1 px-4 py-3 bg-[#60988E] text-white rounded-xl text-[14px] font-medium hover:bg-[#4d7a72] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saugoma..." : "Išsaugoti"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
