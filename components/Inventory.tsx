import React, { useState } from 'react';
import { Material, InventoryLog, Transaction } from '../types';
import { Package, Plus, Minus, AlertTriangle, History, ArrowRightLeft } from 'lucide-react';

interface InventoryProps {
    materials: Material[];
    logs: InventoryLog[];
    onAddStock: (materialId: string, quantity: number, cost: number, registerExpense: boolean) => Promise<void>;
    onRemoveStock: (materialId: string, quantity: number, reason: string) => Promise<void>;
}

export default function Inventory({ materials, logs, onAddStock, onRemoveStock }: InventoryProps) {
    const [activeTab, setActiveTab] = useState<'control' | 'history'>('control');

    // Stock adjustment state
    const [selectedMaterial, setSelectedMaterial] = useState<string>('');
    const [adjustAmount, setAdjustAmount] = useState<string>('');
    const [adjustReason, setAdjustReason] = useState<string>('Merma / Daño');
    const [adjustCost, setAdjustCost] = useState<string>('');
    const [registerExpense, setRegisterExpense] = useState(true);
    const [showAdjustModal, setShowAdjustModal] = useState<'add' | 'remove' | null>(null);

    const handleAdjust = async () => {
        if (!selectedMaterial || !adjustAmount || Number(adjustAmount) <= 0) return;

        if (showAdjustModal === 'add') {
            await onAddStock(selectedMaterial, Number(adjustAmount), Number(adjustCost || 0), registerExpense);
        } else if (showAdjustModal === 'remove') {
            await onRemoveStock(selectedMaterial, Number(adjustAmount), adjustReason);
        }

        closeModal();
    };

    const closeModal = () => {
        setShowAdjustModal(null);
        setSelectedMaterial('');
        setAdjustAmount('');
        setAdjustCost('');
        setAdjustReason('Merma / Daño');
        setRegisterExpense(true);
    };

    const getLowStockMaterials = () => {
        // Arbitrary rule for now if they don't have minWarning set up: show warning if qty < 10
        return materials.filter(m => m.quantity <= (m.minWarning || 10));
    };

    const lowStock = getLowStockMaterials();

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Package className="text-rose-500" />
                        Control de Inventario
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Supervisa tus existencias, suma compras o registra mermas.</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-xl">
                    <button
                        onClick={() => setActiveTab('control')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'control' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Existencias
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Historial de Movimientos
                    </button>
                </div>
            </div>

            {activeTab === 'control' && (
                <div className="animate-in fade-in duration-300">

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setShowAdjustModal('add')}
                            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-100 transition-colors"
                        >
                            <Plus size={20} /> Registrar Compra (Sumar Stock)
                        </button>
                        <button
                            onClick={() => setShowAdjustModal('remove')}
                            className="flex items-center gap-2 bg-amber-50 text-amber-700 font-bold px-6 py-3 rounded-xl hover:bg-amber-100 transition-colors"
                        >
                            <Minus size={20} /> Registrar Uso/Merma (Restar Stock)
                        </button>
                    </div>

                    {/* Low Stock Alerts */}
                    {lowStock.length > 0 && (
                        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mb-8">
                            <div className="flex items-center gap-2 text-rose-800 font-bold mb-3">
                                <AlertTriangle size={20} />
                                <h3>Insumos con Poco Stock</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {lowStock.map(m => (
                                    <div key={m.id} className="bg-white px-3 py-2 rounded-lg border border-rose-100 shadow-sm">
                                        <p className="text-sm font-bold truncate text-slate-700" title={m.name}>{m.name}</p>
                                        <p className="text-rose-600 font-black text-lg">{m.quantity} <span className="text-xs font-normal text-slate-500">{m.unit}</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Materials Grid */}
                    <h3 className="font-bold text-slate-700 mb-4 text-lg">Todos tus Insumos</h3>
                    {materials.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Package className="mx-auto mb-2 opacity-50" size={32} />
                            <p>No tienes insumos en tu catálogo aún. Agrégalos en "Catálogo y Costos".</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {materials.map(m => (
                                <div key={m.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
                                    <div className={`absolute top-0 w-full h-1 ${m.quantity <= (m.minWarning || 10) ? 'bg-rose-500' : 'bg-emerald-400'}`}></div>
                                    <h4 className="text-slate-600 font-bold text-center mb-1 w-full truncate" title={m.name}>{m.name}</h4>
                                    <p className="text-3xl font-black text-slate-800">{m.quantity}</p>
                                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">{m.unit}</p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}

            {activeTab === 'history' && (
                <div className="animate-in fade-in duration-300">
                    {logs.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <History className="mx-auto mb-2 opacity-50" size={32} />
                            <p>No hay historial de movimientos de inventario todavía.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-bold">Fecha</th>
                                        <th className="px-4 py-3 font-bold">Insumo</th>
                                        <th className="px-4 py-3 font-bold text-center">Movimiento</th>
                                        <th className="px-4 py-3 font-bold">Razón</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {logs.slice().reverse().map(log => {
                                        const mat = materials.find(m => m.id === log.materialId);
                                        const isPositive = log.quantityChange > 0;
                                        return (
                                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(log.date).toLocaleString()}</td>
                                                <td className="px-4 py-3 font-bold text-slate-700">{mat?.name || 'Insumo eliminado'}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                        {isPositive ? '+' : ''}{log.quantityChange}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{log.reason}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Adjust Stock Modal */}
            {showAdjustModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6">
                        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${showAdjustModal === 'add' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {showAdjustModal === 'add' ? <Plus /> : <Minus />}
                            {showAdjustModal === 'add' ? 'Agregar Insumos' : 'Restar Insumos'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Selecciona el Imsumo</label>
                                <select
                                    title="Selecciona el insumo"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={selectedMaterial}
                                    onChange={(e) => setSelectedMaterial(e.target.value)}
                                >
                                    <option value="">-- Elige qué insumo vas a afectar --</option>
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} (Stock actual: {m.quantity} {m.unit})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Cantidad a {showAdjustModal === 'add' ? 'Sumar' : 'Restar'}</label>
                                <input
                                    type="number"
                                    min="0.1"
                                    step="any"
                                    placeholder="Ej: 50"
                                    value={adjustAmount}
                                    onChange={e => setAdjustAmount(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                />
                            </div>

                            {showAdjustModal === 'add' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Costo Total de esta Compra ($)</label>
                                        <input
                                            type="number"
                                            placeholder="Ej: 15000"
                                            value={adjustCost}
                                            onChange={e => setAdjustCost(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="checkbox"
                                            id="registerExpense"
                                            title="Registrar como egreso"
                                            checked={registerExpense}
                                            onChange={e => setRegisterExpense(e.target.checked)}
                                            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                        />
                                        <label htmlFor="registerExpense" className="text-sm font-bold text-slate-600 cursor-pointer">
                                            También registrar este monto como Gasto en la Caja
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Motivo / Razón</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Prueba fallida de impresión"
                                        value={adjustReason}
                                        onChange={e => setAdjustReason(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button onClick={closeModal} className="flex-1 py-3 text-slate-500 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
                            <button
                                onClick={handleAdjust}
                                disabled={!selectedMaterial || !adjustAmount}
                                className={`flex-1 py-3 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 ${showAdjustModal === 'add' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'}`}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
