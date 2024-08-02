"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../firebase"; // Adjust the import path as needed
import { createUserWithEmailAndPassword, updateProfile, User } from "firebase/auth";

// Define the type for form data
interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle input changes and update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user: User = userCredential.user;

      console.log("User registered:", user);

      // Update user profile with display name
      await updateProfile(user, { displayName: formData.name });

      // Redirect to the dashboard after successful signup
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-green-800">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-green-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-green-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-green-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Sign Up
          </button>
        </form>
        <p className="text-center text-green-700 mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-green-800 font-semibold hover:underline" prefetch={false}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
