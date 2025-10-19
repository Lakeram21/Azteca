import React, { useState, useEffect } from "react";
import { updatePayment, deletePayment } from "../firebasePayments";
import { useLoader } from "../context/LoaderContext";
import { useLanguage } from "../context/LanguageContext";

export default function PaymentActions({ payment, onUpdated, onDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...payment });
  const { showLoader, hideLoader } = useLoader();
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsEditing(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleEditClick = () => setIsEditing(true);

  const handleDeleteClick = async () => {
    if (
      !window.confirm(
        t(
          "Are you sure you want to delete this payment?",
          "¿Seguro que deseas eliminar este pago?"
        )
      )
    )
      return;
    try {
      showLoader();
      await deletePayment(payment.id);
      onDeleted(payment.id);
    } catch (err) {
      console.error("Error deleting payment:", err);
    } finally {
      hideLoader();
    }
  };

  const handleSave = async () => {
    try {
      showLoader();
      await updatePayment(payment.id, form);
      setIsEditing(false);
      onUpdated();
    } catch (err) {
      console.error("Error updating payment:", err);
    } finally {
      hideLoader();
    }
  };

  return (
    <div>
      {!isEditing ? (
        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="px-2 py-1 bg-blue-500 rounded text-white hover:bg-blue-600 whitespace-nowrap"
          >
            ✏️ {t("Edit", "Editar")}
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-2 py-1 bg-red-600 rounded text-white hover:bg-red-700 whitespace-nowrap"
          >
            🗑 {t("Delete", "Eliminar")}
          </button>
        </div>
      ) : (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 backdrop-blur-sm bg-white/10 z-40"
            onClick={() => setIsEditing(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <h3 className="font-bold text-lg mb-4">{t("Edit Payment", "Editar Pago")}</h3>

              <div className="flex flex-col gap-4">
                <label className="flex flex-col">
                  {t("Amount", "Monto")}
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </label>

                <label className="flex flex-col">
                  {t("Type", "Tipo")}
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="per day">Per Day</option>
                    <option value="per week">Per Week</option>
                    <option value="per month">Per Month</option>
                    <option value="per several">Per Several</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  {t("Start Date", "Fecha Inicio")}
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </label>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 whitespace-nowrap"
                >
                  💾 {t("Save", "Guardar")}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 whitespace-nowrap"
                >
                  ❌ {t("Cancel", "Cancelar")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
