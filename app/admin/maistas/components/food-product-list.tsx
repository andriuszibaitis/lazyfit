"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddFoodProductModal from "./add-food-product-modal";
import EditFoodProductModal from "./edit-food-product-modal";
import DeleteFoodProductModal from "./delete-food-product-modal";

interface FoodProduct {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  serving: number;
  servingUnit: string;
  isActive: boolean;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function FoodProductsList() {
  const router = useRouter();
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FoodProduct | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<FoodProduct | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let url = `/api/admin/food-products?page=${currentPage}&limit=10`;
      if (debouncedSearchTerm)
        url += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
      if (selectedCategory && selectedCategory !== "all")
        url += `&category=${encodeURIComponent(selectedCategory)}`;

      console.log("Fetching URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Klaida gaunant produktus: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      setProducts(data.products || []);
      setCategories(data.categories || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error("Klaida gaunant produktus:", error);
      setError(
        error instanceof Error ? error.message : "Įvyko nežinoma klaida"
      );
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (product: FoodProduct) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: FoodProduct) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchProducts();
  };

  const handleEditSuccess = () => {
    fetchProducts();
  };

  const handleDeleteSuccess = () => {
    fetchProducts();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Maisto produktų sąrašas</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#60988E] text-white hover:bg-opacity-90 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Pridėti produktą
        </Button>
      </div>

      {}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Ieškoti pagal pavadinimą..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 w-full"
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Visos kategorijos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Visos kategorijos</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {}
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {}
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#60988E] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-500">Kraunami duomenys...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">Nerasta maisto produktų</p>
          {(searchTerm || selectedCategory) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="mt-4"
            >
              Išvalyti filtrus
            </Button>
          )}
        </div>
      ) : (
        <>
          {}
          <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">Pavadinimas</TableHead>
                  <TableHead className="font-medium">Kategorija</TableHead>
                  <TableHead className="font-medium text-right">
                    Kalorijos
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    Baltymai
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    Angliavandeniai
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    Riebalai
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    Porcija
                  </TableHead>
                  <TableHead className="font-medium">Veiksmai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      {product.calories.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.protein.toFixed(1)} g
                    </TableCell>
                    <TableCell className="text-right">
                      {product.carbs.toFixed(1)} g
                    </TableCell>
                    <TableCell className="text-right">
                      {product.fat.toFixed(1)} g
                    </TableCell>
                    <TableCell className="text-right">
                      {product.serving} {product.servingUnit}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8 text-gray-500 hover:text-[#60988E]"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Redaguoti</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product)}
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Ištrinti</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {}
          <div className="grid gap-4 md:hidden">
            {products.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                      className="h-8 w-8 text-gray-500 hover:text-[#60988E]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product)}
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                  <div>
                    <p className="text-gray-500">Kalorijos</p>
                    <p className="font-medium">{product.calories.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Baltymai</p>
                    <p className="font-medium">
                      {product.protein.toFixed(1)} g
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Angliavandeniai</p>
                    <p className="font-medium">{product.carbs.toFixed(1)} g</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Riebalai</p>
                    <p className="font-medium">{product.fat.toFixed(1)} g</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Porcija</p>
                    <p className="font-medium">
                      {product.serving} {product.servingUnit}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {}
      <AddFoodProductModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        onSuccess={handleAddSuccess}
        categories={categories}
      />

      {editingProduct && (
        <EditFoodProductModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          product={editingProduct}
          onSuccess={handleEditSuccess}
          categories={categories}
        />
      )}

      {deletingProduct && (
        <DeleteFoodProductModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          product={deletingProduct}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
