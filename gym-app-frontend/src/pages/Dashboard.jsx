import React, { useState } from "react";
import PaymentForm from "../components/PaymentForm";
import PaymentsTable from "../components/PaymentsTable";
import ClientPaymentsTable from "../components/ClientPaymentsTable";
import ClientWorkoutProgramsTable from "../components/ClientWorkoutProgram";
import ClientsTable from "../components/ClientsTable";
import WorkoutProgramsTable from "../components/WorkoutProgramsTable";
import WorkoutProgramForm from "../components/WorkoutProgramForm";
import AdminQRScannerModal from "../components/AdminQRScannerModal";

function Dashboard({ user }) {
  const [activeSection, setActiveSection] = useState(null);
  const [programs, setPrograms] = useState([]);

  const handleProgramCreated = (newProgram) => {
    setPrograms((prev) => [...prev, newProgram]);
  };

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const tabClasses = (isActive) =>
    `px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition-all duration-200 ${
      isActive
        ? "bg-gray-700/60 ring-2 ring-gray-500 text-white backdrop-blur-sm"
        : "bg-gray-800/60 hover:bg-gray-700/60 text-gray-200 backdrop-blur-sm"
    }`;

  const backgroundImage =
    user.role === "client"
      ? "/dashboard_background2.jpg"
      : "/dashboard_background.jpg";

  return (
    <div
      className="min-h-screen bg-gray-900 text-gray-100 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Wave Overlay */}
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-40 md:h-60 lg:h-72 opacity-80"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>
          <path
            d="M0,160 C360,80 1080,240 1440,160 L1440,0 L0,0 Z"
            fill="url(#waveGradient)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 tracking-wide mb-2 drop-shadow-lg">
            {user.role === "admin" ? "Admin Dashboard" : `Welcome, ${user.name}`}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl drop-shadow">
            {user.role === "admin"
              ? "Manage clients, payments, and workout programs efficiently"
              : "Track your payments and workout programs here"}
          </p>
        </div>

        {/* Admin View */}
        {user.role === "admin" && (
          <>
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <button
                className={tabClasses(activeSection === "payment")}
                onClick={() => toggleSection("payment")}
              >
                {activeSection === "payment" ? "Close Payment Form" : "Add Payment"}
              </button>
              <button
                className={tabClasses(activeSection === "paymentsTable")}
                onClick={() => toggleSection("paymentsTable")}
              >
                {activeSection === "paymentsTable" ? "Hide Payments" : "Show Payments"}
              </button>
              <button
                className={tabClasses(activeSection === "clientsTable")}
                onClick={() => toggleSection("clientsTable")}
              >
                {activeSection === "clientsTable" ? "Hide Clients" : "View Clients"}
              </button>
              <button
                className={tabClasses(activeSection === "workoutPrograms")}
                onClick={() => toggleSection("workoutPrograms")}
              >
                {activeSection === "workoutPrograms" ? "Hide Programs" : "Workout Programs"}
              </button>
              <button
                className={tabClasses(activeSection === "verifyPayment")}
                onClick={() => toggleSection("verifyPayment")}
              >
                {activeSection === "verifyPayment" ? "Hide Programs" : "Verify Payment"}
              </button>
            </div>

            {/* Admin Sections */}
            <div className="space-y-8">
              {activeSection === "payment" && (
                <div className="bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border-l-4 border-gray-500">
                  <PaymentForm user={user} />
                </div>
              )}
              {activeSection === "paymentsTable" && (
                <div className="bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border-l-4 border-gray-500">
                  <h2 className="text-xl font-semibold mb-4">Payments</h2>
                  <PaymentsTable user={user} />
                </div>
              )}
              {activeSection === "clientsTable" && (
                <div className="bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border-l-4 border-gray-500">
                  <h2 className="text-xl font-semibold mb-4">Clients</h2>
                  <ClientsTable />
                </div>
              )}
              {activeSection === "verifyPayment" && (
                <div className="bg-gray-800/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border-l-4 border-gray-500">
                  <h2 className="text-xl font-semibold mb-4">Verify Payment</h2>
                  <AdminQRScannerModal onClose={() => setActiveSection(null)} />
                </div>
              )}
              {activeSection === "workoutPrograms" && (
                <div className="bg-gray-900/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border-l-4 border-gray-600">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-6">Workout Programs</h2>
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Programs Table */}
                    <div className="flex-1 bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl shadow-inner">
                      <WorkoutProgramsTable user={user} programs={programs} />
                    </div>
                    {/* Program Form */}
                    <div className="w-full lg:w-120 bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl shadow-inner">
                      <WorkoutProgramForm user={user} onCreated={handleProgramCreated} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Client View */}
        {user.role === "client" && (
          <div className="space-y-6">
            <div className="flex gap-6 flex-col lg:flex-row">
              {/* Payments Card */}
              <div className="flex-1 bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl p-6 border-l-4 border-yellow-400">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-white">Your Payments</h2>
                  <button
                    className="bg-yellow-400/70 text-gray-900 font-semibold px-4 py-1 rounded-xl shadow hover:shadow-lg transition"
                    onClick={() => toggleSection("payments")}
                  >
                    {activeSection === "payments" ? "Hide" : "Show"}
                  </button>
                </div>
                {activeSection === "payments" && <ClientPaymentsTable user={user} />}
              </div>

              {/* Workout Programs Card */}
              <div className="flex-1 bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl p-6 border-l-4 border-yellow-400">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-white">Your Workout Programs</h2>
                  <button
                    className="bg-yellow-400/70 text-gray-900 font-semibold px-4 py-1 rounded-xl shadow hover:shadow-lg transition"
                    onClick={() => toggleSection("programs")}
                  >
                    {activeSection === "programs" ? "Hide" : "Show"}
                  </button>
                </div>
                {activeSection === "programs" && <ClientWorkoutProgramsTable user={user} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
