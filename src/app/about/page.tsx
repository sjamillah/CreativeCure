import Link from "next/link";
import Image from 'next/image'; 
import React from 'react';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-green-50 relative"> 
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-md fixed top-0 left-0 w-full z-10">
        <Link href="/" className="flex items-center space-x-2" prefetch={false}>
          <Image
            src="/creativelogo.png" 
            width={32}
            height={32}
            alt="Creative Cure Logo"
            className="h-8 w-8 text-green-600"
          />
          <span className="sr-only">Creative Cure - Therapists</span>
        </Link>
        <nav className="ml-auto flex space-x-4 sm:space-x-6">
          <Link href="/" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            About
          </Link>
          <Link href="/therapists" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Therapists
          </Link>
          <Link href="/contact" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Contact
          </Link>
        </nav>
      </header>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/aboutbackground.jpg" 
          layout="responsive"
          width={1300}
          alt="Background Image"
        />
      </div>

      <main className="flex-1 py-12 md:py-24 lg:py-32 z-10"> 
        <div className="container mx-auto px-4 md:px-6 space-y-12">
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

          <section className="text-center">
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

          <section className="text-center">
            <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">Our Team</h2>
            <p className="text-lg text-green-700 mt-4 max-w-2xl mx-auto">
              Our team of dedicated therapists is passionate about supporting youth in their journey towards healing and growth.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {teamMembers.map((member) => (
    <div key={member.name} className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4">
      <div className="relative w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
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
      </main>

      <footer className="bg-green-100 p-6 md:py-12 w-full">
        <div className="container max-w-7xl mx-auto flex justify-center items-center">
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
}


const teamMembers = [
  {
    name: "Jamillah Ssozi",
    role: "Software Engineer",
    image: "/jamillah.png",
    bio: "Jamillah is an undergraduate software engineer with a passion in helping people with mental disorders using creative and cultural industries."
  }
];

