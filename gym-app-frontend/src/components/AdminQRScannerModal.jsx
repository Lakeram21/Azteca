import React, { useState, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"

export default function AdminQRScannerModal({ onClose }) {
  const [scanData, setScanData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const lastDetectedRef = useRef(null);

  // Payment validity function
  const isPaymentValid = (payment) => {
    const startDate = new Date(payment.date);
    const endDate = new Date(startDate);

    switch (payment.type) {
      case "per day":
        endDate.setDate(startDate.getDate() + 1);
        break;
      case "per week":
        endDate.setDate(startDate.getDate() + 7);
        break;
      case "per month":
        endDate.setDate(startDate.getDate() + 30);
        break;
      case "per several":
        endDate.setDate(startDate.getDate() + (payment.durationDays || 0));
        break;
      default:
        endDate.setDate(startDate.getDate());
    }

    return new Date() < endDate;
  };

  const handleVerifyPayment = async () => {
    if (!scanData?.payment?.id) {
      alert("Invalid QR data");
      return;
    }

    try {
      // Fetch payment from backend
      const res = await axios.get(
        `${API_URL}/payments/${scanData.payment.id}`
      );
      const paymentFromBackend = res.data;

      // Verify user
      const userMatches =
        String(scanData.user.id) === String(paymentFromBackend.clientId) &&
        scanData.user.email === paymentFromBackend.client.email;

      // Verify payment details
      const paymentMatches =
        scanData.payment.amount === paymentFromBackend.amount &&
        scanData.payment.type === paymentFromBackend.type;

      // Verify validity
      const valid = isPaymentValid(paymentFromBackend);

      const allValid = userMatches && paymentMatches && valid;

      setVerificationResult({
        valid: allValid,
        details: {
          userMatches,
          paymentMatches,
          valid,
        },
        backendPayment: paymentFromBackend,
      });
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationResult({ valid: false, error: "Failed to fetch payment" });
    }
  };

  return (
    <div className="flex items-center justify-center z-50 bg-black/70">
      <div className="relative bg-gray-800 text-white rounded-2xl p-6 w-96">
        <button
          className="absolute top-3 right-3 text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">
          Scan Payment QR
        </h2>

        <Scanner
          onScan={(result) => {
            if (result && result[0]) {
              lastDetectedRef.current = result[0].rawValue;
            }
          }}
          onError={(err) => console.error("Scanner Error:", err)}
          constraints={{ facingMode: "environment", width: 640, height: 480 }}
          styles={{ container: { width: "100%" } }}
        />

        <button
          onClick={() => {
            if (lastDetectedRef.current) {
              try {
                setScanData(JSON.parse(lastDetectedRef.current));
                setVerificationResult(null);
              } catch {
                setScanData({ raw: lastDetectedRef.current });
                setVerificationResult(null);
              }
            } else {
              alert("No QR code detected yet. Position a QR in front of the camera.");
            }
          }}
          className="mt-4 w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold"
        >
          Scan QR
        </button>

        {scanData && (
          <div className="mt-4 bg-gray-700 p-3 rounded-xl">
            <button
              onClick={handleVerifyPayment}
              className="mb-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              Verify Payment
            </button>

            <h3 className="font-bold mb-2">Scanned Data:</h3>
            <pre className="text-xs">{JSON.stringify(scanData, null, 2)}</pre>
          </div>
        )}

        {verificationResult && (
          <div
            className={`mt-4 p-3 rounded-xl ${
              verificationResult.valid ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <h3 className="font-bold mb-2 text-center">
              {verificationResult.valid ? "Payment Verified ✅" : "Payment Invalid ❌"}
            </h3>
            {verificationResult.details && (
              <pre className="text-xs">
                {JSON.stringify(verificationResult.details, null, 2)}
              </pre>
            )}
            {verificationResult.backendPayment && (
              <pre className="text-xs mt-2">
                Backend Payment: {JSON.stringify(verificationResult.backendPayment, null, 2)}
              </pre>
            )}
            {verificationResult.error && <p>{verificationResult.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
