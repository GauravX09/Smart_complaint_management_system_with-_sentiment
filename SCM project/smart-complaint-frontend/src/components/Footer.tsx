import React from "react";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <>
      {/* 🔥 CTA SECTION (IMPORTANT) */}
      <section className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Transform Complaint Management?
        </h2>
        <p className="mt-3 text-indigo-100">
          Join thousands of users already improving their experience.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:scale-105 transition">
            Get Started Now →
          </button>

          <button className="px-6 py-3 border border-white/40 rounded-lg hover:bg-white/10 transition">
            Contact Sales
          </button>
        </div>
      </section>

      {/* 🔽 MAIN FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">

          {/* Branding */}
          <div>
            <h2 className="text-white text-xl font-bold mb-2">
              Smart Complaint
            </h2>
            <p className="text-sm">
              Modern platform for efficient complaint handling with AI insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Integrations</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6">

          <p className="text-sm">
            © {new Date().getFullYear()} Smart Complaint System. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-5 mt-4 md:mt-0 text-xl">
            <FaLinkedin className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaYoutube className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;