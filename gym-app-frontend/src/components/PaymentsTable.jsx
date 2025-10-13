import React, { useState, useEffect } from "react";
import { getPaginatedPayments, searchPaymentsByUser } from "../firebasePayments";
import PaymentsExport from "./PaymentsExport";
import { useLanguage } from "../context/LanguageContext";

// Helper to check if payment is valid
function isPaymentValid(payment) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (payment.type) {
    case "per day": {
      const start = new Date(payment.date);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      return today < end;
    }
    case "per week": {
      const start = new Date(payment.date);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return today < end;
    }
    case "per month": {
      const start = new Date(payment.date);
      const end = new Date(start);
      end.setMonth(start.getMonth() + 1);
      return today < end;
    }
    case "per several": {
      if (!Array.isArray(payment.selectedDates)) return false;
      return payment.selectedDates.some(
        (d) => new Date(d).getTime() === today.getTime()
      );
    }
    default:
      return false;
  }
}

// Helper to get end date
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

export default function PaymentsTable() {
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  const itemsPerPage = 50;
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [pageCursors, setPageCursors] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchPage = async (pageNumber) => {
    try {
      const lastDoc = pageCursors[pageNumber - 1];
      const { data, lastVisible, hasMore: more } = await getPaginatedPayments({
        limitCount: itemsPerPage,
        lastDoc,
      });

      setPageCursors((prev) => {
        const updated = [...prev];
        updated[pageNumber] = lastVisible;
        return updated;
      });

      setPayments(data);
      setHasMore(more);
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error(t("Failed to fetch payments", "Error al obtener pagos"), err);
    }
  };

  const handleSearchClick = async () => {
    if (!search.trim()) {
      setIsSearching(false);
      setPageCursors([null]);
      fetchPage(1);
      return;
    }

    try {
      setIsSearching(true);
      const data = await searchPaymentsByUser(search.trim());
      setPayments(data);
      setHasMore(false);
      setCurrentPage(1);
    } catch (err) {
      console.error(t("Search failed", "Error en la búsqueda"), err);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  return (
    <div className="bg-gray-900 text-white shadow-2xl rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-extrabold mb-5 text-yellow-400 flex items-center justify-center">
        {t("All Payments", "Todos los Pagos")}
      </h2>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder={t("🔎 Search by client name or email", "🔎 Buscar por nombre o correo")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
        <button
          onClick={handleSearchClick}
          className="px-4 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
        >
          {t("Search", "Buscar")}
        </button>
      </div>

      {/* Export */}
      <PaymentsExport />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-yellow-300 uppercase text-sm tracking-wider">
              <th className="p-3 text-left">{t("Client Name", "Nombre del Cliente")}</th>
              <th className="p-3 text-left">{t("Client Email", "Correo del Cliente")}</th>
              <th className="p-3 text-left">{t("Type", "Tipo")}</th>
              <th className="p-3 text-left">{t("Amount", "Monto")}</th>
              <th className="p-3 text-left">{t("Start Date", "Fecha Inicio")}</th>
              <th className="p-3 text-left">{t("End Date", "Fecha Fin")}</th>
              <th className="p-3 text-left">{t("Selected Dates", "Fechas Seleccionadas")}</th>
              <th className="p-3 text-left">{t("Status", "Estado")}</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-800 transition-all duration-200 border-b border-gray-700"
                >
                  <td className="p-3 font-semibold">{p.client.name || "-"}</td>
                  <td className="p-3">{p.client.email || "-"}</td>
                  <td className="p-3 capitalize">{p.type}</td>
                  <td className="p-3 font-bold text-green-400">${p.amount}</td>
                  <td className="p-3">{p.date}</td>
                  <td className="p-3">{getEndDate(p).toISOString().split("T")[0]}</td>
                  <td className="p-3">
                    {p.type === "per several" ? p.selectedDates?.join(", ") : "-"}
                  </td>
                  <td className="p-3">
                    {isPaymentValid(p) ? (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ✅ {t("Valid", "Válido")}
                      </span>
                    ) : (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ❌ {t("Expired", "Expirado")}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  {t("No payments found", "No se encontraron pagos")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isSearching && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => fetchPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 transition"
          >
            ⬅ {t("Prev", "Anterior")}
          </button>
          <span className="px-3 py-1 rounded font-bold">
            {t("Page", "Página")} {currentPage}
          </span>
          <button
            onClick={() => fetchPage(currentPage + 1)}
            disabled={!hasMore}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 transition"
          >
            {t("Next", "Siguiente")} ➡
          </button>
        </div>
      )}
    </div>
  );
}
