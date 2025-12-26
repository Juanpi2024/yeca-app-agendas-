
import React, { useState, useEffect } from 'react';
import { Transaction, Order, BusinessState } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import Insights from './components/Insights';
import OrderForm from './components/OrderForm';
import OrderTable from './components/OrderTable';
import { sheetService } from './services/sheetService';

const App: React.FC = () => {
  const [state, setState] = useState<BusinessState>({ transactions: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'transactions' | 'orders'>('dashboard');
  const [modalType, setModalType] = useState<'transaction' | 'order' | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [transactions, orders] = await Promise.all([
          sheetService.getTransactions(),
          sheetService.getOrders()
        ]);

        setState({
          transactions: transactions || [],
          orders: orders || []
        });
      } catch (error) {
        console.error("Error loading data:", error);
        const saved = localStorage.getItem('agenda_pro_data_v2');
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
      localStorage.setItem('agenda_pro_data_v2', JSON.stringify(state));
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

    setModalType(null);
  };

  const addOrder = async (o: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const newOrder: Order = {
      ...o,
      id: crypto.randomUUID(),
      status: 'PENDIENTE',
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders]
    }));

    setModalType(null);
    await sheetService.addOrder(newOrder);
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
              Caja
            </button>
            <button
              onClick={() => setView('orders')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${view === 'orders' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Pedidos
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-rose-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="font-medium text-slate-600 animate-pulse">Sincronizando con Agendes Yeca...</p>
            <p className="text-xs mt-2 text-slate-400">Esto suele tardar unos segundos</p>
          </div>
        ) : state.transactions.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-rose-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Bienvenida, Yessica!</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">
              Aún no tienes movimientos registrados. Comienza agregando tu primera venta o gasto con el botón de abajo.
            </p>
            <button
              onClick={() => setModalType('order')}
              className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-rose-200 active:scale-95"
            >
              Registrar Primer Pedido
            </button>
          </div>
        ) : (
          view === 'dashboard' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Dashboard transactions={state.transactions} />
              <Insights transactions={state.transactions} />
            </div>
          ) : view === 'transactions' ? (
            <div className="animate-in fade-in duration-500">
              <TransactionTable
                transactions={state.transactions}
                onDelete={deleteTransaction}
              />
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <OrderTable orders={state.orders} />
            </div>
          )
        )}
      </main>

      {/* Footer / Firma */}
      <footer className="max-w-5xl mx-auto px-4 mt-12 mb-8 text-center text-slate-400 text-xs">
        <p>App creada por Juan P. Ramirez . Product Manager</p>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-20">
        <button
          onClick={() => setModalType('order')}
          aria-label="Nuevo Pedido"
          className="w-14 h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
          title="Nuevo Pedido"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span className="absolute right-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Nuevo Pedido</span>
        </button>

        <button
          onClick={() => setModalType('transaction')}
          aria-label="Nueva Venta o Gasto"
          className="w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-xl shadow-rose-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
          title="Nueva Venta/Gasto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="absolute right-16 bg-rose-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Venta / Gasto</span>
        </button>
      </div>

      {/* Modal Form */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {modalType === 'transaction' ? 'Nueva Transacción' : 'Nuevo Pedido Personalizado'}
              </h2>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {modalType === 'transaction' ? (
                <TransactionForm onSubmit={addTransaction} onCancel={() => setModalType(null)} />
              ) : (
                <OrderForm onSubmit={addOrder} onCancel={() => setModalType(null)} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
