import React, { useState, useEffect } from "react";
import axios from "axios";

// Helper to check if payment is valid
function isPaymentValid(payment) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight

  switch (payment.type) {
    case "per day": {
      const startDate = new Date(payment.date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      return today < endDate;
    }

    case "per week": {
      const startDate = new Date(payment.date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      return today < endDate;
    }

    case "per month": {
      const startDate = new Date(payment.date);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
      return today < endDate;
    }

    case "per several": {
      // payment.selectedDates is an array of ISO date strings
      if (!Array.isArray(payment.selectedDates) || payment.selectedDates.length === 0) {
        return false;
      }
      return payment.selectedDates.some((d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
      });
    }

    default:
      return false;
  }
}

// Helper to get end date
function getEndDate(payment) {
  switch (payment.type) {
    case "per day":
      const dayEnd = new Date(payment.date);
      dayEnd.setDate(dayEnd.getDate() + 1);
      return dayEnd;

    case "per week":
      const weekEnd = new Date(payment.date);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return weekEnd;

    case "per month":
      const monthEnd = new Date(payment.date);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      return monthEnd;

    case "per several":
      if (!Array.isArray(payment.selectedDates) || payment.selectedDates.length === 0) return new Date(payment.date);
      const dates = payment.selectedDates.map(d => new Date(d));
      return new Date(Math.max(...dates.map(d => d.getTime())));

    default:
      return new Date(payment.date);
  }
}

export default function PaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://localhost:5001/payments");
        console.log("Fetched payments:", res.data);
        setPayments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (p) =>
      (p.client.name &&
        p.client.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.client.email &&
        p.client.email.toLowerCase().includes(search.toLowerCase())) ||
      (p.client.id && p.client.id.toString().includes(search))
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-gray-900 text-white shadow-2xl rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-extrabold mb-5 text-yellow-400 flex items-center justify-center">
        All Payments
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="🔎 Search by name, email, or ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-yellow-300 uppercase text-sm tracking-wider">
              <th className="p-3 text-left">Payment ID</th>
              <th className="p-3 text-left">Client ID</th>
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
            {currentPayments.length > 0 ? (
              currentPayments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-800 transition-all duration-200 border-b border-gray-700"
                >
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.clientId}</td>
                  <td className="p-3 font-semibold">{p.client.name || "-"}</td>
                  <td className="p-3">{p.client.email || "-"}</td>
                  <td className="p-3 capitalize">{p.type}</td>
                  <td className="p-3 font-bold text-green-400">${p.amount}</td>
                  <td className="p-3">{p.date}</td>
                  <td className="p-3">{getEndDate(p).toISOString().split("T")[0]}</td>
                  <td className="p-3">
                    {p.type === "per several" && p.selectedDates
                      ? p.selectedDates.join(", ")
                      : "-"}
                  </td>
                  <td className="p-3">
                    {isPaymentValid(p) ? (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ✅ Valid
                      </span>
                    ) : (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ❌ Expired
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-400">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 transition"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded font-bold transition ${
                currentPage === i + 1
                  ? "bg-yellow-400 text-black shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 transition"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}
