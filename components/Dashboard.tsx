
import React, { useState } from 'react';
import { Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { generateEmailReport } from '../services/geminiService';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = React.useMemo(() => {
    const sales = transactions.filter(t => t.type === 'VENTA').reduce((acc, curr) => acc + curr.amount, 0);
    const expenses = transactions.filter(t => t.type === 'GASTO').reduce((acc, curr) => acc + curr.amount, 0);
    return {
      sales,
      expenses,
      profit: sales - expenses
    };
  }, [transactions]);

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

  const chartData = React.useMemo(() => {
    return [
      { name: 'Ventas', value: stats.sales, color: '#f43f5e' },
      { name: 'Gastos', value: stats.expenses, color: '#64748b' }
    ];
  }, [stats]);

  const expenseData = React.useMemo(() => {
    const groups: Record<string, number> = {};
    transactions.filter(t => t.type === 'GASTO').forEach(t => {
      groups[t.category] = (groups[t.category] || 0) + t.amount;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6">
      {/* Header with Report Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Panel de Control</h2>
          <p className="text-slate-500 text-sm">Resumen financiero de Agendes Yeca 2025</p>
        </div>
        <button
          onClick={handleSendReport}
          disabled={isGenerating || transactions.length === 0}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          )}
          {isGenerating ? 'Generando Reporte...' : 'Enviar Reporte al Correo'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
          <p className="text-sm font-medium text-rose-500 mb-1">Total Ventas</p>
          <h3 className="text-3xl font-bold text-slate-800">${stats.sales.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Gastos</p>
          <h3 className="text-3xl font-bold text-slate-800">${stats.expenses.toLocaleString()}</h3>
        </div>
        <div className={`${stats.profit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'} p-6 rounded-2xl border shadow-sm`}>
          <p className={`text-sm font-medium ${stats.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'} mb-1`}>Utilidad Neta</p>
          <h3 className={`text-3xl font-bold ${stats.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>${stats.profit.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Comparison Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[350px]">
          <h4 className="font-bold text-slate-700 mb-6">Comparativa General</h4>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[350px]">
          <h4 className="font-bold text-slate-700 mb-6">Distribución de Gastos</h4>
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
              No hay gastos registrados para analizar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
