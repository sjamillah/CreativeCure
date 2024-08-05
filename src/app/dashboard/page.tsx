"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from '../firebase';
import useAuth from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const date = new Date();
const year = date.getFullYear();

interface Therapist {
  name: string;
  specialization: string;
  image: string;
  description: string;
  uid: string;
}

const Dashboard = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [therapyHistory, setTherapyHistory] = useState<any[]>([]);
  const user = useAuth(); // Use custom hook for authentication
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Fetch user role
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userRole = userDoc.data().role;
            setRole(userRole);

            if (userRole === "therapist") {
              // Fetch scheduled appointments for therapists
              const appointmentsQuery = query(collection(db, "appointments"), where("therapistId", "==", currentUser.uid));
              const querySnapshot = await getDocs(appointmentsQuery);
              const fetchedAppointments = querySnapshot.docs.map(doc => doc.data());
              setAppointments(fetchedAppointments);
            } else if (userRole === "patient") {
              // Fetch therapy history for patients
              const historyQuery = query(collection(db, "therapyHistory"), where("patientId", "==", currentUser.uid));
              const querySnapshot = await getDocs(historyQuery);
              const fetchedHistory = querySnapshot.docs.map(doc => doc.data());
              setTherapyHistory(fetchedHistory);
            }
          } else {
            console.error("No such document!");
          }
        } else {
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Optionally, you can show a loading state while checking authentication
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      {/* Header */}
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
          <Link href="/therapists" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Therapists
          </Link>
          <Link href="/patients" className="text-sm font-medium text-green-600 hover:underline" prefetch={false}>
            Patients
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

      {/* Main Content Section */}
      <main className="flex-1 relative z-20">
        {role === "therapist" && (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Therapist Dashboard</h1>
            <p>Welcome, Therapist! Here are your scheduled appointments:</p>
            <ul>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <li key={index} className="mb-2 p-4 bg-white rounded-lg shadow">
                    <p><strong>Date:</strong> {appointment.date}</p>
                    <p><strong>Time:</strong> {appointment.time}</p>
                    <p><strong>Patient:</strong> {appointment.patientName}</p>
                    {/* Add more details as needed */}
                  </li>
                ))
              ) : (
                <p>No appointments scheduled.</p>
              )}
            </ul>
          </div>
        )}
        {role === "patient" && (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
            <p>Welcome, Patient! Here’s your therapy history:</p>
            <ul>
              {therapyHistory.length > 0 ? (
                therapyHistory.map((history, index) => (
                  <li key={index} className="mb-2 p-4 bg-white rounded-lg shadow">
                    <p><strong>Date:</strong> {history.date}</p>
                    <p><strong>Therapist:</strong> {history.therapistName}</p>
                    <p><strong>Notes:</strong> {history.notes}</p>
                    {/* Add more details as needed */}
                  </li>
                ))
              ) : (
                <p>No therapy history found.</p>
              )}
            </ul>
          </div>
        )}
        {!role && (
          <p className="text-red-500">Unable to determine your role. Please contact support.</p>
        )}
      </main>

      <footer className="bg-green-100 p-6 md:py-12 w-full">
        <div className="container max-w-7xl mx-auto flex justify-center items-center">
          <div>
            <p className="text-sm text-gray-600">
              Creative Cure {year} © COMP 2800
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
