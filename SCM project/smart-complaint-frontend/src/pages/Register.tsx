import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const isValidEmail = (email: string) => {
    return (
      email.endsWith("@amity.edu") ||
      email.endsWith("@gmail.com")
    );
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

    const payload = {
      firstName,
      lastName,
      phoneNumber,
      department,
      email,
      password,
    };

    try {
      await API.post("/api/auth/register", payload);

      setSuccess(
        "Registration successful. Waiting for Super Admin approval."
      );

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-2xl rounded-xl w-[420px] p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Registration
        </h2>

        {error && (
          <div className="text-red-700 bg-red-100 p-2 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-700 bg-green-100 p-2 rounded text-sm">
            {success}
          </div>
        )}

        <div className="flex gap-3">
          <input
            name="firstName"
            placeholder="First Name"
            className="w-1/2 p-2 border rounded"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            className="w-1/2 p-2 border rounded"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={form.phoneNumber}
          onChange={handleChange}
        />

        <select
          name="department"
          className="w-full p-2 border rounded"
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

        <input
          name="email"
          placeholder="Email (@amity.edu / @gmail.com)"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={form.password}
          onChange={handleChange}
        />

        <button
          onClick={registerUser}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
        >
          Register
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
