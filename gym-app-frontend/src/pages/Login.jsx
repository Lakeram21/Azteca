import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = isSignup
        ? "http://localhost:5001/users/signup"
        : "http://localhost:5001/users/login";

      const payload = isSignup ? { name, email, password, phone } : { email, password };
      const res = await axios.post(url, payload);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-96 flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 tracking-wide">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition duration-200 mb-4"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          className="text-gray-300 text-sm cursor-pointer hover:text-yellow-400 transition"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
}
