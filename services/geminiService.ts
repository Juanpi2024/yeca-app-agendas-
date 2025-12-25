
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (aiInstance) return aiInstance;
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === '') {
    console.warn("Gemini API Key no configurada.");
    return null;
  }
  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
};

export const getBusinessInsights = async (transactions: Transaction[], agendasInProgress?: number): Promise<string> => {
  if (transactions.length === 0) return "Registra algunas transacciones para obtener consejos personalizados.";

  const summary = transactions.map(t => `${t.date}: ${t.type} - ${t.amount} (${t.description})`).join('\n');
  const agendasContext = agendasInProgress ? `Actualmente Yessica está confeccionando ${agendasInProgress} agendas con los materiales comprados.` : "";

  const ai = getAI();
  if (!ai) return "Análisis no disponible (API Key faltante).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Eres un experto consultor de negocios especializado en productos hechos a mano de ALTO VALOR para "Agendes Yeca 2025".
      
      CONTEXTO DEL MERCADO:
      - Las agendas de Yessica son productos premium.
      - El precio de mercado para estas agendas artesanales es de entre $13.000 y $18.000 CLP.
      - Yessica NO compite por precio bajo, sino por calidad, diseño y exclusividad.
      
      SITUACIÓN ACTUAL:
      ${agendasContext}
      
      DATOS DE TRANSACCIONES (COSTOS Y VENTAS):
      ${summary}
      
      TU TAREA:
      Proporciona 3 consejos estratégicos de negocio.
      1. Si hay agendas en confección, calcula la UTILIDAD REAL esperada vendiéndolas a precios de mercado ($13k-$18k) comparado con los costos de materiales registrados.
      2. Da consejos sobre cómo justificar un precio de $18.000 (ej. personalización, empaque premium).
      3. Sé motivador, directo y profesional. Máximo 150 palabras.
      
      IMPORTANTE: No sugieras precios bajos. Enfócate en maximizar la rentabilidad basada en el valor artesanal.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "No se pudo generar el análisis en este momento.";
  } catch (error) {
    console.error("Error fetching insights:", error);
    return "Error al conectar con la inteligencia financiera.";
  }
};

export const generateEmailReport = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) return "No hay datos para reportar.";

  const summary = transactions.map(t => `${t.date} | ${t.type} | $${t.amount} | ${t.description} (${t.category})`).join('\n');
  const totalSales = transactions.filter(t => t.type === 'VENTA').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'GASTO').reduce((sum, t) => sum + t.amount, 0);

  const ai = getAI();
  if (!ai) return "Reporte no disponible (API Key faltante).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Actúa como un asistente contable profesional. Genera un REPORTE DE NEGOCIO detallado y elegante para el emprendimiento "Agendes Yeca 2025".
      
      DATOS ACTUALES:
      Ventas Totales: $${totalSales}
      Gastos Totales: $${totalExpenses}
      Utilidad: $${totalSales - totalExpenses}
      
      DETALLE DE MOVIMIENTOS:
      ${summary}
      
      El reporte debe incluir:
      1. Un saludo formal indicando que es el reporte de Agendes Yeca 2025.
      2. Resumen ejecutivo de la salud financiera.
      3. Análisis por categorías de gasto e ingreso.
      4. Conclusión motivadora.
      
      IMPORTANTE: Usa un tono profesional pero amable. El formato debe ser texto plano optimizado para el cuerpo de un correo electrónico.`,
      config: {
        temperature: 0.5,
      }
    });

    return response.text || "Reporte generado automáticamente para Agendes Yeca 2025.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error al generar el reporte detallado.";
  }
};
