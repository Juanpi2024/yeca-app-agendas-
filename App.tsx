
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, BusinessState } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import Insights from './components/Insights';
import { sheetService } from './services/sheetService';

const App: React.FC = () => {
  const [state, setState] = useState<BusinessState>({ transactions: [] });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'transactions'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await sheetService.getTransactions();
        if (data && data.length > 0) {
          setState({ transactions: data });
        } else {
          const saved = localStorage.getItem('agenda_pro_data');
          if (saved) setState(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        const saved = localStorage.getItem('agenda_pro_data');
        if (saved) setState(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Safety timeout: if after 10s it's still loading, force stop
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('agenda_pro_data', JSON.stringify(state));
    }
  }, [state, loading]);

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID()
    };

    // Optimistic update
    setState(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));

    setIsFormOpen(false);

    // Sync with Sheets
    const success = await sheetService.addTransaction(newTransaction);
    if (!success) {
      console.error('Error sincronizando con Google Sheets');
      // Podríamos revertir el cambio local si fuera crítico
    }
  };

  const deleteTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Agendes Yeca <span className="text-rose-500">2025</span></h1>
          </div>
          <nav className="flex gap-1 bg-slate-100 p-1 rounded-full">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Resumen
            </button>
            <button
              onClick={() => setView('transactions')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${view === 'transactions' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Movimientos
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="animate-pulse">Cargando datos desde Google Sheets...</p>
          </div>
        ) : (
          view === 'dashboard' ? (
            <div className="space-y-8">
              <Dashboard transactions={state.transactions} />
              <Insights transactions={state.transactions} />
            </div>
          ) : (
            <TransactionTable
              transactions={state.transactions}
              onDelete={deleteTransaction}
            />
          )
        )}
      </main>

      {/* Footer / Firma */}
      <footer className="max-w-5xl mx-auto px-4 mt-12 mb-8 text-center text-slate-400 text-xs">
        <p>App creada por Juan P. Ramirez . Product Manager</p>
      </footer>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        aria-label="Agregar nueva transacción"
        className="fixed bottom-6 right-6 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-xl shadow-rose-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Nueva Transacción</h2>
              <button onClick={() => setIsFormOpen(false)} aria-label="Cerrar" className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <TransactionForm onSubmit={addTransaction} onCancel={() => setIsFormOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
