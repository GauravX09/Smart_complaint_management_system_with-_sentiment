import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 text-white text-center">
      <h2 className="text-3xl font-bold">
        Start Your Digital Transformation Today
      </h2>

      <p className="mt-3 text-indigo-200">
        Join modern institutions using smart complaint systems.
      </p>

      <div className="mt-6">
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-semibold hover:scale-105 transition"
        >
          Get Started →
        </button>
      </div>
    </section>
  );
}