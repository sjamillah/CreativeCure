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
    <div className="flex flex-col min-h-screen bg-background relative">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-md relative top-0 left-0 w-full z-50">
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

{/* Main Content Section (Parallax) */}
<main className="flex-1 relative z-20"> 
<section className="relative h-screen w-full fixed top-0 left-0 z-10">
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
              <p className="text-2xl text-white/80 max-w-xl">
                <span className="italic font-dark text-green-600">"You are not alone in your journey. We believe in creating a space where you feel safe to explore, grow, and heal."</span> <br />
              </p>
            </div>
          </section>
        </section> 

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 space-y-6">
            {/* Personalized Therapy Section */}
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">
                Experience Personalized Therapy
              </h2>
              <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
                At Creative Cure, we understand that everyone's journey is unique.
                We offer personalized therapy sessions tailored to your specific
                needs, empowering you to heal, grow, and thrive.
              </p>
            </div>

            {/* Therapists Section */}
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">
                Meet Our Therapists
              </h2>
              <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
                Our team of experienced therapists is dedicated to giving
                therapy to people with autism and psychological disorders.
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

      <section id="companySec" className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-4"> {/* Use grid for layout */}
      <div className="relative w-full">
        <img 
          src="/supportsec.jpg"
          alt="Company Info"
          layout="relative"
          width={800}
          height={800}
          className="rounded-full"
        />
      </div>
      <div className="xl:md-0 xl:w-100/50 p-6 bg-primary-foreground"> {/* Text Container */}
        <h2 className="text-2xl font-bold text-green-800 mb-4">Support Your Loved Ones</h2>
        <p className="text-green-700">
          Navigating the challenges of psychological and autistic disorders can be overwhelming, but you don't have to do it alone. Our platform offers comprehensive resources and expert guidance to support you and your family every step of the way.
        </p>
        <p className="text-green-700">
          Join our community and connect with other parents and caregivers who understand your journey. Together, we can create a nurturing environment that fosters growth, resilience, and well-being for your loved ones.
        </p>
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
