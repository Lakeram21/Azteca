import React, { useState } from "react";
import PaymentForm from "../components/PaymentForm.jsx";
import PaymentsTable from "../components/PaymentsTable.jsx";
import ClientPaymentsTable from "../components/ClientPaymentsTable.jsx";
import ClientWorkoutProgramsTable from "../components/ClientWorkoutProgram.jsx";
import ClientsTable from "../components/ClientsTable.jsx";
import WorkoutProgramsTable from "../components/workoutProgramsTable.jsx";
import WorkoutProgramForm from "../components/WorkoutProgramForm.jsx";
import AdminQRScannerModal from "../components/AdminQRScannerModal.jsx";

const Dashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  const tabClasses = (isActive) =>
    `px-4 py-2 rounded-xl font-semibold text-sm transition ${
      isActive
        ? "bg-yellow-400 text-gray-900"
        : "bg-gray-800 text-gray-200 hover:bg-gray-700"
    }`;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="text-center p-6">
        <h1 className="text-4xl font-bold text-yellow-400">
          {user.role === "admin" ? "Admin Dashboard" : `Welcome, ${user.name}`}
        </h1>
        <p className="text-gray-300 mt-2">
          {user.role === "admin"
            ? "Manage clients, payments, and workout programs efficiently"
            : "Track your payments and workout programs here"}
        </p>
      </header>

      {user.role === "admin" ? (
        <main className="p-4 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {[
              { key: "payment", label: "Add Payment" },
              { key: "paymentsTable", label: "Show Payments" },
              { key: "clientsTable", label: "View Clients" },
              { key: "workoutPrograms", label: "Workout Programs" },
              { key: "verifyPayment", label: "Verify Payment" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={tabClasses(activeSection === tab.key)}
                onClick={() => toggleSection(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {activeSection === "payment" && <PaymentForm user={user} />}
            {activeSection === "paymentsTable" && <PaymentsTable user={user} />}
            {activeSection === "clientsTable" && <ClientsTable />}
            {activeSection === "verifyPayment" && (
              <AdminQRScannerModal onClose={() => setActiveSection(null)} />
            )}
            {activeSection === "workoutPrograms" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WorkoutProgramsTable user={user} />
                <WorkoutProgramForm user={user} />
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className="p-4 space-y-6">
          {/* Client view: stack on mobile, side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">Your Payments</h2>
              <ClientPaymentsTable user={user} />
            </div>
            <div className="bg-gray-800 p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">Workout Programs</h2>
              <ClientWorkoutProgramsTable user={user} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Dashboard;
