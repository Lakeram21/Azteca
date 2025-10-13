import React, { useState } from "react";
import PaymentForm from "../components/PaymentForm.jsx";
import PaymentsTable from "../components/PaymentsTable.jsx";
import ClientPaymentsTable from "../components/ClientPaymentsTable.jsx";
import ClientWorkoutProgramsTable from "../components/ClientWorkoutProgram.jsx";
import ClientsTable from "../components/ClientsTable.jsx";
import WorkoutProgramsTable from "../components/workoutProgramsTable.jsx";
import WorkoutProgramForm from "../components/WorkoutProgramForm.jsx";
import AdminQRScannerModal from "../components/AdminQRScannerModal.jsx";
import { useLanguage } from "../context/LanguageContext"; // ✅ import

const Dashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState(null);
  const { language } = useLanguage(); // ✅ get language
  const t = (en, es) => (language === "en" ? en : es); // ✅ helper

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
          {user.role === "admin"
            ? t("Admin Dashboard", "Panel de Administración")
            : t(`Welcome, ${user.name}`, `Bienvenido, ${user.name}`)}
        </h1>
        <p className="text-gray-300 mt-2">
          {user.role === "admin"
            ? t(
                "Manage clients, payments, and workout programs efficiently",
                "Administra clientes, pagos y programas de entrenamiento eficientemente"
              )
            : t(
                "Track your payments and workout programs here",
                "Sigue tus pagos y programas de entrenamiento aquí"
              )}
        </p>
      </header>

      {user.role === "admin" ? (
        <main className="p-4 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {[
              { key: "payment", label: t("Add Payment", "Agregar Pago") },
              { key: "paymentsTable", label: t("Show Payments", "Mostrar Pagos") },
              { key: "clientsTable", label: t("View Clients", "Ver Clientes") },
              { key: "workoutPrograms", label: t("Workout Programs", "Programas de Entrenamiento") },
              { key: "verifyPayment", label: t("Verify Payment", "Verificar Pago") },
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
          {/* Client view */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">{t("Your Payments", "Tus Pagos")}</h2>
              <ClientPaymentsTable user={user} />
            </div>
            <div className="bg-gray-800 p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">{t("Workout Programs", "Programas de Entrenamiento")}</h2>
              <ClientWorkoutProgramsTable user={user} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Dashboard;
