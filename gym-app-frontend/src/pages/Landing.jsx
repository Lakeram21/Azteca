import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"
// Workout Routines Data
const routines = [
  {
    title: "Push–Pull–Legs (PPL) Split",
    description:
      "Push Day → chest, shoulders, triceps. Pull Day → back, biceps. Legs Day → quads, hamstrings, glutes, calves.",
    image: "/public/dashboard_background.jpg",
  },
  {
    title: "Full Body Workout",
    description:
      "Each session trains all major muscle groups, often 2–4 days per week.",
    image: "/public/dashboard_background2.jpg",
  },
  {
    title: "High-Intensity Interval Training (HIIT)",
    description:
      "Alternates short bursts of intense effort with recovery periods. Usually 15–30 minutes per session.",
    image: "/public/profile_background.jpg",
  },
];

function Landing() {
  const [currentRoutine, setCurrentRoutine] = useState(0);

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

        {/* Wave Divider */}
        <div className="absolute bottom-0 w-full">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-32"
            preserveAspectRatio="none"
          >
            <path
              fill="#f1f5f9"
              d="M0,160L80,154.7C160,149,320,139,480,128C640,117,800,107,960,122.7C1120,139,1280,181,1360,202.7L1440,224V320H0Z"
            />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-amber-300 drop-shadow-lg">
            Train Smarter. Get Stronger.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200">
            Unlock personalized programs, track your workouts, and enjoy
            community support that keeps you motivated.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="bg-amber-300 text-indigo-950 font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition"
            >
              Get Started
            </Link>
            <a
              href="#pricing"
              className="bg-transparent border-2 border-amber-300 text-amber-300 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-amber-200/20 transition"
            >
              View Plans
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 bg-indigo-900 text-slate-100">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-300 mb-4">Why Choose Us?</h2>
          <p className="text-slate-300 text-lg">
            We combine technology, expertise, and community to help you reach
            your fitness goals faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-indigo-800/80 p-6 rounded-2xl shadow-xl border-l-4 border-amber-300">
            <h3 className="text-2xl font-semibold mb-3">Track your Progress</h3>
            <p className="text-slate-300">
              Train and track your progress with our app.
            </p>
          </div>
          <div className="bg-indigo-800/80 p-6 rounded-2xl shadow-xl border-l-4 border-amber-300">
            <h3 className="text-2xl font-semibold mb-3">Personalized Programs</h3>
            <p className="text-slate-300">
              Tailored workout plans that adapt to your fitness level and goals.
            </p>
          </div>
          <div className="bg-indigo-800/80 p-6 rounded-2xl shadow-xl border-l-4 border-amber-300">
            <h3 className="text-2xl font-semibold mb-3">Community Support</h3>
            <p className="text-slate-300">
              Stay motivated with trainers and peers cheering you on.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-slate-100 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-indigo-800 mb-6">
            Membership Plans
          </h2>
          <p className="text-slate-600 mb-12">
            Flexible pricing that adapts to your lifestyle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <h3 className="text-2xl font-semibold mb-4">Basic</h3>
              <p className="text-4xl font-bold text-amber-400 mb-6">$20/mo</p>
              <ul className="text-slate-600 space-y-2 mb-6">
                <li>✅ Gym Access</li>
                <li>❌ Personal Training</li>
                <li>❌ No Workout Tracking</li>
              </ul>
              <Link
                to="/login"
                className="block bg-amber-300 text-indigo-950 font-bold py-2 rounded-lg hover:scale-105 transition"
              >
                Join Now
              </Link>
            </div>

            <div className="bg-amber-300 text-indigo-950 p-8 rounded-2xl shadow-xl transform scale-105">
              <h3 className="text-2xl font-semibold mb-4">Standard</h3>
              <p className="text-4xl font-bold mb-6">$35/mo</p>
              <ul className="space-y-2 mb-6">
                <li>✅ Gym Access</li>
                <li>✅ Workout Plans</li>
                <li>✅ Workout Tracking</li>
              </ul>
              <Link
                to="/login"
                className="block bg-indigo-900 text-amber-300 font-bold py-2 rounded-lg hover:scale-105 transition"
              >
                Join Now
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <h3 className="text-2xl font-semibold mb-4">Premium</h3>
              <p className="text-4xl font-bold text-amber-400 mb-6">$50/mo</p>
              <ul className="text-slate-600 space-y-2 mb-6">
                <li>✅ Gym Access</li>
                <li>✅ Workout Plans</li>
                <li>✅ Workout Tracking</li>
                <li>✅ Personal Training</li>
                <li>✅ Personal Meal Plans</li>
              </ul>
              <Link
                to="/login"
                className="block bg-amber-300 text-indigo-950 font-bold py-2 rounded-lg hover:scale-105 transition"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workout Routines Section */}
      <section className="py-16 bg-slate-50 text-gray-900 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-8">
          Workout Routines
        </h2>

        <div className="relative w-full max-w-4xl overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentRoutine * 100}%)` }}
          >
            {routines.map((routine, index) => (
              <div key={index} className="flex-none w-full px-4">
                <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center">
                  <img
                    src={routine.image}
                    alt={routine.title}
                    className="w-full md:w-1/2 h-64 object-cover rounded-2xl"
                  />
                  <div className="flex flex-col gap-4 md:w-1/2">
                    <h3 className="text-2xl font-bold text-indigo-700">
                      {routine.title}
                    </h3>
                    <p className="text-slate-600">{routine.description}</p>
                    <a
                      href="#"
                      className="bg-indigo-700 text-white font-bold px-6 py-2 rounded-full text-center w-fit hover:bg-indigo-600 transition"
                    >
                      Check Out Guides
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
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
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 py-8 text-center text-slate-400">
        <p>© {new Date().getFullYear()} AztecaGym. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
