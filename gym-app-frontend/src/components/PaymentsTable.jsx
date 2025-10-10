import React, { useState, useEffect } from "react";
import { getPaginatedPayments, searchPaymentsByUser } from "../firebasePayments";
import PaymentsExport from "./PaymentsExport";

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
      return payment.selectedDates.some(d => new Date(d).getTime() === today.getTime());
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
      if (!payment.selectedDates || !payment.selectedDates.length) return new Date(payment.date);
      const dates = payment.selectedDates.map(d => new Date(d));
      return new Date(Math.max(...dates.map(d => d.getTime())));
    }
    default:
      return new Date(payment.date);
  }
}

export default function PaymentsTable() {
  const itemsPerPage = 50;
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [pageCursors, setPageCursors] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch normal paginated payments
  const fetchPage = async (pageNumber) => {
    try {
      const lastDoc = pageCursors[pageNumber - 1];
      const { data, lastVisible, hasMore: more } = await getPaginatedPayments({
        limitCount: itemsPerPage,
        lastDoc,
      });

      setPageCursors(prev => {
        const updated = [...prev];
        updated[pageNumber] = lastVisible;
        return updated;
      });

      setPayments(data);
      setHasMore(more);
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    }
  };

  // Search payments by user
  const handleSearchClick = async () => {
    if (!search.trim()) {
      // Reset search: fetch first page normally
      setIsSearching(false);
      setPageCursors([null]);
      fetchPage(1);
      return;
    }

    try {
      setIsSearching(true);
      const data = await searchPaymentsByUser(search.trim());
      setPayments(data);
      setHasMore(false); // search results are all returned at once
      setCurrentPage(1);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  return (
    <div className="bg-gray-900 text-white shadow-2xl rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-extrabold mb-5 text-yellow-400 flex items-center justify-center">
        All Payments
      </h2>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="🔎 Search by client name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
        <button
          onClick={handleSearchClick}
          className="px-4 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
        >
          Search
        </button>
      </div>
      {/* Export */}
      <PaymentsExport/>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-yellow-300 uppercase text-sm tracking-wider">
              <th className="p-3 text-left">Client Name</th>
              <th className="p-3 text-left">Client Email</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">End Date</th>
              <th className="p-3 text-left">Selected Dates</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? payments.map(p => (
              <tr key={p.id} className="hover:bg-gray-800 transition-all duration-200 border-b border-gray-700">
                <td className="p-3 font-semibold">{p.client.name || "-"}</td>
                <td className="p-3">{p.client.email || "-"}</td>
                <td className="p-3 capitalize">{p.type}</td>
                <td className="p-3 font-bold text-green-400">${p.amount}</td>
                <td className="p-3">{p.date}</td>
                <td className="p-3">{getEndDate(p).toISOString().split("T")[0]}</td>
                <td className="p-3">{p.type === "per several" ? p.selectedDates?.join(", ") : "-"}</td>
                <td className="p-3">
                  {isPaymentValid(p) ? (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">✅ Valid</span>
                  ) : (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">❌ Expired</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">No payments found</td>
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
            ⬅ Prev
          </button>
          <span className="px-3 py-1 rounded font-bold">Page {currentPage}</span>
          <button
            onClick={() => fetchPage(currentPage + 1)}
            disabled={!hasMore}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}
