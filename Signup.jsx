import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration Successful!");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-black to-gray-900">
      <div className="backdrop-blur-md bg-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800">
        <h2 className="text-4xl font-bold text-white mb-8 text-center animate-pulse">Create Account</h2>
        <form onSubmit={handleSignup} className="flex flex-col space-y-6">
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 border-2 border-gray-700 focus:outline-none focus:border-blue-500 transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Create a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 border-2 border-gray-700 focus:outline-none focus:border-blue-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl mt-4 transform hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

