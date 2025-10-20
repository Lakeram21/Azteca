import React, { useEffect, useState } from "react";
import { getPrices, addPrice, updatePrice, deletePrice } from "../firebaseAds";
import { useLoader } from "../context/LoaderContext";

export default function AdminPrices() {
  
  const { showLoader, hideLoader } = useLoader();

  const [prices, setPrices] = useState([]);

  const [newPrice, setNewPrice] = useState({
    title: "",
    amount: "",
    features: [""],
  });

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    showLoader();
    const data = await getPrices();
    setPrices(data);
    hideLoader();
  };

  const handleAdd = async () => {
    if (!newPrice.title || !newPrice.amount) return alert("Title and amount required");
    showLoader();
    await addPrice(newPrice);
    setNewPrice({ title: "", amount: "", features: [""] });
    await fetchPrices();
  };

  const handleUpdate = async (id, updated) => {
    showLoader();
    await updatePrice(id, updated);
    await fetchPrices();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    showLoader();
    await deletePrice(id);
    await fetchPrices();
  };

  const handleFeatureChange = (index, value, priceObj, setFunc) => {
    const updated = [...priceObj.features];
    updated[index] = value;
    setFunc({ ...priceObj, features: updated });
  };

  const addFeatureField = (priceObj, setFunc) => {
    setFunc({ ...priceObj, features: [...priceObj.features, ""] });
  };

  const removeFeatureField = (index, priceObj, setFunc) => {
    const updated = priceObj.features.filter((_, i) => i !== index);
    setFunc({ ...priceObj, features: updated });
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">Admin Ads / Prices</h2>

      {/* Add new price */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-10">
        <h3 className="text-xl font-semibold mb-4">Add New Ad</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Title"
            className="p-2 rounded-lg bg-gray-700 text-white"
            value={newPrice.title}
            onChange={(e) => setNewPrice({ ...newPrice, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Amount (e.g., $50/mo)"
            className="p-2 rounded-lg bg-gray-700 text-white"
            value={newPrice.amount}
            onChange={(e) => setNewPrice({ ...newPrice, amount: e.target.value })}
          />
        </div>

        <h4 className="text-lg font-medium mb-2">Features</h4>
        {newPrice.features.map((f, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`Feature ${i + 1}`}
              className="p-2 rounded-lg bg-gray-700 text-white flex-1"
              value={f}
              onChange={(e) =>
                handleFeatureChange(i, e.target.value, newPrice, setNewPrice)
              }
            />
            <button
              onClick={() => removeFeatureField(i, newPrice, setNewPrice)}
              className="bg-red-500 px-3 rounded-lg"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={() => addFeatureField(newPrice, setNewPrice)}
          className="bg-gray-600 px-4 py-2 rounded-lg mb-4"
        >
          ➕ Add Feature
        </button>

        <div>
          <button
            onClick={handleAdd}
            className="bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-lg hover:scale-105 transition"
          >
            Add Ad
          </button>
        </div>
      </div>

      {/* Existing prices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prices.map((p) => (
          <div
            key={p.id}
            className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl border border-slate-200"
          >
            <input
              type="text"
              value={p.title}
              onChange={(e) => handleUpdate(p.id, { ...p, title: e.target.value })}
              className="text-2xl font-semibold mb-2 w-full bg-transparent border-b border-gray-300 focus:outline-none"
            />
            <input
              type="text"
              value={p.amount}
              onChange={(e) => handleUpdate(p.id, { ...p, amount: e.target.value })}
              className="text-3xl font-bold text-amber-500 mb-4 w-full bg-transparent border-b border-gray-300 focus:outline-none"
            />

            <ul className="text-slate-600 space-y-2 mb-6">
              {p.features?.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  ✅
                  <input
                    type="text"
                    value={f}
                    onChange={(e) => {
                      const updatedFeatures = [...p.features];
                      updatedFeatures[i] = e.target.value;
                      handleUpdate(p.id, { ...p, features: updatedFeatures });
                    }}
                    className="bg-transparent border-b border-gray-300 focus:outline-none flex-1"
                  />
                  <button
                    onClick={() => {
                      const updatedFeatures = p.features.filter((_, idx) => idx !== i);
                      handleUpdate(p.id, { ...p, features: updatedFeatures });
                    }}
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    const updated = [...(p.features || []), ""];
                    handleUpdate(p.id, { ...p, features: updated });
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add Feature
                </button>
              </li>
            </ul>

            <button
              onClick={() => handleDelete(p.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
