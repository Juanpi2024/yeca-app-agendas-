
import React, { useState } from 'react';
import { TransactionType, CATEGORIES } from '../types';

interface TransactionFormProps {
  onSubmit: (data: {
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string;
  }) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel }) => {
  const [type, setType] = useState<TransactionType>('VENTA');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES['VENTA'][0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onSubmit({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date
    });
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-4">
        <button
          type="button"
          onClick={() => handleTypeChange('VENTA')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${type === 'VENTA' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
        >
          Ingreso (Venta)
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('GASTO')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${type === 'GASTO' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
        >
          Egreso (Gasto)
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Monto ($)</label>
        <input
          type="number"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción</label>
        <input
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Agenda para María"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          >
            {CATEGORIES[type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
