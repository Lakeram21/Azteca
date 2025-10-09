import React, { useState, useRef, useCallback } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { getAllPayments } from "../firebasePayments";

export default function AdminQRScannerModal({ onClose }) {
  const [scanData, setScanData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const lastDetectedRef = useRef(null);

  // Payment validity check
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
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case "per several":
        if (payment.selectedDates?.length > 0) {
          return payment.selectedDates.some((d) => new Date(d).getTime() === new Date().setHours(0,0,0,0));
        }
        endDate.setDate(startDate.getDate());
        break;
      default:
        endDate.setDate(startDate.getDate());
    }

    return new Date() < endDate;
  };

  // Handle scan from camera
  const handleScan = useCallback(async (result) => {
    if (!result || !result[0]) return;

    const rawValue = result[0].rawValue;
    lastDetectedRef.current = rawValue;

    try {
      // Parse minimal QR: { userId, paymentId }
      const parsed = JSON.parse(rawValue);
      setScanData(parsed);
      setVerificationResult(null);

      // Fetch all payments for this user
      const allPayments = await getAllPayments(parsed.userId);
      const payment = allPayments.find((p) => p.id === parsed.paymentId);

      if (!payment) {
        setVerificationResult({ valid: false, error: "Payment not found" });
        return;
      }

      const valid = isPaymentValid(payment);

      setVerificationResult({
        valid,
        backendPayment: payment,
        details: {
          valid,
        },
      });
    } catch (err) {
      setScanData({ raw: rawValue });
      setVerificationResult({ valid: false, error: "Failed to parse QR" });
    }
  }, []);

  const handleError = (err) => {
    console.error("Scanner Error:", err);
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

        {/* Scanner with high resolution and autofocus */}
        <Scanner
          onScan={handleScan}
          onError={handleError}
          className="w-full h-72 rounded-lg"
          constraints={{
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            focusMode: "continuous",
            frameRate: { ideal: 30 },
          }}
          videoStyle={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "0.75rem",
          }}
        />

        <button
          onClick={() => {
            if (lastDetectedRef.current) {
              handleScan([{ rawValue: lastDetectedRef.current }]);
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
