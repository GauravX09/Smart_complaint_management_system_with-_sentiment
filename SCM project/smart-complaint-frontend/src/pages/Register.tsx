import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const DEPARTMENTS = [
  "ENGINEERING",
  "LAW",
  "BUSINESS",
  "HOTEL",
  "ARCHITECTURE",
  "PHARMACY",
  "PHYSIOTHERAPY",
  "SPORTS",
  "DEFENCE",
  "FOOD",
];

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    department: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const isValidEmail = (email: string) => {
    return email.endsWith("@amity.edu") || email.endsWith("@gmail.com");
  };

  const registerUser = async () => {
    const { firstName, lastName, phoneNumber, department, email, password } =
      form;

    if (!firstName || !lastName) {
      setError("First name and last name are required");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Valid phone number is required");
      return;
    }

    if (!department) {
      setError("Please select a department");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Only @amity.edu or @gmail.com emails are allowed");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await API.post("/api/auth/register", form);

      setSuccess("Registration successful. Awaiting admin approval.");

      setForm({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        department: "",
        email: "",
        password: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-[950px] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* LEFT PANEL */}
        <div className="w-1/2 bg-gradient-to-b from-blue-400 to-blue-600 text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Join SCM 🚀</h2>
          <p className="text-sm opacity-90">
            Register to manage complaints, track progress and get AI-based insights.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Registration
          </h2>

          {/* ALERTS */}
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-2 rounded mb-3 text-sm">
              {success}
            </div>
          )}

          {/* NAME */}
          <div className="flex gap-3 mb-4">
            <input
              name="firstName"
              placeholder="First Name"
              className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          {/* PHONE */}
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          {/* DEPARTMENT */}
          <select
            name="department"
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* EMAIL */}
          <input
            name="email"
            placeholder="Email (@amity.edu / @gmail.com)"
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
            value={form.email}
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* BUTTON */}
          <button
            onClick={registerUser}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Register
          </button>

          {/* LOGIN */}
          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer font-semibold"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;