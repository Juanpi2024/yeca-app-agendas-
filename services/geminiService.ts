
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) return "Registra algunas transacciones para obtener consejos personalizados.";

  const summary = transactions.map(t => `${t.date}: ${t.type} - ${t.amount} (${t.description})`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un experto contador y consultor de negocios para el emprendimiento de papelería creativa "Agendes Yeca 2025". 
      Analiza los siguientes datos financieros y proporciona 3 consejos accionables, breves y motivadores en español:
      
      ${summary}
      
      Formato de respuesta: Texto directo, sin negritas innecesarias, máximo 150 palabras.`,
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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
