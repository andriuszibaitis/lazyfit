"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

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

interface FoodProductSearchProps {
  onSelect: (product: FoodProduct, quantity: number) => void;
  onClose: () => void;
}

export default function FoodProductSearch({ onSelect, onClose }: FoodProductSearchProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [allProducts, setAllProducts] = useState<FoodProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct | null>(null);
  const [quantity, setQuantity] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
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

    fetchAllProducts();
  }, []);

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

  // Calculate nutritional values based on quantity
  const calculateNutrition = (product: FoodProduct, qty: number) => {
    const multiplier = qty / 100; // Products are per 100g
    return {
      calories: Math.round(product.calories * multiplier),
      protein: Math.round(product.protein * multiplier),
      carbs: Math.round(product.carbs * multiplier),
      fat: Math.round(product.fat * multiplier),
    };
  };

  const handleSelect = () => {
    if (selectedProduct && quantity > 0) {
      onSelect(selectedProduct, quantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#EFEFEF]">
          <h2 className="text-[18px] font-semibold text-[#101827]">Pridėti produktą</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-[#EFEFEF]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9FA4B0]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ieškoti produkto..."
              className="w-full pl-10 pr-4 py-3 border border-[#E6E6E6] rounded-xl text-[14px] focus:outline-none focus:border-[#60988E]"
            />
          </div>
          {!selectedProduct && products.length > 0 && (
            <p className="text-[12px] text-[#9FA4B0] mt-2">Rasta produktų: {products.length}</p>
          )}
        </div>

        {/* Results or selected product */}
        <div className="flex-1 overflow-y-auto">
          {selectedProduct ? (
            <div className="p-4">
              {/* Selected product details */}
              <div className="bg-[#F9F9F9] rounded-xl p-4 mb-4">
                <h3 className="text-[16px] font-semibold text-[#101827] mb-1">{selectedProduct.name}</h3>
                <p className="text-[13px] text-[#6B7280] mb-4">{selectedProduct.category}</p>

                {/* Quantity input */}
                <div className="mb-4">
                  <label className="block text-[13px] text-[#6B7280] mb-2">Kiekis (g)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-[#E6E6E6] rounded-lg text-[14px] focus:outline-none focus:border-[#60988E]"
                  />
                </div>

                {/* Nutritional values */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-[12px] text-[#6B7280] mb-1">Kalorijos</p>
                    <p className="text-[16px] font-semibold text-[#101827]">
                      {calculateNutrition(selectedProduct, quantity).calories}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-[12px] text-[#6B7280] mb-1">Angliavandeniai</p>
                    <p className="text-[16px] font-semibold text-[#FFB700]">
                      {calculateNutrition(selectedProduct, quantity).carbs}g
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-[12px] text-[#6B7280] mb-1">Baltymai</p>
                    <p className="text-[16px] font-semibold text-[#60988E]">
                      {calculateNutrition(selectedProduct, quantity).protein}g
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-[12px] text-[#6B7280] mb-1">Riebalai</p>
                    <p className="text-[16px] font-semibold text-[#E74043]">
                      {calculateNutrition(selectedProduct, quantity).fat}g
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 px-4 py-3 border border-[#E6E6E6] rounded-xl text-[14px] font-medium text-[#101827] hover:bg-gray-50"
                >
                  Atgal
                </button>
                <button
                  onClick={handleSelect}
                  disabled={quantity <= 0}
                  className="flex-1 px-4 py-3 bg-[#60988E] text-white rounded-xl text-[14px] font-medium hover:bg-[#4d7a72] disabled:opacity-50"
                >
                  Pridėti
                </button>
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#60988E]" />
                </div>
              ) : products.length > 0 ? (
                <div className="divide-y divide-[#EFEFEF]">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[14px] font-medium text-[#101827]">{product.name}</p>
                        <p className="text-[12px] text-[#6B7280]">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-medium text-[#101827]">{product.calories} kcal</p>
                        <p className="text-[11px] text-[#9FA4B0]">per 100g</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-[14px] text-[#6B7280] mb-2">Produktų nerasta</p>
                  <p className="text-[12px] text-[#9FA4B0]">Pabandykite kitą paieškos frazę</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
