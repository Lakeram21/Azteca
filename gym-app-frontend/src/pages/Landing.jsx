import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRoutines, getPrices } from "../firebaseAds";
import { useLanguage } from "../context/LanguageContext";


export default function Landing() {
  const [routines, setRoutines] = useState([]);
  const [prices, setPrices] = useState([]);
  const [currentRoutine, setCurrentRoutine] = useState(0);

  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  // Fetch routines and prices from Firebase
  useEffect(() => {
    async function fetchData() {
      const r = await getRoutines();
      setRoutines(r);

      const p = await getPrices();
      setPrices(p);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-slate-100 bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950">
      {/* Hero Section */}
      <div
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden"
        style={{
          backgroundImage: "url('/landing_background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/90 via-indigo-800/70 to-indigo-950/90" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-amber-300 drop-shadow-lg">
            {t("Train Smarter. Get Stronger.", "Entrena Inteligente. Sé Más Fuerte.")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200">
            {t(
              "Unlock personalized programs, track your workouts, and enjoy community support that keeps you motivated.",
              "Desbloquea programas personalizados, sigue tus entrenamientos y disfruta del apoyo de la comunidad que te mantiene motivado."
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="bg-amber-300 text-indigo-950 font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition"
            >
              {t("Get Started", "Comenzar")}
            </Link>
            <a
              href="#pricing"
              className="bg-transparent border-2 border-amber-300 text-amber-300 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-amber-200/20 transition"
            >
              {t("View Plans", "Ver Planes")}
            </a>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-slate-100 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-indigo-800 mb-6">{t("Membership Plans", "Planes de Membresía")}</h2>
          <p className="text-slate-600 mb-12">{t("Flexible pricing that adapts to your lifestyle.", "Precios flexibles que se adaptan a tu estilo de vida.")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {prices.map((plan, idx) => (
              <div key={plan.id} className={`p-8 rounded-2xl shadow-xl ${idx === 1 ? "bg-amber-300 text-indigo-950 transform scale-105" : "bg-white text-gray-900 border border-slate-200"}`}>
                <h3 className="text-2xl font-semibold mb-4">{plan.title}</h3>
                <p className="text-4xl font-bold mb-6">{plan.amount}</p>
                <ul className="text-slate-600 space-y-2 mb-6">
                  {plan.features?.map((f, i) => <li key={i}>✅ {f}</li>)}
                </ul>
                <Link
                  to="/login"
                  className={`block font-bold py-2 rounded-lg hover:scale-105 transition ${idx === 1 ? "bg-indigo-900 text-amber-300" : "bg-amber-300 text-indigo-950"}`}
                >
                  {t("Join Now", "Unirse")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
       {/* Features Section */}
      <section className="py-20 px-6 bg-indigo-900 text-slate-100">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-300 mb-4">{t("Why Choose Us?", "¿Por Qué Elegirnos?")}</h2>
          <p className="text-slate-300 text-lg">
            {t(
              "We combine technology, expertise, and community to help you reach your fitness goals faster.",
              "Combinamos tecnología, experiencia y comunidad para ayudarte a alcanzar tus objetivos de fitness más rápido."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-indigo-800/80 p-6 rounded-2xl shadow-xl border-l-4 border-amber-300">
            <h3 className="text-2xl font-semibold mb-3">{t("Track your Progress", "Sigue tu Progreso")}</h3>
            <p className="text-slate-300">
              {t("Train and track your progress with our app.", "Entrena y sigue tu progreso con nuestra app.")}
            </p>
          </div>
          <div className="bg-indigo-800/80 p-6 rounded-2xl shadow-xl border-l-4 border-amber-300">
            <h3 className="text-2xl font-semibold mb-3">{t("Personalized Programs", "Programas Personalizados")}</h3>
            <p className="text-slate-300">
              {t(
                "Tailored workout plans that adapt to your fitness level and goals.",
                "Planes de entrenamiento adaptados a tu nivel de fitness y objetivos."
              )}
            </p>
          </div>
          <div className="bg-indigo-800/80 p-6 rounded-2xl shadow-xl border-l-4 border-amber-300">
            <h3 className="text-2xl font-semibold mb-3">{t("Community Support", "Apoyo Comunitario")}</h3>
            <p className="text-slate-300">
              {t("Stay motivated with trainers and peers cheering you on.", "Mantente motivado con entrenadores y compañeros animándote.")}
            </p>
          </div>
        </div>
      </section>

      {/* Workout Routines Section */}
      <section className="py-16 bg-slate-50 text-gray-900 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-8">{t("Workout Routines", "Rutinas de Entrenamiento")}</h2>

        {routines.length > 0 && (
          <div className="relative w-full max-w-4xl overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentRoutine * 100}%)` }}
            >
              {routines.map((routine, index) => (
                <div key={routine.id} className="flex-none w-full px-4">
                  <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center">
                   
                      <img
                        src="/profile_background.jpg"
                        alt={routine.title}
                        className="w-full md:w-1/2 h-64 object-cover rounded-2xl"
                      />
                   
                    <div className="flex flex-col gap-4 md:w-1/2">
                      <h3 className="text-2xl font-bold text-indigo-700">{routine.title}</h3>
                      <p className="text-slate-600">{routine.description}</p>
                      <a
                        href={routine.image}
                        className="bg-indigo-700 text-white font-bold px-6 py-2 rounded-full text-center w-fit hover:bg-indigo-600 transition"
                      >
                        {t("Check Out Guides", "Ver Guías")}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6 gap-3">
              {routines.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    currentRoutine === idx ? "bg-indigo-700" : "bg-slate-400"
                  }`}
                  onClick={() => setCurrentRoutine(idx)}
                />
              ))}
            </div>
          </div>
        )}

      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 py-8 text-center text-slate-400">
        <p>© {new Date().getFullYear()} AztecaGym. All rights reserved.</p>
      </footer>
    </div>
  );
}
