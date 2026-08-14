import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';
import { BusinessReport } from '../../types';
import { api } from '../../lib/api/client';

export const ReportsView: React.FC = () => {
  const [reports, setReports] = useState<BusinessReport[]>([]);
  const [activeReport, setActiveReport] = useState<BusinessReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const list = await api.getReports();
        setReports(list);
        if (list.length > 0) {
          setActiveReport(list[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleGenerateNewReport = async (title?: string) => {
    setIsGenerating(true);
    try {
      const generated = await api.generateReport(title);
      setReports([generated, ...reports]);
      setActiveReport(generated);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!activeReport) return;
    const blob = new Blob([JSON.stringify(activeReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-report-${activeReport.period.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setExportNotice('✓ Executive report exported as JSON');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleExportCSV = () => {
    if (!activeReport) return;
    const rows = [
      ['Metric', 'Value'],
      ['Report Title', activeReport.title],
      ['Period', activeReport.period],
      ['Total Gross Revenue', `$${activeReport.revenueSummary.totalRevenue}`],
      ['Gross Profit', `$${activeReport.profitSummary.grossProfit}`],
      ['Blended Margin', `${activeReport.profitSummary.blendedMargin}%`],
      ['Star SKU Driver', activeReport.productPerformance.starSku],
      ['COGS Ratio', activeReport.profitSummary.cogsRatio],
      ['Ad Efficiency', activeReport.profitSummary.adEfficiency],
      ['Executive Summary', `"${activeReport.executiveSummary.replace(/"/g, '""')}"`]
    ];
    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-summary-${activeReport.period.toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setExportNotice('✓ Financial metrics exported as CSV');
    setTimeout(() => setExportNotice(null), 3500);
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
      {/* Export Toast */}
      {exportNotice && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Executive Margin & Financial Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-generated executive briefs for store founders, CMOs, and financial controllers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGenerateNewReport('Real-Time Flash Margin Audit')}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Synthesizing...' : 'Generate New Audit'}
          </button>
        </div>
      </div>

      {/* Two Column Layout: Report selector on left, Full Report Canvas on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reports List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Available Executive Audits ({reports.length})
          </div>

          <div className="space-y-2.5">
            {reports.map(report => {
              const isCurrent = activeReport?.id === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => setActiveReport(report)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0e1424] border-indigo-500/80 shadow-md shadow-indigo-600/10'
                      : 'bg-[#0c101d] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      {report.period}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1.5 leading-snug">
                    {report.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-emerald-400">
                      Margin: {report.profitSummary?.blendedMargin}%
                    </span>
                    <span>•</span>
                    <span>Rev: ${report.revenueSummary?.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Printable Report Canvas */}
        <div className="lg:col-span-2">
          {activeReport ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c101d] border border-slate-800 shadow-2xl space-y-6 print:bg-white print:text-black">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                    Executive Brief • {activeReport.period}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                    {activeReport.title}
                  </h2>
                  <span className="text-[11px] text-slate-400">
                    Generated on {new Date(activeReport.createdAt).toLocaleString()} by AI Business Copilot
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> JSON
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Download PDF / Print
                  </button>
                </div>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gross Revenue</span>
                  <span className="text-base font-bold text-white">
                    ${activeReport.revenueSummary.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gross Profit</span>
                  <span className="text-base font-bold text-emerald-400">
                    ${activeReport.profitSummary.grossProfit.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Blended Margin</span>
                  <span className="text-base font-bold text-indigo-300">
                    {activeReport.profitSummary.blendedMargin}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Star SKU Driver</span>
                  <span className="text-xs font-bold text-white truncate block">
                    {activeReport.productPerformance.starSku}
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Executive Narrative
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                  {activeReport.executiveSummary}
                </p>
              </div>

              {/* Risks & Bottlenecks */}
              {activeReport.businessRisks && activeReport.businessRisks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Operational Risks & Inventory Constraints
                  </h4>
                  <div className="space-y-2 text-xs">
                    {activeReport.businessRisks.map((risk, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                        <div className="font-bold text-white flex items-center justify-between mb-1">
                          <span>{risk.title}</span>
                          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            {risk.severity} severity
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mb-2">{risk.description}</p>
                        <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <span>Mitigation:</span> {risk.mitigation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Recommendations */}
              {activeReport.aiRecommendations && activeReport.aiRecommendations.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Strategic Copilot Action Items
                  </h4>
                  <div className="space-y-2 text-xs">
                    {activeReport.aiRecommendations.map((rec, i) => (
                      <div key={i} className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20">
                        <div className="font-bold text-white flex items-center justify-between mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded bg-indigo-600/50 text-white text-[10px] flex items-center justify-center font-bold">
                              {i + 1}
                            </span>
                            {rec.title}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {rec.impact}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-1">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No report selected. Generate a new report above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
