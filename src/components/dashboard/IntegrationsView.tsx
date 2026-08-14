import React, { useState } from 'react';
import {
  Plug,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Store,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X,
  CreditCard,
  ShoppingBag,
  TrendingUp,
  Sliders,
  Settings,
  Database,
  Check,
  ChevronRight,
  Eye
} from 'lucide-react';
import { parseAndValidateCSV, SAMPLE_CSV_DATA } from '../../lib/csv/parser';
import { db } from '../../lib/db';
import { CSVParseResult, Product } from '../../types';

interface IntegrationCardData {
  id: string;
  name: string;
  category: 'store' | 'payment' | 'ads' | 'file';
  icon: React.ReactNode;
  status: 'connected' | 'not_connected' | 'syncing';
  description: string;
  lastSynced?: string;
  connectedAccount?: string;
  metricsLabel?: string;
  metricsValue?: string;
}

export const IntegrationsView: React.FC = () => {
  const [integrationsList, setIntegrationsList] = useState<IntegrationCardData[]>([
    {
      id: 'shopify',
      name: 'Shopify Storefront Sync',
      category: 'store',
      icon: <Store className="w-5 h-5 text-emerald-400" />,
      status: 'connected',
      description: 'Real-time two-way synchronization of order history, product inventory, and customer lifetime values.',
      lastSynced: '2 minutes ago',
      connectedAccount: 'aura-athletics.myshopify.com',
      metricsLabel: 'Active Synced SKUs',
      metricsValue: '1,420 Items'
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce REST API',
      category: 'store',
      icon: <ShoppingBag className="w-5 h-5 text-purple-400" />,
      status: 'not_connected',
      description: 'Connect WordPress / WooCommerce stores for multi-channel sales and centralized inventory consolidation.',
      lastSynced: 'Never',
      connectedAccount: 'Not configured'
    },
    {
      id: 'amazon',
      name: 'Amazon SP-API (Seller Central)',
      category: 'store',
      icon: <Store className="w-5 h-5 text-amber-400" />,
      status: 'not_connected',
      description: 'FBA & FBM sales data, Amazon advertising fees, and automated inventory restock alerts.',
      lastSynced: 'Never',
      connectedAccount: 'Not configured'
    },
    {
      id: 'stripe',
      name: 'Stripe Billing & Subscriptions',
      category: 'payment',
      icon: <CreditCard className="w-5 h-5 text-indigo-400" />,
      status: 'connected',
      description: 'Synchronizes transaction fees, chargebacks, customer payment success rates, and payout schedules.',
      lastSynced: '14 minutes ago',
      connectedAccount: 'acct_1Mh88x29... (Live)',
      metricsLabel: 'Fee Attribution',
      metricsValue: '2.9% + $0.30'
    },
    {
      id: 'google_ads',
      name: 'Google Ads & Performance Max',
      category: 'ads',
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
      status: 'connected',
      description: 'Ingests keyword search ad spend, Performance Max ROAS, and conversion attribution models.',
      lastSynced: '1 hour ago',
      connectedAccount: 'Google Ads (ID: 942-108-3310)',
      metricsLabel: 'Blended ROAS',
      metricsValue: '3.82x'
    },
    {
      id: 'meta_ads',
      name: 'Meta Ads Manager (FB & IG)',
      category: 'ads',
      icon: <TrendingUp className="w-5 h-5 text-cyan-400" />,
      status: 'connected',
      description: 'Real-time campaign spend, CPA tracking, and creative fatigue diagnostics for Instagram & Facebook.',
      lastSynced: '25 minutes ago',
      connectedAccount: 'Meta Business Suite (Act: 884021)',
      metricsLabel: 'Campaign Blended CAC',
      metricsValue: '$21.40'
    }
  ]);

  // Modal / Drawer state for manage integration
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationCardData | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // CSV Flow Wizard: step 1 (upload), step 2 (map), step 3 (preview), step 4 (imported)
  const [csvStep, setCsvStep] = useState<1 | 2 | 3 | 4>(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState<string>('');
  const [parsedData, setParsedData] = useState<CSVParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Column Mappings
  const [columnMappings, setColumnMappings] = useState({
    name: 'Product Name',
    sku: 'SKU',
    category: 'Category',
    price: 'Price',
    cost: 'Cost',
    stock: 'Stock'
  });

  const handleFileUpload = (file: File) => {
    setCsvFile(file);
    setImportSuccess(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvText(text);
      validateAndPreview(text, file.name);
      setCsvStep(2);
    };
    reader.readAsText(file);
  };

  const validateAndPreview = (text: string, fileName?: string) => {
    setIsProcessing(true);
    try {
      const result = parseAndValidateCSV(text, fileName || 'catalog.csv');
      setParsedData(result);
    } catch (err) {
      console.error('CSV Parsing Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplySample = () => {
    setCsvText(SAMPLE_CSV_DATA);
    setCsvFile(new File([SAMPLE_CSV_DATA], 'sample_catalog.csv', { type: 'text/csv' }));
    validateAndPreview(SAMPLE_CSV_DATA, 'sample_catalog.csv');
    setCsvStep(2);
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_DATA], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ai_copilot_sample_catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = async () => {
    if (!parsedData || parsedData.validRows === 0) return;

    const validProds: Omit<Product, 'id'>[] = [];
    parsedData.previewRows.forEach(row => {
      if (row.isValid && row.parsed) {
        validProds.push(row.parsed as Omit<Product, 'id'>);
      }
    });

    await db.addBatchProducts(validProds);
    setImportSuccess(`Successfully imported ${validProds.length} SKUs into active store catalog!`);
    setCsvStep(4);
  };

  const handleResetCSV = () => {
    setCsvStep(1);
    setCsvFile(null);
    setCsvText('');
    setParsedData(null);
  };

  const handleTriggerSync = (integId: string) => {
    setIntegrationsList(prev =>
      prev.map(item =>
        item.id === integId ? { ...item, lastSynced: 'Just now' } : item
      )
    );
    setSyncToast(`Sync completed for ${integId.toUpperCase()}! Catalog is fresh.`);
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleToggleConnection = (integId: string) => {
    setIntegrationsList(prev =>
      prev.map(item => {
        if (item.id === integId) {
          const newStatus = item.status === 'connected' ? 'not_connected' : 'connected';
          return {
            ...item,
            status: newStatus,
            lastSynced: newStatus === 'connected' ? 'Just now' : 'Never',
            connectedAccount: newStatus === 'connected' ? 'Connected Sandbox' : 'Not configured'
          };
        }
        return item;
      })
    );
    setSelectedIntegration(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notice */}
      {syncToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Store Integrations & CSV Importer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect external sales channels, ad networks, payment processors, or ingest custom spreadsheets
          </p>
        </div>
      </div>

      {/* Grid of 6 Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrationsList.map((integ) => {
          const isConn = integ.status === 'connected';

          return (
            <div
              key={integ.id}
              className="p-5 rounded-2xl bg-[#0c101d] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {integ.icon}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      isConn
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isConn ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                    {isConn ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">{integ.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[48px]">
                  {integ.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-[11px] space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account:</span>
                    <span className="font-semibold text-slate-300 truncate max-w-[170px]">
                      {integ.connectedAccount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Synced:</span>
                    <span className="text-slate-400">{integ.lastSynced}</span>
                  </div>
                  {integ.metricsLabel && (
                    <div className="flex justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-indigo-400">{integ.metricsLabel}:</span>
                      <span className="font-bold text-white">{integ.metricsValue}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                {isConn ? (
                  <>
                    <button
                      onClick={() => handleTriggerSync(integ.id)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-slate-400" /> Sync Now
                    </button>
                    <button
                      onClick={() => setSelectedIntegration(integ)}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedIntegration(integ)}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plug className="w-3.5 h-3.5" /> Connect Integration
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CSV File Upload Flow (Multi-Step: 1. Upload -> 2. Map Columns -> 3. Preview -> 4. Complete) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0c101d] border border-slate-800 shadow-xl">
        {/* Step Indicator Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              Custom CSV Ingestion Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Directly upload custom product spreadsheets or batch order financial records
            </p>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <span className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
              csvStep === 1 ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}>
              1. Upload
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
              csvStep === 2 ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}>
              2. Map
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
              csvStep === 3 ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}>
              3. Preview
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
              csvStep === 4 ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}>
              4. Ingested
            </span>
          </div>
        </div>

        {/* STEP 1: Upload File */}
        {csvStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-end gap-2">
              <button
                onClick={handleApplySample}
                className="px-3 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Load Demo Catalog CSV
              </button>
              <button
                onClick={handleDownloadSample}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Sample Template (.csv)
              </button>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-10 text-center transition-all bg-slate-900/30"
            >
              <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">
                Drag & Drop CSV Spreadsheet Here
              </h4>
              <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
                Supports UTF-8 CSVs containing product titles, unit costs (COGS), selling prices, and category identifiers
              </p>
              <label className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-indigo-600/30 inline-block transition-all">
                Browse Files
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: Map Columns */}
        {csvStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200">
              Confirm how your CSV columns map to AI Business Copilot financial attributes:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="block text-slate-400 font-semibold mb-1">Product Title</label>
                <select
                  value={columnMappings.name}
                  onChange={e => setColumnMappings({ ...columnMappings, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="Product Name">Product Name (Matched)</option>
                  <option value="Title">Title</option>
                  <option value="Item">Item</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="block text-slate-400 font-semibold mb-1">SKU Identifier</label>
                <select
                  value={columnMappings.sku}
                  onChange={e => setColumnMappings({ ...columnMappings, sku: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="SKU">SKU (Matched)</option>
                  <option value="Barcode">Barcode</option>
                  <option value="Item Number">Item Number</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="block text-slate-400 font-semibold mb-1">Category</label>
                <select
                  value={columnMappings.category}
                  onChange={e => setColumnMappings({ ...columnMappings, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="Category">Category (Matched)</option>
                  <option value="Collection">Collection</option>
                  <option value="Type">Type</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="block text-slate-400 font-semibold mb-1">Retail Price ($)</label>
                <select
                  value={columnMappings.price}
                  onChange={e => setColumnMappings({ ...columnMappings, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="Price">Price (Matched)</option>
                  <option value="MSRP">MSRP</option>
                  <option value="Selling Price">Selling Price</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="block text-slate-400 font-semibold mb-1">Unit Cost / COGS ($)</label>
                <select
                  value={columnMappings.cost}
                  onChange={e => setColumnMappings({ ...columnMappings, cost: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="Cost">Cost (Matched)</option>
                  <option value="COGS">COGS</option>
                  <option value="Unit Cost">Unit Cost</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="block text-slate-400 font-semibold mb-1">Units In Stock</label>
                <select
                  value={columnMappings.stock}
                  onChange={e => setColumnMappings({ ...columnMappings, stock: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="Stock">Stock (Matched)</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Quantity">Quantity</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                onClick={() => setCsvStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back to Upload
              </button>
              <button
                onClick={() => setCsvStep(3)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Data Preview</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Preview Data */}
        {csvStep === 3 && parsedData && (
          <div className="space-y-6 animate-in fade-in">
            {/* Validation Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{parsedData.validRows} Valid Rows Ready for Ingestion</span>
              </div>
              {parsedData.invalidRows > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>{parsedData.invalidRows} Rows Need Correction</span>
                </div>
              )}
            </div>

            {/* Preview Table */}
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs font-bold text-white flex items-center justify-between">
                <span>Data Ingestion Preview ({parsedData.previewRows.length} sample items)</span>
                <span className="text-[10px] text-slate-400 font-normal">{parsedData.fileName}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-4">Row</th>
                      <th className="py-2.5 px-4">Product Name</th>
                      <th className="py-2.5 px-4">SKU</th>
                      <th className="py-2.5 px-4">Price</th>
                      <th className="py-2.5 px-4">Cost</th>
                      <th className="py-2.5 px-4">Margin %</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedData.previewRows.map(row => (
                      <tr key={row.rowNumber} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 text-slate-500 font-mono text-[10px]">#{row.rowNumber}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-200">
                          {row.parsed?.name || row.raw['Product Name'] || 'Unknown'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                          {row.parsed?.sku || row.raw['SKU']}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-white font-mono">
                          ${row.parsed?.price?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-400 font-mono">
                          ${row.parsed?.cost?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-2.5 px-4 text-emerald-400 font-bold font-mono">
                          {row.parsed?.margin}%
                        </td>
                        <td className="py-2.5 px-4">
                          {row.isValid ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                              Ready
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                              {row.errors[0]}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Confirm Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                onClick={() => setCsvStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back to Column Mapping
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={parsedData.validRows === 0}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Import {parsedData.validRows} SKUs to Database</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success / Ingested */}
        {csvStep === 4 && (
          <div className="p-8 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Catalog Ingestion Completed</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {importSuccess || 'All valid records have been normalized and saved to your active store intelligence database.'}
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetCSV}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Upload Another File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Integration Settings / Options Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1424] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 relative">
            <button
              onClick={() => setSelectedIntegration(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                {selectedIntegration.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">{selectedIntegration.name}</h3>
                <span className="text-xs text-slate-400">Connection Options & Webhooks</span>
              </div>
            </div>

            <div className="space-y-3.5 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Status</span>
                <span className="font-semibold text-white capitalize">{selectedIntegration.status.replace('_', ' ')}</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">API Key / Endpoint URL</label>
                <input
                  type="password"
                  defaultValue="sk_live_demo_982938472910394"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sync Frequency</label>
                <select className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500">
                  <option value="realtime">Real-time Webhook (Instant)</option>
                  <option value="15m">Every 15 minutes</option>
                  <option value="1h">Hourly batch</option>
                  <option value="daily">Daily close of business</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                onClick={() => handleToggleConnection(selectedIntegration.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedIntegration.status === 'connected'
                    ? 'bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                }`}
              >
                {selectedIntegration.status === 'connected' ? 'Disconnect Channel' : 'Enable Connection'}
              </button>

              <button
                onClick={() => setSelectedIntegration(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
