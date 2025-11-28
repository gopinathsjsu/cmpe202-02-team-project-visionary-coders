
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '@/components/product-card';
import { products as allProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export default function HomePage({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);
  const [category, setCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number]>([1500]);
  const [distance, setDistance] = useState<[number]>([20]);
  const [sortBy, setSortBy] = useState<string>('relevance');

  const applyFilters = useCallback(() => {
    let tempProducts = [...allProducts];

    // Filter by search query
    if (searchQuery) {
      tempProducts = tempProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category !== 'all') {
      tempProducts = tempProducts.filter((p) => p.category === category);
    }

    tempProducts = tempProducts.filter((p) => p.price <= priceRange[0]);
    tempProducts = tempProducts.filter((p) => p.distance <= distance[0]);

    if (sortBy === 'price-asc') {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      tempProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(tempProducts);
  }, [searchQuery, category, priceRange, distance, sortBy]);
  
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);


  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="p-6 rounded-lg shadow-sm bg-card border">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="sort-by-select">Sort By</Label>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                  name="sort-by-select"
                >
                  <SelectTrigger id="sort-by-select">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category-select">Category</Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  name="category-select"
                >
                  <SelectTrigger id="category-select">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price-slider">
                  Max Price: ${priceRange[0].toLocaleString()}
                </Label>
                <Slider
                  id="price-slider"
                  min={0}
                  max={1500}
                  step={50}
                  value={priceRange}
                  onValueChange={(value: [number]) => setPriceRange(value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="distance-slider">
                  Max Distance: {distance[0]} miles
                </Label>
                <Slider
                  id="distance-slider"
                  min={0}
                  max={20}
                  step={1}
                  value={distance}
                  onValueChange={(value: [number]) => setDistance(value)}
                  className="mt-2"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button onClick={applyFilters}>Apply Filters</Button>
              </div>
            </div>
          </div>
        </aside>

        <main className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-6">Featured Items</h1>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold">No items found</h2>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
