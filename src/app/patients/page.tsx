"use client";
import Image from 'next/image';
import Link from 'next/link';
import Modal from 'react-modal';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth';

interface Therapist {
  name: string;
  specialization: string;
  image: string;
  description: string;
  uid: string;
}

interface Appointment {
  id?: string;
  date: string;
  time: string;
  therapist: string;
  status: 'pending' | 'confirmed' | 'completed'; 
  patientId: string; 
}

const PatientsPage = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [user, loading, error] = useAuthState(auth); 
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null); 
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    date: "",
    time: "",
    therapist: "",
    status: 'pending',
    patientId: user?.uid || '',
  });

  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const therapistsCollection = collection(db, 'therapists');
        const querySnapshot = await getDocs(therapistsCollection);
        const therapistData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id 
        })) as Therapist[];
        setTherapists(therapistData);
        setIsLoading(false); 
      } catch (error) {
        console.error("Error fetching therapists:", error);
      }
    };

    fetchTherapists();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch appointments for the current user only
        const appointmentCollection = collection(db, 'appointments');
        const q = query(appointmentCollection, where('patientId', '==', user?.uid));
        const appointmentSnapshot = await getDocs(q);
        const appointmentList = appointmentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];
        setAppointments(appointmentList);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const openModal = (therapist: Therapist) => {
    if (!isLoading) { 
      setSelectedTherapist(therapist);
      setNewAppointment({
        ...newAppointment,
        therapist: therapist.name,
      });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedTherapist(null); 
    setNewAppointment({
      date: "",
      time: "",
      therapist: "",
      status: 'pending',
      patientId: user?.uid || '',
    });
    setIsModalOpen(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewAppointment({ ...newAppointment, [id]: value });
  };

  const handleBooking = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Instead of adding the appointment directly, you'll likely want to:
      // 1.  Trigger a payment process (e.g., using Stripe)
      // 2.  After successful payment, create the appointment in Firestore
      // 3.  Update the appointment status to 'confirmed' 

      // For now, we'll just create the appointment with pending status
      await addDoc(collection(db, "appointments"), newAppointment);
      setAppointments([...appointments, { ...newAppointment }]);
      closeModal();
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
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
          <Link href="/dashboard" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Home
          </Link>
          <Link href="/therapists" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Therapists
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

      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="/patientsbackground.jpg"
          layout="fill"
          objectFit="cover"
          alt="Hero"
          className="opacity-1" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-green-400 opacity-50 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center h-full text-center z-10">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Creative Cure - Patients
          </h1>
          <p className="text-lg text-white/80 max-w-xl">
            <span className="italic font-light">"You are not alone in your journey. We believe in creating a space where you feel safe to explore, grow, and heal."</span> <br />
            <span className="italic font-light">"Our therapists are dedicated to helping you find your strength and resilience. We're here to support you every step of the way."</span>
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
        <div className="container mx-auto px-4 md:px-6 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">
              Your Resources
            </h2>
            <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
              Explore resources that can help support your mental and emotional
              well-being.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Resource 1: Quickdraw (Drawing Tool) */}
            <div className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center space-y-4">
              <a href="https://quickdraw.withgoogle.com/#" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/images/quickdraw.png" // Replace with an image of quickdraw
                  width={64}
                  height={64}
                  alt="Quickdraw"
                  className="rounded-full object-cover"
                />
              </a>
              <h3 className="text-xl font-semibold text-green-800">
                Quickdraw
              </h3>
              <p className="text-green-600">Creative Expression Tool</p>
              <p className="text-center text-green-700">
                Express yourself visually with Quickdraw, a fun and interactive
                drawing tool. 
              </p>
            </div>

            {/* Resource 2: Music Therapy API (placeholder) */}
            <div className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center space-y-4">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/images/music-icon.png" // Replace with a music icon
                  width={64}
                  height={64}
                  alt="Music Therapy API"
                  className="rounded-full object-cover"
                />
              </a>
              <h3 className="text-xl font-semibold text-green-800">
                Music Therapy API 
              </h3>
              <p className="text-green-600">Explore Music for Wellbeing</p>
              <p className="text-center text-green-700">
                Discover music curated for therapeutic benefits.  This API
                provides a curated selection of music. 
              </p>
            </div>

            {/* Add more resources as needed */}

          </div>
        </div>
      </section>

      {/* Upcoming Sessions Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
        <div className="container mx-auto px-4 md:px-6 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">
              Your Upcoming Sessions
            </h2>
          </div>
          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center space-y-4"
                >
                  <h3 className="text-xl font-semibold text-green-800">
                    {appointment.date}
                  </h3>
                  <p className="text-green-600">
                    Time: {appointment.time}
                  </p>
                  <p className="text-green-600">
                    Therapist: {appointment.therapist}
                  </p>
                  <p className="text-center text-green-700">
                    Status: {appointment.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              You don't have any upcoming sessions scheduled.
            </p>
          )}
        </div>
      </section>

      {/* Therapists Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
        <div className="container mx-auto px-4 md:px-6 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">
              Meet Our Therapists
            </h2>
            <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
              Our team of experienced therapists is dedicated to providing
              therapy to people with autistic and psychological disorders.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading therapists...</p> 
            ) : (
              therapists.map((therapist) => (
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
                  <button 
                    onClick={() => openModal(therapist)} 
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
                  >
                    Book Session
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <footer className="bg-green-100 p-6 md:py-12 w-full">
        <div className="container max-w-7xl mx-auto flex justify-center items-center">
          <div>
            <p className="text-sm text-gray-600">
              Creative Cure 2024 © COMP 2800
            </p>
          </div>
        </div>
      </footer>
      {/* Appointment Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Book Appointment Modal"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
        <form onSubmit={handleBooking}>
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700">Date</label>
            <input
              id="date"
              type="date"
              value={newAppointment.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-gray-700">Time</label>
            <input
              id="time"
              type="time"
              value={newAppointment.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="therapist" className="block text-gray-700">Therapist</label>
            <select
              id="therapist"
              value={newAppointment.therapist}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              {!isLoading && therapists.map((therapist) => (
                <option key={therapist.uid} value={therapist.name}>
                  {therapist.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PatientsPage;

const therapists = [
  {
    name: "Katty Houston",
    specialization: "Child Therapist",
    image: "/therapist2.jpg",
    description: "Jessica is a licensed child therapist with over 5 years of experience helping youth overcome emotional and behavioral challenges."
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
    description: "Sarah is a therapist with 5 years of experience who specializes in helping people with autistic disorders and analyzes the behavior of these people to help them through therapy."
  },
  {
    name: "Audrey Hauston",
    specialization: "Art and Psychological Therapist",
    image: "/therapist5.jpg",
    description: "Audrey is a skilled art therapist who helps youth express their emotions and work through trauma through creative expression."
  }
];