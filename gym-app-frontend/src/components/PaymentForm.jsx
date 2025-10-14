import React, { useState, useEffect } from "react";
import { getAllUsers } from "../firebaseUsers";
import { addPayment } from "../firebasePayments";
import { useLanguage } from "../context/LanguageContext";
import { useLoader } from "../context/LoaderContext";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PaymentForm({ user, onPaymentRecorded }) {
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  const [paymentData, setPaymentData] = useState({
    clientId: "",
    type: "per day",
    amount: "",
    date: "",
    selectedDays: []
  });

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all clients/users
  useEffect(() => {
    const fetchUsers = async () => {
      showLoader();
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error(t("Failed to fetch users", "Error al obtener usuarios"), err);
      }finally{
        hideLoader()
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "selectedDays") {
      const newSelected = checked
        ? [...paymentData.selectedDays, value]
        : paymentData.selectedDays.filter((d) => d !== value);
      setPaymentData({ ...paymentData, selectedDays: newSelected });
    } else {
      setPaymentData({ ...paymentData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!paymentData.clientId) {
        alert(t("Please select a client", "Por favor seleccione un cliente"));
        return;
      }

      const payload = {
        clientId: paymentData.clientId,
        type: paymentData.type,
        amount: Number(paymentData.amount),
        date: paymentData.date,
        userId: user.uid
      };

      if (paymentData.type === "per several") {
        if (!paymentData.selectedDays.length) {
          alert(t("Select at least one day for multiple day payment", "Seleccione al menos un día para pago múltiple"));
          return;
        }

        const start = new Date(paymentData.date);
        const selectedDates = paymentData.selectedDays.map((day) => {
          const dayIndex = WEEKDAYS.indexOf(day);
          const date = new Date(start);
          while (date.getDay() !== (dayIndex + 1) % 7) {
            date.setDate(date.getDate() + 1);
          }
          return date.toISOString().split("T")[0];
        });

        payload.selectedDates = selectedDates;
      }

      await addPayment(payload);
      setMessage(t("✅ Payment recorded successfully!", "✅ ¡Pago registrado correctamente!"));
      setPaymentData({
        clientId: "",
        type: "per day",
        amount: "",
        date: "",
        selectedDays: []
      });

      if (onPaymentRecorded) onPaymentRecorded(payload);

    } catch (err) {
      console.error(err);
      setMessage(t("❌ Failed to record payment", "❌ Error al registrar pago"));
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl p-6 space-y-4 border-l-4 border-gray-500">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">{t("Add Payment", "Agregar Pago")}</h2>

      {message && (
        <p className={`font-semibold ${message.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Client search and selection */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder={t("Search client by name or email...", "Buscar cliente por nombre o correo...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <select
            name="clientId"
            value={paymentData.clientId}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          >
            <option value="">{t("Select a client", "Seleccione un cliente")}</option>
            {filteredUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Payment type */}
        <select
          name="type"
          value={paymentData.type}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        >
          <option value="per day">{t("Per Day", "Por Día")}</option>
          <option value="per week">{t("Per Week", "Por Semana")}</option>
          <option value="per month">{t("Per Month", "Por Mes")}</option>
          <option value="per several">{t("Several Days", "Varios Días")}</option>
        </select>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder={t("Amount", "Monto")}
          value={paymentData.amount}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* Date */}
        <input
          type="date"
          name="date"
          value={paymentData.date}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* Multiple days */}
        {paymentData.type === "per several" && (
          <div className="space-y-2">
            <p className="font-semibold text-white">{t("Select days:", "Seleccione días:")}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {WEEKDAYS.map((day) => (
                <label key={day} className="flex items-center space-x-2 cursor-pointer text-gray-200 hover:text-white transition">
                  <input
                    type="checkbox"
                    name="selectedDays"
                    value={day}
                    checked={paymentData.selectedDays.includes(day)}
                    onChange={handleChange}
                    className="accent-yellow-400"
                  />
                  <span>{t(day, day)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition duration-200"
        >
          {t("Record Payment", "Registrar Pago")}
        </button>
      </form>
    </div>
  );
}
