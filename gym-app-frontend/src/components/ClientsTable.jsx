import React, { useState, useEffect } from "react";
import axios from "axios";
import EditClientForm from "./EditClientForm";
const API_URL = import.meta.env.VITE_API_URL;
export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(API_URL+"/users");
        setClients(res.data || []);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      }
    };
    fetchClients();
  }, []);

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
            Clients
          </h2>

          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-yellow-300 uppercase text-sm tracking-wider">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Actions</th>
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
                          View / Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-400">
                      No clients found
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
