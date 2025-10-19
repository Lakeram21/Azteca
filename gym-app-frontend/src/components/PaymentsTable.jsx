import React, { useState, useEffect } from "react";
import { 
  getPaginatedPayments,
  searchPaymentsByUser 
} from "../firebasePayments";
import PaymentsExport from "./PaymentsExport";
import PaymentActions from "./PaymentActions";
import { useLanguage } from "../context/LanguageContext";
import { useLoader } from "../context/LoaderContext";

// ✅ Helper to check if payment is valid
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
      end.setMonth(end.getMonth() + 1);
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

// ✅ Helper to get end date
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
  const { showLoader, hideLoader } = useLoader();
  const t = (en, es) => (language === "en" ? en : es);

  const itemsPerPage = 50;
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [pageCursors, setPageCursors] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // ✅ Sorting helper — valid first, then most recent
  const sortPayments = (data) => {
    return data.sort((a, b) => {
      const aValid = isPaymentValid(a);
      const bValid = isPaymentValid(b);
      if (aValid !== bValid) return aValid ? -1 : 1; // valid first
      return new Date(b.date) - new Date(a.date); // then newest first
    });
  };

  const fetchPage = async (pageNumber) => {
    try {
      showLoader();
      const lastDoc = pageCursors[pageNumber - 1];
      const { data, lastVisible, hasMore: more } = await getPaginatedPayments({
        limitCount: itemsPerPage,
        lastDoc,
      });

      const sortedData = sortPayments(data);

      setPageCursors((prev) => {
        const updated = [...prev];
        updated[pageNumber] = lastVisible;
        return updated;
      });

      setPayments(sortedData);
      setHasMore(more);
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error(t("Failed to fetch payments", "Error al obtener pagos"), err);
    } finally {
      hideLoader();
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
      const sortedData = sortPayments(data);
      setPayments(sortedData);
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

      {/* 🔍 Search */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
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

      {/* 📤 Export */}
      <PaymentsExport />

      {/* 📋 Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-gray-800 text-yellow-300 uppercase text-sm tracking-wider">
              <th className="p-3 text-left">{t("Client Name", "Nombre del Cliente")}</th>
              <th className="p-3 text-left">{t("Client Email", "Correo del Cliente")}</th>
              <th className="p-3 text-left whitespace-nowrap">{t("Type", "Tipo")}</th>
              <th className="p-3 text-left whitespace-nowrap">{t("Amount", "Monto")}</th>
              <th className="p-3 text-left hidden md:table-cell">{t("Start Date", "Fecha Inicio")}</th>
              <th className="p-3 text-left hidden md:table-cell">{t("End Date", "Fecha Fin")}</th>
              <th className="p-3 text-left hidden lg:table-cell">{t("Selected Dates", "Fechas Seleccionadas")}</th>
              <th className="p-3 text-left whitespace-nowrap">{t("Status", "Estado")}</th>
              <th className="p-3 text-left whitespace-nowrap">{t("Actions", "Acciones")}</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr
                  key={p.id}
                  className={`transition-all duration-200 border-b border-gray-700 ${
                    isPaymentValid(p)
                      ? "hover:bg-gray-800"
                      : "bg-gray-800/40 text-gray-400"
                  }`}
                >
                  <td className="p-3 font-semibold whitespace-nowrap">{p.client.name || "-"}</td>
                  <td className="p-3 whitespace-nowrap">{p.client.email || "-"}</td>
                  <td className="p-3 capitalize whitespace-nowrap">{p.type}</td>
                  <td className="p-3 font-bold text-green-400 whitespace-nowrap">${p.amount}</td>
                  <td className="p-3 hidden md:table-cell whitespace-nowrap">{p.date}</td>
                  <td className="p-3 hidden md:table-cell whitespace-nowrap">{getEndDate(p).toISOString().split("T")[0]}</td>
                  <td className="p-3 hidden lg:table-cell whitespace-nowrap">
                    {p.type === "per several" ? p.selectedDates?.join(", ") : "-"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
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
                  <td className="p-3 whitespace-nowrap">
                    <PaymentActions
                      payment={p}
                      onUpdated={() => fetchPage(currentPage)}
                      onDeleted={() => fetchPage(currentPage)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-400">
                  {t("No payments found", "No se encontraron pagos")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔢 Pagination */}
      {!isSearching && (
        <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
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
