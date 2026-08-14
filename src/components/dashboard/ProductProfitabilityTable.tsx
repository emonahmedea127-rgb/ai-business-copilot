import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Filter
} from 'lucide-react';
import { Product, AIProductStatus } from '../../types';

interface ProductProfitabilityTableProps {
  products?: Product[];
  className?: string;
  onSelectProduct?: (product: Product) => void;
}

// Compute AI Status based on margin and velocity
export function getProductAIStatus(margin: number, unitsSold: number, stock: number): AIProductStatus {
  if (margin >= 70 && unitsSold >= 200) return 'Excellent';
  if (margin >= 55) return 'Healthy';
  if (margin >= 40) return 'Watch';
  if (margin >= 20 || stock <= 10) return 'At Risk';
  return 'Loss';
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Pro Performance Compression Tights',
    sku: 'AUR-TGT-001',
    category: 'Apparel',
    price: 88.0,
    cost: 22.5,
    grossProfit: 65.5,
    margin: 74.4,
    unitsSold: 642,
    revenue: 56496.0,
    stock: 148,
    status: 'in_stock',
    trend: 'up',
    trendPercent: 18.2
  },
  {
    id: 'p-2',
    name: 'Seamless High-Rise Ribbed Legging',
    sku: 'AUR-LGG-002',
    category: 'Apparel',
    price: 74.0,
    cost: 19.8,
    grossProfit: 54.2,
    margin: 73.2,
    unitsSold: 512,
    revenue: 37888.0,
    stock: 92,
    status: 'in_stock',
    trend: 'up',
    trendPercent: 14.5
  },
  {
    id: 'p-3',
    name: 'Merino Wool Thermal Crewneck',
    sku: 'AUR-CRW-003',
    category: 'Tops',
    price: 110.0,
    cost: 41.0,
    grossProfit: 69.0,
    margin: 62.7,
    unitsSold: 284,
    revenue: 31240.0,
    stock: 45,
    status: 'in_stock',
    trend: 'up',
    trendPercent: 8.4
  },
  {
    id: 'p-4',
    name: 'Aero Mesh Breathable Singlet',
    sku: 'AUR-SNG-004',
    category: 'Tops',
    price: 48.0,
    cost: 17.2,
    grossProfit: 30.8,
    margin: 64.2,
    unitsSold: 410,
    revenue: 19680.0,
    stock: 8,
    status: 'low_stock',
    trend: 'down',
    trendPercent: -4.2
  },
  {
    id: 'p-5',
    name: 'Heavyweight Oversized Fleece Hoodie',
    sku: 'AUR-HOD-005',
    category: 'Outerwear',
    price: 125.0,
    cost: 65.0,
    grossProfit: 60.0,
    margin: 48.0,
    unitsSold: 220,
    revenue: 27500.0,
    stock: 64,
    status: 'in_stock',
    trend: 'down',
    trendPercent: -12.1
  },
  {
    id: 'p-6',
    name: 'Endurance Trail Running Shoe',
    sku: 'AUR-SH-006',
    category: 'Footwear',
    price: 160.0,
    cost: 104.0,
    grossProfit: 56.0,
    margin: 35.0,
    unitsSold: 140,
    revenue: 22400.0,
    stock: 22,
    status: 'in_stock',
    trend: 'down',
    trendPercent: -8.5
  },
  {
    id: 'p-7',
    name: 'Recovery Foam Roller & Strap Set',
    sku: 'AUR-ACC-007',
    category: 'Accessories',
    price: 36.0,
    cost: 29.5,
    grossProfit: 6.5,
    margin: 18.1,
    unitsSold: 195,
    revenue: 7020.0,
    stock: 120,
    status: 'in_stock',
    trend: 'down',
    trendPercent: -19.4
  }
];

export const ProductProfitabilityTable: React.FC<ProductProfitabilityTableProps> = ({
  products = DEMO_PRODUCTS,
  className = '',
  onSelectProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortKey, setSortKey] = useState<'margin' | 'revenue' | 'grossProfit' | 'unitsSold'>('margin');
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedSku, setExpandedSku] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase());

        const aiStatus = getProductAIStatus(p.margin, p.unitsSold, p.stock);
        const matchesStatus = selectedStatus === 'All' || aiStatus === selectedStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [products, searchTerm, selectedStatus, sortKey, sortAsc]);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const renderStatusBadge = (status: AIProductStatus) => {
    switch (status) {
      case 'Excellent':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Excellent
          </span>
        );
      case 'Healthy':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-indigo-400" />
            Healthy
          </span>
        );
      case 'Watch':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            Watch
          </span>
        );
      case 'At Risk':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-300 border border-orange-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            At Risk
          </span>
        );
      case 'Loss':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Bleeder / Loss
          </span>
        );
    }
  };

  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800 space-y-4 ${className}`}>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-400" />
            Product Unit Economics & AI Profitability Ledger
          </h3>
          <p className="text-xs text-slate-400">
            Real-time margin intelligence, COGS waterfall, and algorithmic SKU health rating
          </p>
        </div>

        {/* Search & Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
            {(['All', 'Excellent', 'Healthy', 'Watch', 'At Risk', 'Loss'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Component */}
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900/90 tracking-wider">
                <th className="py-3 px-4">Product & SKU</th>
                <th
                  onClick={() => handleSort('revenue')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Revenue
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Unit Cost (COGS)</th>
                <th
                  onClick={() => handleSort('grossProfit')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Gross Profit
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('margin')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Margin %
                    <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('unitsSold')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Units Sold
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">AI Diagnostic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredProducts.map((p) => {
                const aiStatus = getProductAIStatus(p.margin, p.unitsSold, p.stock);
                const isExpanded = expandedSku === p.id;
                const totalProfit = p.grossProfit * p.unitsSold;

                return (
                  <React.Fragment key={p.id}>
                    <tr
                      onClick={() => {
                        setExpandedSku(isExpanded ? null : p.id);
                        if (onSelectProduct) onSelectProduct(p);
                      }}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white text-xs leading-snug">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {p.sku} • {p.category}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-white font-mono">
                        ${p.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        ${p.cost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                        +${p.grossProfit.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-bold text-xs font-mono">
                        <span
                          className={
                            p.margin >= 70
                              ? 'text-emerald-400'
                              : p.margin >= 50
                              ? 'text-indigo-300'
                              : p.margin >= 30
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }
                        >
                          {p.margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {p.unitsSold.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-between gap-2">
                          {renderStatusBadge(aiStatus)}
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Unit Economics Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#0e1424] border-b border-indigo-500/20 animate-in fade-in">
                        <td colSpan={7} className="p-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Realized Profit</span>
                              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                                ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </div>

                            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inventory Velocity</span>
                              <span className="text-sm font-bold text-white mt-0.5 block">
                                {p.stock} units in stock ({Math.round(p.stock / (p.unitsSold / 30))} days left)
                              </span>
                            </div>

                            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price vs. Cost</span>
                              <span className="text-sm font-bold text-indigo-300 mt-0.5 block">
                                ${p.price.toFixed(2)} / ${p.cost.toFixed(2)}
                              </span>
                            </div>

                            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold block">AI Strategic Action</span>
                              <span className="text-xs text-slate-300 mt-0.5 block leading-tight">
                                {p.margin >= 70
                                  ? 'Scale ad spend & bundle with lower-margin items.'
                                  : p.margin < 30
                                  ? 'Renegotiate wholesale cost or increase retail price.'
                                  : 'Maintain current campaign allocation.'}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
