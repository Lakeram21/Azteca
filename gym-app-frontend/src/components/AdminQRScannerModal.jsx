import React, { useState, useRef, useCallback } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { getAllPayments } from "../firebasePayments";
import { useLanguage } from "../context/LanguageContext";

export default function AdminQRScannerModal({ onClose }) {
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  const [scanData, setScanData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const lastDetectedRef = useRef(null);

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
          return payment.selectedDates.some(
            (d) => new Date(d).getTime() === new Date().setHours(0, 0, 0, 0)
          );
        }
        endDate.setDate(startDate.getDate());
        break;
      default:
        endDate.setDate(startDate.getDate());
    }

    return new Date() < endDate;
  };

  const handleScan = useCallback(async (result) => {
    if (!result || !result[0]) return;

    const rawValue = result[0].rawValue;
    lastDetectedRef.current = rawValue;

    try {
      const parsed = JSON.parse(rawValue);
      setScanData(parsed);
      setVerificationResult(null);

      const allPayments = await getAllPayments(parsed.userId);
      const payment = allPayments.find((p) => p.id === parsed.paymentId);

      if (!payment) {
        setVerificationResult({ valid: false, error: t("Payment not found", "Pago no encontrado") });
        return;
      }

      const valid = isPaymentValid(payment);

      setVerificationResult({
        valid,
        backendPayment: payment,
        details: { valid },
      });
    } catch (err) {
      setScanData({ raw: rawValue });
      setVerificationResult({ valid: false, error: t("Failed to parse QR", "Error al leer QR") });
    }
  }, [t]);

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
          {t("Scan Payment QR", "Escanear QR de Pago")}
        </h2>

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
              alert(
                t(
                  "No QR code detected yet. Position a QR in front of the camera.",
                  "No se ha detectado un QR. Coloca un QR frente a la cámara."
                )
              );
            }
          }}
          className="mt-4 w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold"
        >
          {t("Scan QR", "Escanear QR")}
        </button>

        {verificationResult && verificationResult.backendPayment && (
          <div
            className={`mt-4 p-4 rounded-xl shadow-lg ${
              verificationResult.valid ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <h3 className="text-center font-bold text-lg mb-3">
              {verificationResult.valid
                ? `✅ ${t("Payment Verified", "Pago Verificado")}`
                : `❌ ${t("Payment Invalid", "Pago Inválido")}`}
            </h3>

            <div className="bg-gray-800 p-3 rounded space-y-2">
              <div>
                <span className="font-semibold">{t("Client Name:", "Nombre del Cliente:")}</span>{" "}
                {verificationResult.backendPayment.client?.name || "-"}
              </div>
              <div>
                <span className="font-semibold">{t("Client Email:", "Correo del Cliente:")}</span>{" "}
                {verificationResult.backendPayment.client?.email || "-"}
              </div>
              <div>
                <span className="font-semibold">{t("Payment Amount:", "Monto del Pago:")}</span>{" "}
                ${verificationResult.backendPayment.amount || "-"}
              </div>
              <div>
                <span className="font-semibold">{t("Start Date:", "Fecha Inicio:")}</span>{" "}
                {verificationResult.backendPayment.date || "-"}
              </div>
              <div>
                <span className="font-semibold">{t("End Date:", "Fecha Fin:")}</span>{" "}
                {new Date(
                  (() => {
                    const p = verificationResult.backendPayment;
                    const today = new Date(p.date);
                    switch (p.type) {
                      case "per day":
                        today.setDate(today.getDate() + 1);
                        break;
                      case "per week":
                        today.setDate(today.getDate() + 7);
                        break;
                      case "per month":
                        today.setMonth(today.getMonth() + 1);
                        break;
                      case "per several":
                        if (p.selectedDates?.length) {
                          const dates = p.selectedDates.map(d => new Date(d));
                          return Math.max(...dates.map(d => d.getTime()));
                        }
                        break;
                    }
                    return today;
                  })()
                ).toISOString().split("T")[0]}
              </div>
              <div>
                <span className="font-semibold">{t("Status:", "Estado:")}</span>{" "}
                {verificationResult.valid
                  ? `✅ ${t("Valid", "Válido")}`
                  : `❌ ${t("Expired", "Expirado")}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
