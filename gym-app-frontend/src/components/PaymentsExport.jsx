import React, { useState } from "react";
import { searchPaymentsByUser } from "../firebasePayments";
import * as XLSX from "xlsx";

export default function PaymentsExport({ onExported }) {
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
        if (!payment.selectedDates || !payment.selectedDates.length) return new Date(payment.date);
        const dates = payment.selectedDates.map(d => new Date(d));
        return new Date(Math.max(...dates.map(d => d.getTime())));
        }
        default:
        return new Date(payment.date);
    }
    }
  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch payments by year/month
      const searchTerm = ""; // For this, we're fetching all payments
      let payments = await searchPaymentsByUser(searchTerm); // get all payments

      // Filter by year/month
      if (year) {
        payments = payments.filter(p => new Date(p.date).getFullYear() === parseInt(year));
      }
      if (month) {
        payments = payments.filter(p => new Date(p.date).getMonth() + 1 === parseInt(month));
      }

      if (payments.length === 0) {
        alert("No payments found for selected period");
        setLoading(false);
        return;
      }

      // Prepare data for Excel
     
      const sheetData = payments.map(p => ({
        "Client Name": p.client?.name || "-",
        "Client Email": p.client?.email || "-",
        Type: p.type,
        Amount: p.amount,
        "Start Date": p.date,
        "End Date": getEndDate(p).toISOString().split("T")[0],
        "Selected Dates": p.selectedDates?.join(", ") || "-",
        Status: new Date(p.date) < new Date() ? "Expired" : "Valid",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, "Payments");
      XLSX.writeFile(wb, `payments_export_${year || "all"}_${month || "all"}.xlsx`);

      if (onExported) onExported();
    } catch (err) {
      console.error("Failed to export payments:", err);
      alert("Failed to export payments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="number"
        placeholder="Year (e.g., 2025)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
      />
      <input
        type="number"
        placeholder="Month (1-12)"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
      />
      <button
        onClick={handleExport}
        disabled={loading}
        className="px-4 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500"
      >
        {loading ? "Exporting..." : "Export"}
      </button>
    </div>
  );
}
