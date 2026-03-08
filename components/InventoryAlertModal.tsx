import React from 'react';
import { Material, ProductConfig } from '../types';
import { AlertTriangle, X, Package } from 'lucide-react';

interface InventoryAlertModalProps {
    materials: Material[];
    products: ProductConfig[];
    onClose: () => void;
}

const InventoryAlertModal: React.FC<InventoryAlertModalProps> = ({ materials, products, onClose }) => {
    // Calculate build capacity for each product
    const productAlerts = products.map(product => {
        let maxBuildable = Infinity;
        const missingMaterials: { materialName: string; needed: number; current: number; unit: string; deficitFor10: number }[] = [];

        // Si el producto no tiene materiales configurados, no podemos calcular
        if (product.materials.length === 0) {
            maxBuildable = 0;
        }

        product.materials.forEach(pm => {
            const mat = materials.find(m => m.id === pm.materialId);
            if (mat) {
                const buildableWithThisMat = Math.floor(mat.quantity / pm.quantity);
                if (buildableWithThisMat < maxBuildable) {
                    maxBuildable = buildableWithThisMat;
                }

                // We want to guarantee at least 10 units of the product
                const amountNeededFor10 = pm.quantity * 10;
                if (mat.quantity < amountNeededFor10) {
                    missingMaterials.push({
                        materialName: mat.name,
                        needed: amountNeededFor10,
                        current: mat.quantity,
                        unit: mat.unit,
                        deficitFor10: amountNeededFor10 - mat.quantity
                    });
                }
            } else {
                maxBuildable = 0;
            }
        });

        return {
            product,
            maxBuildable: maxBuildable === Infinity ? 0 : maxBuildable,
            missingMaterials,
            hasAlert: maxBuildable < 10
        };
    });

    const alerts = productAlerts.filter(p => p.hasAlert);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 mt-10 max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="bg-rose-600 p-6 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Alertas de Producción</h2>
                            <p className="text-rose-100 text-sm">Productos con insumos insuficientes (Meta: 10 unidades)</p>
                        </div>
                    </div>
                    <button title="Cerrar modal" onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {alerts.length === 0 ? (
                        <div className="text-center py-12 px-6">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">¡Todo en Orden!</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">
                                Tienes insumos suficientes para ensamblar al menos 10 unidades de cada uno de tus productos.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Productos afectados ({alerts.length}):
                            </p>

                            {alerts.map(({ product, maxBuildable, missingMaterials }) => (
                                <div key={product.id} className="bg-white border-2 border-rose-100 rounded-2xl p-5 shadow-sm">
                                    <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                                {product.name}
                                            </h4>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Stock actual permite armar: <span className={`font-black ${maxBuildable === 0 ? 'text-rose-600' : 'text-amber-500'}`}>{maxBuildable} {(maxBuildable === 1 ? 'unidad' : 'unidades')}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {missingMaterials.length > 0 ? (
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-3">Materiales que necesitas comprar para llegar a 10:</p>
                                            <div className="space-y-2">
                                                {missingMaterials.map((mat, i) => (
                                                    <div key={i} className="flex justify-between items-center bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                                                        <span className="text-sm font-semibold text-slate-700">{mat.materialName}</span>
                                                        <div className="text-right">
                                                            <p className="text-xs text-rose-600 font-bold uppercase">Te Faltan {mat.deficitFor10} {mat.unit}</p>
                                                            <p className="text-[10px] text-slate-500">Tienes {mat.current} / Necesitas {mat.needed}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-rose-500 italic">No hay receta definida para este producto.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0 text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryAlertModal;
