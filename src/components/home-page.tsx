"use client";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; 
import { useRouter } from 'next/navigation';

const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50 relative"> 
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-md fixed top-0 left-0 w-full z-50"> 
        <Link href="/" className="flex items-center space-x-2" prefetch={false}>
          <Image
            src="/creativelogo.png" 
            width={24}
            height={24}
            alt="Creative Cure Logo"
            className="h-8 w-8 text-green-600"
          />
          <span className="sr-only">Creative Cure - Therapists</span>
        </Link>
        <nav className="ml-auto flex space-x-4 sm:space-x-6">
          <Link href="/therapists" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Therapists
          </Link>
          <Link href="/patients" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Patients
          </Link>
          <Link href="/community-chats" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Community Chats
          </Link>
          <Link href="/about" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            About
          </Link>
          <Link href="/profile" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Profile
          </Link>
          <button onClick={handleLogout} className="text-sm font-medium text-green-600 hover:underline">
            Logout
          </button>
        </nav>
      </header>

      {/* Hero Section (Fixed) */}
      <section className="relative h-screen w-full fixed top-0 left-0 z-10"> {/* Add fixed to make it stay on top */}
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/mentalhealth.avif"
            layout="fill"
            objectFit="cover"
            alt="Hero"
          />
        </div>

        {/* Quote Section */}
        <section className="absolute top-0 w-full h-full z-20"> 
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Creative Cure
            </h1>
            <p className="text-lg text-white/80 max-w-xl">
              <span className="italic font-light">You are not alone in your journey. We believe in creating a space where you feel safe to explore, grow, and heal.</span> <br />
            </p>
          </div>
        </section>
      </section> 

      {/* Main Content Section (Parallax) */}
      <main className="flex-1 relative z-20 mt-screen"> 

        {/* Welcome Message (Conditional) */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container mx-auto px-4 md:px-6 space-y-6">
            <div className="space-y-2 text-center">
              {user ? (
                <div>
                  <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">
                    Welcome Back!
                  </h2>
                  <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
                    You are now logged in. Explore our services, connect with
                    our therapists, and start your journey to well-being.
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">
                    Welcome to Creative Cure
                  </h2>
                  <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
                    Creative Cure is a platform designed to provide you with
                    personalized therapy and support resources to enhance your
                    mental and emotional well-being.
                  </p>
                </div>
              )}
            </div>
            <div className="text-center mt-6">
              {user ? (
                <Link href="/therapists" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Explore Our Services
                </Link>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    prefetch={false}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    prefetch={false}
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-100 p-6 md:py-12 w-full">
        <div className="container max-w-7xl mx-auto flex justify-center items-center">
          <div>
            <p className="text-sm text-gray-600">
              Creative Cure 2024 © COMP 2800
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;