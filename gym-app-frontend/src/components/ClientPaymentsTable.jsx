import React, { useState, useEffect } from "react";
import { QRCode } from "react-qrcode-logo"; 
import { getAllPayments } from "../firebasePayments";

export default function ClientPaymentsTable({ user }) {
  const [activePayments, setActivePayments] = useState([]);
  const [inactivePayments, setInactivePayments] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  function isPaymentValid(payment) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (payment.type) {
      case "per day":
        const dayEnd = new Date(payment.date);
        dayEnd.setDate(dayEnd.getDate() + 1);
        return today < dayEnd;
      case "per week":
        const weekEnd = new Date(payment.date);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return today < weekEnd;
      case "per month":
        const monthEnd = new Date(payment.date);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        return today < monthEnd;
      case "per several":
        if (!Array.isArray(payment.selectedDates) || payment.selectedDates.length === 0) return false;
        return payment.selectedDates.some(d => {
          const date = new Date(d);
          date.setHours(0,0,0,0);
          return date.getTime() === today.getTime();
        });
      default:
        return false;
    }
  }

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

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments(user.uid);
        setActivePayments(data.filter(isPaymentValid));
        setInactivePayments(data.filter(p => !isPaymentValid(p)));
      } catch (err) {
        console.error("Failed to fetch payments", err);
      }
    };
    fetchPayments();
  }, [user.uid]);

  return (
    <div className="bg-gray-800 p-4 sm:p-6 border-yellow-200">
      <div className="space-y-6">
        {activePayments.length > 0 ? (
          activePayments.map((p) => {
            const qrData = JSON.stringify({
              userId: user.uid,
              paymentId: p.id
            });

            return (
              <div
                key={p.id}
                className="bg-green-900 bg-opacity-30 border border-green-400 rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col md:flex-row md:justify-between md:items-center gap-4"
              >
                {/* Payment Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-200 mb-2">
                    Current Valid Payment
                  </h3>
                  <p><span className="font-semibold">Amount:</span> ${p.amount}</p>
                  <p><span className="font-semibold">Type:</span> {p.type}</p>
                  <p><span className="font-semibold">Start Date:</span> {p.date}</p>
                  {p.type === "per several" && (
                    <p><span className="font-semibold">Selected Dates:</span> {p.selectedDates?.join(", ")}</p>
                  )}
                  <p><span className="font-semibold">End Date:</span> {getEndDate(p).toISOString().split("T")[0]}</p>
                </div>

                {/* QR Code Container */}
                <div className="flex justify-center items-center w-full md:w-auto">
                  {/* Desktop Large */}
                  <div className="hidden md:flex justify-center items-center bg-white p-4 rounded-xl max-w-[350px] w-full">
                    <QRCode
                      value={qrData}
                      size={350}
                      ecLevel="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                      quietZone={10}
                      logoImage={null}
                    />
                  </div>

                  {/* Mobile Small */}
                  <div className="flex md:hidden justify-center items-center bg-white p-4 rounded-xl max-w-[220px] w-full">
                    <QRCode
                      value={qrData}
                      size={220}
                      ecLevel="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                      quietZone={10}
                      logoImage={null}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-800 text-center mt-2 md:hidden">Scan to verify</p>
                <p className="text-xs text-gray-800 text-center mt-2 hidden md:block">Scan to verify</p>
              </div>
            );
          })
        ) : (
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-400 rounded-xl p-4">
            <p className="text-yellow-200 font-semibold">No current valid payments found.</p>
          </div>
        )}
      </div>

      {inactivePayments.length > 0 && (
        <div className="mt-6">
          <button
            className="bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-xl shadow hover:shadow-lg transition mb-4"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Hide Previous Payments" : "Show Previous Payments"}
          </button>

          {showHistory && (
            <div className="max-h-96 overflow-y-auto rounded-xl border border-gray-600 p-4 space-y-3 bg-gray-900">
              {inactivePayments.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-800 rounded-xl p-3 border border-gray-700 hover:bg-gray-700 transition"
                >
                  <p><span className="font-semibold">Amount:</span> ${p.amount}</p>
                  <p><span className="font-semibold">Type:</span> {p.type}</p>
                  <p><span className="font-semibold">Start Date:</span> {p.date}</p>
                  {p.type === "per several" && (
                    <p><span className="font-semibold">Selected Dates:</span> {p.selectedDates?.join(", ")}</p>
                  )}
                  <p><span className="font-semibold">End Date:</span> {getEndDate(p).toISOString().split("T")[0]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
