import React, { useState, useEffect, useMemo } from "react";
import EditClientForm from "./EditClientForm";
import { getAllUsers } from "../firebaseUsers";
import { useLanguage } from "../context/LanguageContext";
import { useLoader } from "../context/LoaderContext";

export default function ClientsTable() {
  const { showLoader, hideLoader } = useLoader();
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const clientsPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        showLoader();
        const allUsers = await getAllUsers();
        setClients(allUsers);
      } catch (err) {
        console.error(t("Failed to fetch users", "Error al obtener usuarios"), err);
      } finally {
        hideLoader();
      }
    };
    fetchUsers();
  }, [language]);

  // Filter clients based on search input
  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const currentClients = filteredClients.slice(startIndex, startIndex + clientsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="bg-gray-900 text-white shadow-2xl rounded-2xl p-6 mt-6">
      {selectedClient ? (
        <EditClientForm
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      ) : (
        <>
          <h2 className="text-2xl font-extrabold mb-5 text-yellow-400 text-center">
            {t("Clients", "Clientes")}
          </h2>

          {/* Search Bar */}
          <div className="mb-4 flex justify-center">
            <input
              type="text"
              placeholder={t("Search by name or email...", "Buscar por nombre o correo...")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-yellow-300 uppercase text-sm tracking-wider">
                  <th className="p-3 text-left">{t("Name", "Nombre")}</th>
                  <th className="p-3 text-left">{t("Email", "Correo")}</th>
                  <th className="p-3 text-left">{t("Actions", "Acciones")}</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.length > 0 ? (
                  currentClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-800 transition-all duration-200 border-b border-gray-700"
                    >
                      <td className="p-3 font-semibold">{client.name}</td>
                      <td className="p-3">{client.email}</td>
                      <td className="p-3">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-full font-bold transition transform hover:scale-105"
                          onClick={() => setSelectedClient(client)}
                        >
                          {t("View / Edit", "Ver / Editar")}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-400">
                      {t("No clients found", "No se encontraron clientes")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  currentPage === 1
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                }`}
              >
                {t("Prev", "Anterior")}
              </button>

              <span className="px-3 text-yellow-400">
                {t("Page", "Página")} {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  currentPage === totalPages
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                }`}
              >
                {t("Next", "Siguiente")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
