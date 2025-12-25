
import React from 'react';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-700">Aún no hay movimientos</h3>
        <p className="text-slate-500">Usa el botón "+" para registrar tu primera venta o gasto.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Detalle</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monto</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {new Date(t.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">{t.description}</span>
                    <span className={`text-[10px] font-bold uppercase w-fit px-1.5 py-0.5 rounded ${t.type === 'VENTA' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                      {t.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {t.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-bold ${t.type === 'VENTA' ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {t.type === 'VENTA' ? '+' : '-'}${t.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 12.14m-4.78 0L9.26 9m9.96-2.14-.81 12.6a2.25 2.25 0 0 1-2.247 2.112H7.718a2.25 2.25 0 0 1-2.247-2.112L4.83 6.86m1.5-1.94h11.33a2.25 2.25 0 0 1 2.248 2.25v1.365m-14.46 0v-1.365a2.25 2.25 0 0 1 2.25-2.25h11.33a2.25 2.25 0 0 1 2.25 2.25v1.365m-14.46 0h14.46" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
