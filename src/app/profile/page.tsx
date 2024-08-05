// pages/profile.tsx
"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProfileData {
  name?: string;
  email?: string;
  address?: string;
  image?: string;
}

const Profile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfileData(user.uid);
      setProfileData((prev) => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const fetchProfileData = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfileData(docSnap.data() as ProfileData);
    } else {
      console.log('No such document!');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;
    const storageRef = ref(storage, `profileImages/${user.uid}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    setProfileData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, profileData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        router.push('/dashboard');
      }, 3000); // Redirect after 3 seconds
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={profileData.name || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={profileData.address || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-gray-700">Image</label>
              <input
                id="image"
                name="image"
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">Name: {profileData.name}</p>
            <p className="text-gray-700">Email: {profileData.email}</p>
            <p className="text-gray-700">Address: {profileData.address}</p>
            {profileData.image && (
              <div>
                <Image src={profileData.image} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
              </div>
            )}
            <button onClick={() => setIsEditing(true)} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
