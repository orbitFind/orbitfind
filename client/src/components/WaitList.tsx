import React, { useState } from 'react';
import { World, GlobeConfig } from './ui/Globe'; // Adjust the path as needed
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase'; // Adjust the path to your firebase configuration
import { useToast } from '@/components/ui/use-toast'; // Import useToast from Shadcn

const globeConfig: GlobeConfig = {
  pointSize: 2,
  globeColor: '#1d072e',
  showAtmosphere: true,
  atmosphereColor: '#ffffff',
  atmosphereAltitude: 0.1,
  emissive: '#000000',
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: 'rgba(255,255,255,0.7)',
  ambientLight: '#ffffff',
  directionalLeftLight: '#ffffff',
  directionalTopLight: '#ffffff',
  pointLight: '#ffffff',
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 0, lng: 0 },
  autoRotate: true,
  autoRotateSpeed: 1,
};

const globeData = [
  {
    order: 1,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 40.7128,
    endLng: -74.0060,
    arcAlt: 0.1,
    color: '#FF0000',
  },
  // Add more data as needed
];

const WaitList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { toast } = useToast(); // Initialize toast from Shadcn

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Check if email already exists
      const q = query(collection(firestore, 'waitlist'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast({ title: 'Already Signed Up!', description: 'You have already signed up for the waitlist.' });
        closeModal(); // Close modal if already signed up
        return;
      }

      // Add new document if email does not exist
      const docRef = await addDoc(collection(firestore, 'waitlist'), {
        email: email,
        name: name
      });

      console.log('Document written with ID: ', docRef.id);
      toast({ title: 'Success!', description: 'Thank you! You have been added to the waitlist.' }); // Use Shadcn toast
      setEmail('');
      setName('');
      closeModal();
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({ title: 'Error!', description: 'There was an error. Please try again later.', variant: "destructive" }); // Use Shadcn toast
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent body scroll when modal is open
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore body scroll when modal is closed
  };

  return (
    <div className="waitlist-container">
      <div className="globe-container">
        <World globeConfig={globeConfig} data={globeData} />
      </div>
      <div className="content">
        <h1 className="title">OrbitFind - Discover events in your orbit!</h1>
        <p className="description">
          Be the first to know when our service is available. Enter your details to join our waitlist.
        </p>
        <button
          onClick={openModal}
          className="cta-button"
        >
         Join WaitList
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div id="waitlist" className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={closeModal}
              className="modal-close-button"
            >
              &times;
            </button>
            <h2 className="modal-title">Sign Up for the Waitlist</h2>
            <form onSubmit={handleSubmit} id="waitlist-form" className="waitlist-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <button type="submit" className="submit-button">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div id="toast-container" className="toast-container"></div>

      <style>
        {`
          .waitlist-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #070F2B;
            color: #E5E7EB;
            padding: 20px;
            text-align: center;
            margin-top: 80px; /* Add margin-top to push content down */
            overflow: hidden; /* Prevent overflow caused by modal */
          }

          .globe-container {
            width: 800px; /* Fixed width */
            height: 600px; /* Fixed height */
            position: relative;
            margin-bottom: 20px;
            overflow: hidden; /* Ensure content does not overflow */
            transition: opacity 0.3s ease, transform 0.3s ease;
          }

          .content {
            max-width: 600px;
          }

          .title {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 10px;
            animation: fadeInUp 1s ease-out; /* Animation for title */
          }

          .description {
            font-size: 1rem;
            margin-bottom: 20px;
            animation: fadeInUp 1s ease-out 0.5s; /* Animation for description */
          }

          .cta-button {
            background-color: #1B1A55;
            color: #E5E7EB;
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s, box-shadow 0.3s;
            animation: fadeInUp 1s ease-out 1s; /* Animation for button */
          }

          .cta-button:hover {
            background-color: #2a2a8e;
            box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.6);
          }

          /* Modal Styles */
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000; /* Ensure modal is above other content */
            animation: fadeIn 0.3s ease-in;
          }

          .modal-content {
            background: #1d072e;
            padding: 20px;
            border-radius: 15px;
            width: 100%;
            max-width: 500px;
            position: relative;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            border: 2px solid #ffffff;
            animation: scaleUp 0.3s ease-in-out;
          }

          .modal-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #E5E7EB;
            margin-bottom: 15px;
            text-align: center;
          }

          .modal-close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #E5E7EB;
          }

          .waitlist-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .form-group {
            margin-bottom: 20px;
            animation: fadeInUp 1s ease-out 0.5s; /* Animation for form group */
          }

          .form-label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #E5E7EB;
          }

          .form-input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #ddd;
            box-sizing: border-box;
            font-size: 1rem;
            transition: border-color 0.3s, box-shadow 0.3s;
            background-color: #1d072e;
            color: #E5E7EB;
          }

          .form-input:focus {
            border-color: #1B1A55;
            outline: none;
            box-shadow: 0 0 5px rgba(27, 26, 85, 0.5);
          }

          .submit-button {
            background-color: #1B1A55;
            color: #E5E7EB;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s, box-shadow 0.3s;
          }

          .submit-button:hover {
            background-color: #2a2a8e;
            box-shadow: 0 0 10px rgba(27, 26, 85, 0.5);
          }

          @keyframes scaleUp {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default WaitList;
