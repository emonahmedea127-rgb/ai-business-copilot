import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  AlertCircle,
  Plus,
  DollarSign,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../lib/api/client';
import { db } from '../../lib/db';

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof Product>('grossProfit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // New Product Modal State
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Activewear');
  const [newProdPrice, setNewProdPrice] = useState('75.00');
  const [newProdCost, setNewProdCost] = useState('20.00');
  const [newProdStock, setNewProdStock] = useState('100');

  useEffect(() => {
    async function loadProducts() {
      try {
        const list = await api.getProducts();
        setProducts(list);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => cats.add(p.category));
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
        return matchesSearch && matchesCat && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sortBy] as number | string;
        const valB = b[sortBy] as number | string;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [products, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleSort = (field: keyof Product) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newProdPrice) || 0;
    const cost = parseFloat(newProdCost) || 0;
    const stock = parseInt(newProdStock, 10) || 0;
    const grossProfit = price - cost;
    const margin = price > 0 ? Number(((grossProfit / price) * 100).toFixed(1)) : 0;

    const created = await db.addProduct({
      name: newProdName,
      sku: newProdSku || `SKU-${Date.now().toString().slice(-4)}`,
      category: newProdCategory,
      price,
      cost,
      grossProfit,
      margin,
      unitsSold: 0,
      revenue: 0,
      stock,
      status: stock > 20 ? 'in_stock' : stock > 0 ? 'low_stock' : 'out_of_stock',
      trend: 'neutral',
      trendPercent: 0
    });

    setProducts([created, ...products]);
    setNewProductModalOpen(false);
    setNewProdName('');
    setNewProdSku('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Product Profitability & Unit Margins
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time SKU financial metrics, margin contribution percentages, and stockout velocity
          </p>
        </div>

        <button
          onClick={() => setNewProductModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Product SKU
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (&gt;25)</option>
            <option value="low_stock">Low Stock Risk (&lt;25)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Sort Trigger Button */}
        <div>
          <select
            value={sortBy}
            onChange={e => handleSort(e.target.value as keyof Product)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="grossProfit">Sort: Gross Profit ($)</option>
            <option value="margin">Sort: Profit Margin (%)</option>
            <option value="revenue">Sort: Total Revenue ($)</option>
            <option value="unitsSold">Sort: Units Sold</option>
            <option value="price">Sort: Retail Price</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-[#0c101d] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Product / SKU</th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('price')}>
                  Price / Cost
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('grossProfit')}>
                  Gross Profit
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('margin')}>
                  Margin %
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('unitsSold')}>
                  Units Sold
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('revenue')}>
                  Total Revenue
                </th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">30-Day Trend</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedProducts.map(p => {
                const isHighMargin = p.margin >= 70;
                const isLowMargin = p.margin < 50;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  >
                    {/* Name & SKU */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {p.sku} • <span className="text-slate-400">{p.category}</span>
                      </div>
                    </td>

                    {/* Price & Cost */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">${p.price.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400">COGS: ${p.cost.toFixed(2)}</div>
                    </td>

                    {/* Gross Profit */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400">
                        +${p.grossProfit.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">per unit</div>
                    </td>

                    {/* Margin % */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        isHighMargin
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                          : isLowMargin
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25'
                      }`}>
                        {p.margin}%
                      </span>
                    </td>

                    {/* Units Sold */}
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {p.unitsSold.toLocaleString()}
                    </td>

                    {/* Total Revenue */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      ${p.revenue.toLocaleString()}
                    </td>

                    {/* Stock Level */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                        p.status === 'out_of_stock'
                          ? 'text-rose-400'
                          : p.status === 'low_stock'
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.status === 'out_of_stock'
                            ? 'bg-rose-500'
                            : p.status === 'low_stock'
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-emerald-400'
                        }`} />
                        {p.stock} in stock
                      </span>
                    </td>

                    {/* Trend */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {p.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                        {p.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                        {p.trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                        <span className={`text-[11px] font-medium ${
                          p.trend === 'up' ? 'text-emerald-400' : p.trend === 'down' ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {p.trendPercent > 0 ? `+${p.trendPercent}%` : `${p.trendPercent}%`}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(p);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Showing <span className="font-semibold text-white">{Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
            <span className="font-semibold text-white">{Math.min(filteredProducts.length, currentPage * itemsPerPage)}</span> of{' '}
            <span className="font-semibold text-white">{filteredProducts.length}</span> SKU records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="px-2 text-slate-400 text-xs">
              Page <span className="font-semibold text-white">{currentPage}</span> of <span className="font-semibold text-white">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1424] border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">{selectedProduct.name}</h3>
                <span className="text-xs text-slate-400">{selectedProduct.sku} • {selectedProduct.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Retail Price</span>
                <span className="text-base font-bold text-white">${selectedProduct.price.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Product Cost (COGS)</span>
                <span className="text-base font-bold text-rose-300">${selectedProduct.cost.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Gross Profit / Unit</span>
                <span className="text-base font-bold text-emerald-400">+${selectedProduct.grossProfit.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Gross Margin %</span>
                <span className="text-base font-bold text-indigo-300">{selectedProduct.margin}%</span>
              </div>
            </div>

            {/* AI Copilot SKU Recommendation */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Price & Margin Diagnostics</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedProduct.margin >= 70
                  ? `⭐ Star SKU: Strongest profitability driver. Allocate 25% more ad budget to scale customer acquisition on this item.`
                  : selectedProduct.margin < 50
                  ? `⚠️ Margin Bleeder: COGS represents ${(100 - selectedProduct.margin).toFixed(1)}% of price. Recommend testing a +$5.00 price increase or bundling with high-margin accessories.`
                  : `Solid core item with balanced margin. Pair as checkout recommendation.`}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {newProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1424] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Product SKU</h3>
              <button onClick={() => setNewProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="e.g. Velocity Performance Running Shorts"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SKU Identifier</label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={e => setNewProdSku(e.target.value)}
                    placeholder="AURA-SH-015"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Activewear">Activewear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cost / COGS ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdCost}
                    onChange={e => setNewProdCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNewProductModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
