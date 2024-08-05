"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Image from "next/image";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      console.log("User signed in:", user);
      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="absolute inset-0 z-0"> {/* Add a div for the background image */}
<Image
  src="/loginbackground.jpg"
  layout="responsive"
  className="object-cover h-screen w-screen"
  alt="Background Image"
/>
</div>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10">
        <h1 className="text-2xl font-bold mb-6 text-green-800">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Log In
          </button>
        </form>
        <p className="text-center text-green-700 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-green-800 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
</div>
  );
}
