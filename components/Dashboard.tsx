
import React, { useState } from 'react';
import { Transaction, Order } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, LineChart, Line } from 'recharts';
import { generateEmailReport } from '../services/geminiService';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Package, FileText, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, orders }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = React.useMemo(() => {
    const sales = transactions.filter(t => t.type === 'VENTA').reduce((acc, curr) => acc + curr.amount, 0);
    const expenses = transactions.filter(t => t.type === 'GASTO').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingOrders = orders.filter(o => o.status === 'PENDIENTE').length;
    const deliveredOrders = orders.filter(o => o.status === 'ENTREGADO').length;

    return {
      sales,
      expenses,
      profit: sales - expenses,
      pendingOrders,
      deliveredOrders
    };
  }, [transactions, orders]);

  const monthlyData = React.useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();

    const data = months.map((month, idx) => ({
      name: month,
      ventas: 0,
      gastos: 0,
      balance: 0
    }));

    transactions.forEach(t => {
      const date = new Date(t.date);
      if (date.getFullYear() === currentYear) {
        const mIdx = date.getMonth();
        if (t.type === 'VENTA') data[mIdx].ventas += t.amount;
        else data[mIdx].gastos += t.amount;
        data[mIdx].balance = data[mIdx].ventas - data[mIdx].gastos;
      }
    });

    return data;
  }, [transactions]);

  const topProducts = React.useMemo(() => {
    const counts: Record<string, { count: number, revenue: number }> = {};
    orders.forEach(o => {
      if (!counts[o.productType]) counts[o.productType] = { count: 0, revenue: 0 };
      counts[o.productType].count++;
      counts[o.productType].revenue += o.value;
    });
    return Object.entries(counts)
      .map(([name, data]) => ({ name, count: data.count, revenue: data.revenue }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  const COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

  const handleSendReport = async () => {
    if (transactions.length === 0) return;

    setIsGenerating(true);
    try {
      const reportContent = await generateEmailReport(transactions);
      const email = 'profeyeca2021@gmail.com';
      const subject = encodeURIComponent('Reporte Contable - Agendes Yeca 2025');
      const body = encodeURIComponent(reportContent);

      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    } catch (error) {
      alert("Hubo un error al preparar el reporte.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-1">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Dashboard Ejecutivo
            <span className="bg-rose-100 text-rose-600 text-xs px-2 py-1 rounded-full uppercase tracking-widest font-bold">2025</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Análisis profundo y estado financiero del negocio.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSendReport}
            disabled={isGenerating || transactions.length === 0}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <FileText size={20} />}
            {isGenerating ? 'Generando...' : 'Reporte Contable'}
          </button>
        </div>
      </div>

      {/* KPI Overlays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card - Premium */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Balance General</p>
          <h3 className="text-3xl font-black mb-4">${stats.profit.toLocaleString()}</h3>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-white/5 w-fit px-2 py-1 rounded-lg">
            <TrendingUp size={14} />
            Negocio Saludable
          </div>
        </div>

        {/* Sales Card */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
              <ShoppingBag size={24} />
            </div>
            <span className="text-emerald-500 font-bold text-xs flex items-center">+ Ingresos</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Ventas Totales</p>
            <h3 className="text-2xl font-black text-slate-800">${stats.sales.toLocaleString()}</h3>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl">
              <TrendingDown size={24} />
            </div>
            <span className="text-rose-400 font-bold text-xs flex items-center">- Gastos</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Egresos Totales</p>
            <h3 className="text-2xl font-black text-slate-800">${stats.expenses.toLocaleString()}</h3>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
              <Package size={24} />
            </div>
            <span className="text-slate-400 font-bold text-xs">{stats.deliveredOrders} Listos</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Entregados</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.deliveredOrders} <span className="text-xs font-medium text-slate-400">pedidos</span></h3>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">Evolución Anual</h4>
            <div className="flex gap-4 text-[10px] font-bold uppercase">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ventas</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Gastos</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="ventas" stroke="#10b981" fillOpacity={1} fill="url(#colorVentas)" strokeWidth={3} />
                <Area type="monotone" dataKey="gastos" stroke="#f43f5e" fillOpacity={1} fill="url(#colorGastos)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking List */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight mb-6">Top Productos</h4>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between group hover:bg-slate-50 p-2 rounded-2xl transition-all cursor-default">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm leading-tight">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{p.count} vendidos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-800 text-sm">${p.revenue.toLocaleString()}</p>
                  <ArrowUpRight className="inline-block text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-400 italic text-sm py-10">Sin pedidos suficientes...</p>
            )}
          </div>

          {topProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="bg-rose-50 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl text-rose-500 shadow-sm">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-rose-500 font-black uppercase">Mejor Producto</p>
                  <p className="text-sm font-bold text-slate-800">{topProducts[0].name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cash Flow Evolution */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight mb-8">Flujo de Caja Mensual (Balance)</h4>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
              <Bar dataKey="balance" radius={[6, 6, 6, 6]}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? '#10b981' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
