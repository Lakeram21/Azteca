import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PaymentsPage({ user }) {
  const [paymentData, setPaymentData] = useState({
    clientId: "",
    type: "per day",
    amount: "",
    date: "",
    durationDays: ""
  });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all clients/users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5001/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        clientId: paymentData.clientId,
        type: paymentData.type,
        amount: Number(paymentData.amount),
        date: paymentData.date,
        userId: user.id
      };
      if (paymentData.type === "per several") {
        payload.durationDays = Number(paymentData.durationDays || 0);
      }

      await axios.post("http://localhost:5001/payments", payload, {
        headers: { "Content-Type": "application/json" }
      });

      setMessage("✅ Payment recorded successfully!");
      setPaymentData({
        clientId: "",
        type: "per day",
        amount: "",
        date: "",
        durationDays: ""
      });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Failed to record payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-6 text-center">
        Add Payment
      </h1>

      {message && (
        <p className="mb-4 text-center text-green-400 font-semibold">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-gray-800 p-6 rounded-2xl shadow-2xl space-y-4"
      >
        {/* Client selector */}
        <select
          name="clientId"
          value={paymentData.clientId}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          required
        >
          <option value="">Select a client</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        {/* Payment type */}
        <select
          name="type"
          value={paymentData.type}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        >
          <option value="per day">Per Day</option>
          <option value="per week">Per Week</option>
          <option value="per month">Per Month</option>
          <option value="per several">Several Days</option>
        </select>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={paymentData.amount}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          required
        />

        {/* Date */}
        <input
          type="date"
          name="date"
          value={paymentData.date}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          required
        />

        {/* Duration for "per several" */}
        {paymentData.type === "per several" && (
          <input
            type="number"
            name="durationDays"
            placeholder="Number of days"
            value={paymentData.durationDays}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        )}

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition duration-200"
        >
          Record Payment
        </button>
      </form>
    </div>
  );
}
