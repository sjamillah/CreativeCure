"use client";
import Link from "next/link";
import Image from 'next/image'; 
import React from 'react';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const About = () => {

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
          <Link href="/dashboard" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Home
          </Link>
          <Link href="/therapists" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Patients
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

      <main className="flex-1 relative z-20"> 
          {/* Hero Section (Fixed) */}
          <section className="relative h-screen w-full fixed top-0 left-0 z-0"> {/* Add fixed to make it stay on top */}
            {/* Background Image */}
            <div className="absolute inset-0 z-0"> 
              <Image
                src="/aboutbackground.jpg" 
                layout="fill"
                objectFit="cover"
                alt="Background Image"
              />
            </div>

            {/* Quote Section */}
            <section className="absolute top-0 w-full h-full z-10"> 
              <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                  Creative Cure
                </h1>
                <p className="text-lg text-white/80 max-w-xl">
                  <span className="italic font-light">"You are not alone in your journey. We believe in creating a space where you feel safe to explore, grow, and heal."</span> <br />
                </p>
              </div>
            </section>
          </section> 
    
          <section className="w-full py-12 md:py-24 lg:py-32 mt-4 mb-2 p-3">
            <div className="container mx-auto px-4 md:px-6 space-y-6">
              <section className="text-center">
                <h1 className="text-4xl font-bold text-green-800 sm:text-5xl md:text-6xl">About Us</h1>
                <p className="text-lg text-green-700 mt-4 max-w-2xl mx-auto">
                  At Creative Cure, we are committed to empowering youth through personalized therapy and creative expression.
                  Our mission is to provide a safe and nurturing environment for personal growth and healing.
                </p>
              </section>

              <section className="text-center">
                <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Our Vision</h2>
                <p className="text-lg text-green-700 mt-4 max-w-2xl mx-auto">
                  We envision a world where every young person has access to the support and resources they need to thrive, emotionally and creatively.
                </p>
              </section>

              <section className="text-center mt-16 mb-8 p-10">
                <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Our Values</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-semibold text-green-700">Compassion</h3>
                    <p className="text-green-600 mt-2">
                      We approach each individual with kindness and understanding, fostering a supportive and caring environment.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-semibold text-green-700">Integrity</h3>
                    <p className="text-green-600 mt-2">
                      We are committed to honesty and transparency in all our interactions, ensuring trust and respect.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-semibold text-green-700">Creativity</h3>
                    <p className="text-green-600 mt-2">
                      We believe in the power of creative expression as a tool for healing and personal growth.
                    </p>
                  </div>
                </div>
              </section>

              <section className="flex flex-col items-center text-center mt-16 mb-8 p-10">
                <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Our Team</h2>
                <p className="text-lg text-green-700 mt-4 max-w-2xl mx-auto">
                  Our team of dedicated therapists is passionate about supporting youth in their journey towards healing and growth.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <div key={member.name} className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4">
                      <div className="relative w-40 h-40 bg-green-200 rounded-full flex items-center justify-center">
                        <Image
                          src={member.image}
                          layout="fill"
                          objectFit="cover" 
                          alt={`${member.name} profile picture`}
                          className="rounded-full" 
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-green-900">{member.name}</h3>
                      <p className="text-green-600 text-2xl font-bold">{member.role}</p>
                      <p className="text-center text-green-700">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="text-center">
                <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Join Us</h2>
                <p className="text-lg text-green-700 mt-4 max-w-2xl mx-auto">
                  Interested in joining our team or learning more about our programs? Contact us to find out how you can get involved.
                </p>
                <Link href="/contact" className="mt-6 inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700">
                  Get in Touch
                </Link>
              </section>
            </div>
          </section>

          {/* Other Sections (With Parallax Effect) */}
          {/* ... (Add your other sections here) */}
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

export default About;

const teamMembers = [
  {
    name: "Jamillah Ssozi",
    role: "Software Engineer",
    image: "/jamillah.png",
    bio: "Jamillah is an undergraduate software engineer with a passion in helping people with mental disorders using creative and cultural industries."
  }
];