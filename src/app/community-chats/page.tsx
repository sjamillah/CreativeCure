"use client";
import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, onSnapshot, doc, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

import Link from 'next/link'; 

interface ChatMessage {
  id?: string;
  text: string;
  sender: string; // "therapist" or "patient"
  timestamp: number;
}

const CommunityChatsPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const messageRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'community_chats'), (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data() as ChatMessage).timestamp?.toMillis() ?? 0, // Handle timestamps
      })) as ChatMessage[];
      setMessages(messagesData);
    });

    return () => unsubscribe(); 
  }, []);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      try {
        await addDoc(collection(db, 'community_chats'), {
          text: newMessage,
          sender: session?.user?.role === 'therapist' ? 'therapist' : 'patient', 
          timestamp: Date.now(), // Add timestamp to the message
        });
        setNewMessage('');
        if (messageRef.current) {
          messageRef.current.focus(); 
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
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

      <main className="flex-1 p-4">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container mx-auto px-4 md:px-6 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-green-800 sm:text-4xl md:text-5xl">
                Community Chats
              </h2>
              <p className="max-w-2xl mx-auto text-green-700 md:text-xl">
                Connect with other members of the community to share
                experiences, ask questions, and offer support.
              </p>
            </div>

            {/* Chat Area */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="max-h-96 overflow-y-auto"> {/* Scrollable chat area */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'therapist' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`bg-green-200 rounded-lg px-4 py-2 m-2 max-w-md ${
                        message.sender === 'therapist' ? 'ml-4' : 'mr-4'
                      }`}
                    >
                      <p className="text-green-800">
                        {message.text}
                        <span className="text-sm text-gray-500">
                          {` - ${message.sender}`}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="flex mt-4">
                <input
                  type="text"
                  className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  ref={messageRef}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg ml-2 hover:bg-green-700"
                >
                  Send
                </button>
              </form>
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

export default CommunityChatsPage;

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
    description: "Sarah is a therapist with 5 years of experience who specializes in helping people with autistic disorders and analyzes the behavior of these people to help them through therapy."
  },
  {
    name: "Audrey Hauston",
    specialization: "Art and Psychological Therapist",
    image: "/therapist5.jpg",
    description: "Audrey is a skilled art therapist who helps youth express their emotions and work through trauma through creative expression."
  }
];