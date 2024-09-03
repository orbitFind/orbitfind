import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { World, GlobeConfig } from '@/components/ui/Globe'; // Adjust the path as needed

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
  const navigate = useNavigate(); // Initialize useNavigate

  const navigateToEvents = () => {
    navigate('/events'); // Navigate to the /events route
  };

  return (
    <div className="waitlist-container">
      <div className="globe-container">
        <World globeConfig={globeConfig} data={globeData} />
      </div>
      <div className="content">
        <h1 className="title">Get Started - Find exciting events in your orbit!</h1>
        <p className="description">
          Level up your event discovery experience, earn badges, and create your own events for your community!
        </p>
        <button
          onClick={navigateToEvents} // Change the onClick handler to navigate to /events
          className="cta-button"
        >
          Get Started
        </button>
      </div>

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
            overflow: hidden; /* Prevent overflow caused by modal */
          }

          .globe-container {
            width: 600px; /* Reduced width */
            height: 450px; /* Reduced height */
            position: relative;
            margin-top: 80px; /* Adjust this to move the globe down */
            overflow: hidden; /* Ensure content does not overflow */
            transition: opacity 0.3s ease, transform 0.3s ease;
          }

          .content {
            max-width: 600px;
            margin-top: 20px; /* Adjust margin to avoid overlap with navbar */
          }

          .title {
            font-size: 1.5rem; /* Reduced font size */
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
            background-color: #E5E7EB; /* Changed background color to off-white */
            color: #1B1A55; /* Changed text color to dark to contrast with the new background */
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s, box-shadow 0.3s;
            animation: fadeInUp 1s ease-out 1s; /* Animation for button */
          }

          .cta-button:hover {
            background-color: #d1d5db; /* Slightly darker shade of off-white for hover effect */
            box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.6);
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
