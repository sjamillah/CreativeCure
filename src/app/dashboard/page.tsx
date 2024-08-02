"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface Therapist {
  name: string;
  specialization: string;
  image: string;
  description: string;
  uid: string;
}

const Home = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const fetchTherapists = async () => {
      const therapistsCollection = collection(db, 'therapists');
      const querySnapshot = await getDocs(therapistsCollection);
      const therapistData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id 
      })) as Therapist[];
      setTherapists(therapistData);
    };

    fetchTherapists();
  }, []);

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
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-md fixed top-0 left-0 w-full z-10">
        <Link href="/" className="flex items-center space-x-2" prefetch={false}>
          <img
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

      <main className="flex-1">
        <section className="relative h-screen">
          <img
            src="/mentalhealth.avif"
            layout="fill"
            objectFit="cover"
            alt="Hero"
            className="opacity-1"
          />
          <div className="absolute inset-0 bg-white opacity-30 mix-blend-overlay"></div>
          <div className="container mx-auto px-4 md:px-6 flex flex-row items-center justify-center h-full text-center z-10">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Creative Cure
              </h1>
              <p className="text-lg text-white/80 max-w-xl">
                Experience personalized therapy sessions tailored to your unique needs. Our team of licensed therapists offers a variety of therapeutic approaches, including cognitive-behavioral therapy, psychodynamic therapy, and holistic methods. We prioritize creating a safe, confidential, and supportive environment where you can explore your thoughts and feelings. Whether you are dealing with anxiety, depression, relationship issues, or personal growth, our therapists are committed to guiding you towards healing and self-discovery.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container mx-auto px-4 md:px-6 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Meet Our Therapists</h2>
              <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
                Our team of experienced therapists is dedicated to giving therapy to people with autism and psychological disorders.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {therapists.map((therapist) => (
                <div
                  key={therapist.uid}
                  className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center space-y-4"
                >
                  <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                    <Image
                      src={therapist.image}
                      width={64}
                      height={64}
                      alt={`${therapist.name} icon`}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">
                    {therapist.name}
                  </h3>
                  <p className="text-green-600">{therapist.specialization}</p>
                  <p className="text-center text-green-700">
                    {therapist.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-100 p-6 md:py-12 w-full">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Creative Cure 2024 © COMP 2800
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-twitter text-gray-600 hover:text-green-600"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram text-gray-600 hover:text-green-600"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-facebook text-gray-600 hover:text-green-600"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

const therapists = [
  {
    name: "Katty Houston",
    specialization: "Child Therapist",
    image: "/therapist2.jpg",
    description: "Katty is a licensed child therapist with over 5 years of experience helping youth overcome emotional and behavioral challenges."
  },
  {
    name: "Michael Johnson",
    specialization: "Art and Autism Therapist",
    image: "/therapist3.jpg",
    description: "Michael is a skilled therapist with 15 years of experience who helps young kids with autism express their emotions and work through creative expression."
  },
  {
    name: "Sarah Anderson",
    specialization: "Autism Therapist",
    image: "/therapist2.jpg",
    description: "Sarah is a therapist with 5 years of experience who specializes in helping people with autism disorders and analyzes the behavior of these people to help them through therapy."
  },
  {
    name: "Audrey Hauston",
    specialization: "Art and Psychological Therapist",
    image: "/therapist5.jpg",
    description: "Audrey is a skilled art therapist who helps youth express their emotions and work through trauma through creative expression."
  }
];
