import React, { useState } from "react";
import { searchPaymentsByUser } from "../firebasePayments";
import * as XLSX from "xlsx";
import { useLanguage } from "../context/LanguageContext";
import { useLoader } from "../context/LoaderContext";

export default function PaymentsExport({ onExported }) {
  const { language } = useLanguage();
  const { showLoader, hideLoader } = useLoader();
  const t = (en, es) => (language === "en" ? en : es);

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  function getEndDate(payment) {
    switch (payment.type) {
      case "per day": {
        const end = new Date(payment.date);
        end.setDate(end.getDate() + 1);
        return end;
      }
      case "per week": {
        const end = new Date(payment.date);
        end.setDate(end.getDate() + 7);
        return end;
      }
      case "per month": {
        const end = new Date(payment.date);
        end.setMonth(end.getMonth() + 1);
        return end;
      }
      case "per several": {
        if (!payment.selectedDates || !payment.selectedDates.length)
          return new Date(payment.date);
        const dates = payment.selectedDates.map((d) => new Date(d));
        return new Date(Math.max(...dates.map((d) => d.getTime())));
      }
      default:
        return new Date(payment.date);
    }
  }

  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch all payments
      const searchTerm = "";
      let payments = await searchPaymentsByUser(searchTerm);

      // Filter by year/month
      if (year) {
        payments = payments.filter(
          (p) => new Date(p.date).getFullYear() === parseInt(year)
        );
      }
      if (month) {
        payments = payments.filter(
          (p) => new Date(p.date).getMonth() + 1 === parseInt(month)
        );
      }

      if (payments.length === 0) {
        alert(t("No payments found for selected period", "No se encontraron pagos para el período seleccionado"));
        setLoading(false);
        return;
      }

      // Prepare data for Excel
      const sheetData = payments.map((p) => ({
        [t("Client Name", "Nombre del Cliente")]: p.client?.name || "-",
        [t("Client Email", "Correo del Cliente")]: p.client?.email || "-",
        [t("Type", "Tipo")]: p.type,
        [t("Amount", "Monto")]: p.amount,
        [t("Start Date", "Fecha Inicio")]: p.date,
        [t("End Date", "Fecha Fin")]: getEndDate(p).toISOString().split("T")[0],
        [t("Selected Dates", "Fechas Seleccionadas")]:
          p.selectedDates?.join(", ") || "-",
        [t("Status", "Estado")]:
          new Date(p.date) < new Date()
            ? t("Expired", "Expirado")
            : t("Valid", "Válido"),
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, t("Payments", "Pagos"));
      XLSX.writeFile(
        wb,
        `payments_export_${year || "all"}_${month || "all"}.xlsx`
      );

      if (onExported) onExported();
    } catch (err) {
      console.error(t("Failed to export payments", "Error al exportar pagos"), err);
      alert(t("Failed to export payments", "Error al exportar pagos"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="number"
        placeholder={t("Year (e.g., 2025)", "Año (ej. 2025)")}
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
      />
      <input
        type="number"
        placeholder={t("Month (1-12)", "Mes (1-12)")}
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
      />
      <button
        onClick={handleExport}
        disabled={loading}
        className="px-4 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500"
      >
        {loading ? t("Exporting...", "Exportando...") : t("Export", "Exportar")}
      </button>
    </div>
  );
}
