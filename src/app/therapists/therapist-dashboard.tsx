"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

interface Patient {
  uid: string;
  name: string;
  email: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  therapistId: string;
  status: 'pending' | 'confirmed' | 'completed';
}

const TherapistDashboard = () => {
  const [user] = useAuthState(auth);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    if (user) {
      const fetchPatients = async () => {
        try {
          const patientsCollection = collection(db, 'patients');
          const q = query(patientsCollection, where('appointments.therapistId', '==', user.uid));
          const patientSnapshot = await getDocs(q);
          const patientList = patientSnapshot.docs.map((doc) => ({
            uid: doc.id,
            ...doc.data(),
          })) as Patient[];
          setPatients(patientList);
        } catch (error) {
          console.error("Error fetching patients:", error);
        }
      };

      const fetchAppointments = async () => {
        try {
          const appointmentCollection = collection(db, 'appointments');
          const q = query(appointmentCollection, where('therapistId', '==', user.uid));
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

      fetchPatients();
      fetchAppointments();
    }
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Therapist Dashboard</h1>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Patients</h2>
        <ul>
          {patients.map((patient) => (
            <li key={patient.uid}>
              {patient.name} ({patient.email})
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              {appointment.date} at {appointment.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TherapistDashboard;
