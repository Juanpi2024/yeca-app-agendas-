import React from 'react';
import { BookOpen, X, Calculator, Package, CheckSquare, DollarSign } from 'lucide-react';

interface HelpModalProps {
    onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-rose-500 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BookOpen size={24} />
                        <h2 className="text-xl font-bold">Manual de Usuario</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Cerrar Manual"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto space-y-8">

                    {/* Sección 1: Insumos y Catálogo */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Calculator className="text-rose-500" size={20} />
                            1. Insumos y Catálogo (Recetas)
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Antes de vender un producto, debes configurarlo para calcular sus costos y descontarlo luego del inventario:
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-2">
                            <li><strong className="text-slate-700">Insumos:</strong> Registra los materiales que usas (Ej: Hoja, Anillo, Cartón) y su costo por unidad.</li>
                            <li><strong className="text-slate-700">Recetas (Productos):</strong> Crea los productos finales. Selecciona qué insumos lleva cada producto y en qué cantidad. El sistema sugerirá un precio de venta según la ganancia deseada (70% por defecto).</li>
                        </ul>
                    </div>

                    {/* Sección 2: Pedidos */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CheckSquare className="text-emerald-500" size={20} />
                            2. Tiempos y Pedidos
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Registra aquí todos los encargos o productos en fabricación:
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-2">
                            <li>El cuadro de mando te mostrará recordatorios según los días que faltan para la <strong>Fecha de Entrega</strong>.</li>
                            <li><strong>Entregado:</strong> Al marcar un pedido como <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Entregado</span>, se descontarán <strong>MÁGICAMENTE y de forma automática</strong> del inventario los insumos utilizados según la <em>receta</em> de ese producto.</li>
                            <li><strong>Pendiente / Pagado:</strong> Si pasas un pedido a "Pagado", entonces el dinero de esa venta ingresará como un movimiento a tu Caja general de manera automática.</li>
                        </ul>
                    </div>

                    {/* Sección 3: Inventario */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Package className="text-amber-500" size={20} />
                            3. Inventario Físico
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Revisa el stock en tiempo real de tus materiales. Puedes ajustarlo mediante adiciones (reabastecimiento) o restas manuales (merma o daño). Recuerda que la resta por ventas lo hará el pedido por ti si completas la receta.
                        </p>
                    </div>

                    {/* Sección 4: Caja / Transacciones */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <DollarSign className="text-blue-500" size={20} />
                            4. Caja y Resumen Ejecutivo
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Cualquier movimiento manual de Plata (Venta rápida, Gastos de Publicidad) debe ir en "Caja". Los pedidos que declares como <strong>Pagados</strong> y las Inversiones de Stock (si marcas "registrar gasto") aparecerán allí automáticamente.
                            El Dashboard inicial o Resumen te dará la salud de tu negocio a simple vista con esta información.
                        </p>
                    </div>
                </div>

                {/* Footer del Modal */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-md active:scale-95"
                    >
                        ¡Entendido!
                    </button>
                </div>
            </div>
        </div>
    );
}
