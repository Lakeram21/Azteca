import React, { useState, useEffect } from "react";
import EditClientForm from "./EditClientForm";
import { getAllUsers } from "../firebaseUsers";
import { useLanguage } from "../context/LanguageContext";
import { useLoader } from "../context/LoaderContext";

export default function ClientsTable() {
  const { showLoader, hideLoader } = useLoader();
  
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    
    const fetchUsers = async () => {
      showLoader();
      try {
        const allUsers = await getAllUsers();
        setClients(allUsers);
      } catch (err) {
        console.error(t("Failed to fetch users", "Error al obtener usuarios"), err);
      }finally{
        hideLoader()
      }
    };
    fetchUsers();
  }, [language]); // optionally re-fetch if language changes

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
                {clients.length > 0 ? (
                  clients.map((client) => (
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
        </>
      )}
    </div>
  );
}
