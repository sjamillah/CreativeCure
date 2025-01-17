"use client";
import Image from 'next/image';
import Link from 'next/link';
import Modal from 'react-modal';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import router from 'next/router';

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
      await addDoc(collection(db, "appointments"), newAppointment);
      setAppointments([...appointments, { ...newAppointment }]);
      closeModal();
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-md relative top-0 left-0 w-full z-50">
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
          <Link href="/dashboard" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Home
          </Link>
          <Link href="/therapists" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Therapists
          </Link>
          <Link href="/community" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
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
            <span className="italic font-light justify-center text-center">You are not alone in your journey. We believe in creating a space where you feel safe to explore, grow, and heal.</span> <br />
            <span className="italic font-light justify-center text-center">Our therapists are dedicated to helping you find your strength and resilience. We&lsquo;re here to support you every step of the way.</span>
          </p>
        </div>
      </section>

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
            <div className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center space-y-4">
                <Image
                  src="/quickdraw.png" 
                  width={64}
                  height={64}
                  alt="Quickdraw"
                  className="rounded-full object-cover"
                />
              <h3 className="text-xl font-semibold text-green-800">
                Quickdraw
              </h3>
              <p className="text-green-600"><a href="https://quickdraw.withgoogle.com/" target="_blank" rel="noopener noreferrer">
              Creative Expression Tool</a></p>
              <p className="text-center text-green-700">
                Express yourself visually with Quickdraw, a fun and interactive
                drawing tool. 
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center space-y-4">
                <Image
                  src="/music.png" 
                  width={64}
                  height={64}
                  alt="Music Therapy API"
                  className="rounded-full object-cover"
                />
              <h3 className="text-xl font-semibold text-green-800">
                Music Therapy API
              </h3>
              <p className="text-green-600"> <a href="https://www.youtube.com/channel/UCLhu3qnGqYRSXgfi8rmI3gg/" target="_blank" rel="noopener noreferrer">Soothing Music Playlist</a></p>
              <p className="text-center text-green-700">
                Listen to calming music specifically curated to help reduce
                stress and anxiety.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center space-y-4">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/blog.png" 
                  width={64}
                  height={64}
                  alt="Blog"
                  className="rounded-full object-cover"
                />
              </a>
              <h3 className="text-xl font-semibold text-green-800">
                Blog
              </h3>
              <p className="text-green-600"><a href="https://psychcentral.com/blog" target="_blank" rel="noopener noreferrer">Inspiration and Tips</a></p>
              <p className="text-center text-green-700">
                Discover articles and insights to help you on your mental health
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
        <div className="container mx-auto px-4 md:px-6 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">
              Upcoming or Booked Sessions
            </h2>
            <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
              Here are your upcoming or booked therapy sessions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {appointments.length === 0 ? (
              <p>No upcoming sessions.</p>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white/70 backdrop-blur-lg border border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center space-y-4"
                >
                  <h3 className="text-xl font-semibold text-green-800">
                    {appointment.therapist}
                  </h3>
                  <p className="text-green-600">
                    {appointment.date} at {appointment.time}
                  </p>
                  <p className="text-center text-green-700">
                    Status: {appointment.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Book Appointment"
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Book Appointment</h2>
          {selectedTherapist && (
            <div className="mb-4">
              <h3 className="text-xl font-medium">{selectedTherapist.name}</h3>
              <p className="text-green-600">{selectedTherapist.specialization}</p>
            </div>
          )}
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={newAppointment.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                id="time"
                value={newAppointment.time}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="mr-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Book
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default PatientsPage;
