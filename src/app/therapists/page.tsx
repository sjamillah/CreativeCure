"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Modal from 'react-modal';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

interface Therapist {
  name: string;
  specialization: string;
  image: string;
  description: string;
  uid: string;
  availability: {
    [day: string]: string[];
  };
  role: string;
}

interface Appointment {
  id?: string;
  date: string;
  time: string;
  therapistId: string;
  status: 'pending' | 'confirmed' | 'completed';
  patientId: string;
}

const TherapistsPage = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    date: "",
    time: "",
    therapistId: "",
    status: 'pending',
    patientId: user?.uid || '',
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Modal.setAppElement('body'); // Setting the app element to body

    const fetchTherapists = async () => {
      try {
        const therapistsCollection = collection(db, 'users'); // Assuming users collection contains both patients and therapists
        const q = query(therapistsCollection, where('role', '==', 'therapist'));
        const querySnapshot = await getDocs(q);
        const therapistData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as Therapist[];
        console.log('Fetched Therapists:', therapistData); // Debugging line
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

  const openModal = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setNewAppointment({
      ...newAppointment,
      therapistId: therapist.uid,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTherapist(null);
    setNewAppointment({
      date: "",
      time: "",
      therapistId: "",
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
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <Link href="/" className="flex items-center space-x-2">
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
          <Link href="/dashboard" className="text-sm font-medium text-green-600 hover:underline">
            Home
          </Link>
          <Link href="/patients" className="text-sm font-medium text-green-600 hover:underline">
            Patients
          </Link>
          <Link href="/community" className="text-sm font-medium text-green-600 hover:underline">
            Community
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="flex-grow pt-16 px-4 lg:px-6 py-6">
        <h1 className="text-2xl font-bold mb-4">Our Therapists</h1>
        {isLoading ? (
          <p>Loading therapists...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {therapists.map((therapist) => (
              <div
                key={therapist.uid}
                className="bg-white shadow rounded-lg p-4 cursor-pointer"
                onClick={() => openModal(therapist)}
              >
                <img src={therapist.image} alt={therapist.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h2 className="text-xl font-semibold">{therapist.name}</h2>
                <p className="text-gray-600">{therapist.specialization}</p>
                <button
                  onClick={() => openModal(therapist)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Book Appointment"
        className="modal"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        <h2 className="text-xl font-semibold mb-4">Book Appointment with {selectedTherapist?.name}</h2>
        <form onSubmit={handleBooking}>
          <label className="block mb-2">
            Date:
            <input
              type="date"
              id="date"
              value={newAppointment.date}
              onChange={handleInputChange}
              className="block w-full mt-1 border-gray-300 rounded"
              required
            />
          </label>
          <label className="block mb-2">
            Time:
            <input
              type="time"
              id="time"
              value={newAppointment.time}
              onChange={handleInputChange}
              className="block w-full mt-1 border-gray-300 rounded"
              required
            />
          </label>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm Booking
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default TherapistsPage;
