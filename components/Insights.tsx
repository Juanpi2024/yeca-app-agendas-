
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { getBusinessInsights } from '../services/geminiService';

interface InsightsProps {
  transactions: Transaction[];
}

const Insights: React.FC<InsightsProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getBusinessInsights(transactions);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      fetchInsights();
    }
  }, [transactions.length]);

  return (
    <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl shadow-rose-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-lg leading-tight">Consejos de IA</h4>
          <p className="text-white/70 text-xs">Análisis inteligente de tu negocio</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="ml-auto p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-h-[80px]">
        {loading ? (
          <div className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
            <div className="h-4 bg-white/20 rounded w-5/6"></div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-white/90 italic">
            {insight || "Analizando tus datos para darte los mejores consejos..."}
          </p>
        )}
      </div>
      
      {!loading && transactions.length === 0 && (
        <p className="text-[10px] text-white/60 mt-2 text-center">Registra ventas para activar el análisis.</p>
      )}
    </div>
  );
};

export default Insights;
