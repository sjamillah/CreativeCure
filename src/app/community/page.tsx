"use client";
import { useState, useEffect, useRef, FormEvent } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, DocumentData, Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Link from 'next/link'; 
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ChatMessage {
  id?: string;
  text: string;
  sender: string; // "therapist" or "patient"
  timestamp: number;
  subject?: string; // Optional field for conversation subject or tag
}

const CommunityChatsPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const messageRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'community_chats'), (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          text: data.text,
          sender: data.sender,
          timestamp: typeof data.timestamp === 'number' 
            ? data.timestamp 
            : (data.timestamp as Timestamp).toMillis(), // Handle timestamp conversion
          subject: data.subject,
        } as ChatMessage;
      });
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
          sender: user?.uid === 'therapist_id' ? 'therapist' : 'patient', // Adjust the condition according to your user data
          timestamp: Date.now(), // Add timestamp to the message
          subject: 'General', // Default or user-defined subject
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
                      } cursor-pointer`}
                      onClick={() => {
                        // Handle click event, e.g., open reply modal
                        console.log(`Reply to message ${message.id}`);
                      }}
                    >
                      <p className="text-green-800">
                        {message.text}
                        <span className="text-sm text-gray-500">
                          {` - ${message.sender}`}
                        </span>
                        {message.subject && (
                          <span className="text-sm text-gray-500 block mt-1">
                            {`Subject: ${message.subject}`}
                          </span>
                        )}
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
