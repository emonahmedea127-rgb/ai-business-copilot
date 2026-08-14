import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  X,
  ArrowUpDown,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { api } from '../../lib/api/client';

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const list = await api.getOrders();
        setOrders(list);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = selectedStatus === 'all' || o.status === selectedStatus;
      const matchChannel = selectedChannel === 'all' || o.channel === selectedChannel;
      return matchSearch && matchStatus && matchChannel;
    });
  }, [orders, searchQuery, selectedStatus, selectedChannel]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/25">
            <RotateCcw className="w-3 h-3" /> Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
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
            Orders & Transaction Profitability
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full audit of real revenue, product COGS deductions, and net margins per customer order
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search order number or customer..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Order Statuses</option>
            <option value="completed">Completed</option>
            <option value="shipped">Shipped</option>
            <option value="processing">Processing</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div>
          <select
            value={selectedChannel}
            onChange={e => setSelectedChannel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Channels (Shopify, Woo, Direct)</option>
            <option value="Shopify">Shopify Storefront</option>
            <option value="WooCommerce">WooCommerce</option>
            <option value="Direct">Direct / Offline</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#0c101d] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Order Number</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date / Channel</th>
                <th className="py-3.5 px-4">Gross Revenue</th>
                <th className="py-3.5 px-4">Est. Cost</th>
                <th className="py-3.5 px-4">Net Profit</th>
                <th className="py-3.5 px-4">Margin %</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.map(order => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-slate-900/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold text-white group-hover:text-indigo-400">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{order.customerName}</div>
                    <div className="text-[10px] text-slate-400">{order.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300 font-medium">
                      {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-[10px] text-slate-400">{order.channel} • {order.itemsCount} items</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    ${order.revenue.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    ${order.cost.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">
                    +${order.profit.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-indigo-300">
                      {order.margin}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-[11px] font-semibold transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1424] border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{selectedOrder.orderNumber}</h3>
                <span className="text-xs text-slate-400">
                  {new Date(selectedOrder.date).toLocaleString()} • {selectedOrder.channel}
                </span>
              </div>
              <div>{getStatusBadge(selectedOrder.status)}</div>
            </div>

            {/* Customer Info */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 mb-4 text-xs">
              <span className="text-slate-400 block font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Customer Profile
              </span>
              <div className="font-bold text-white">{selectedOrder.customerName}</div>
              <div className="text-slate-400">{selectedOrder.customerEmail}</div>
            </div>

            {/* Financial Breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Order Revenue</span>
                <span className="text-base font-bold text-white">${selectedOrder.revenue.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Product Cost</span>
                <span className="text-base font-bold text-rose-300">${selectedOrder.cost.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Net Profit ({selectedOrder.margin}%)</span>
                <span className="text-base font-bold text-emerald-400">+${selectedOrder.profit.toFixed(2)}</span>
              </div>
            </div>

            {/* Items List */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-300 mb-2">Order Line Items</div>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{item.productName}</div>
                        <div className="text-[10px] text-slate-400">Qty: {item.quantity} • Cost: ${item.cost} / unit</div>
                      </div>
                      <div className="text-right font-bold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
