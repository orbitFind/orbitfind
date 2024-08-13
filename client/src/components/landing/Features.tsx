import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { FaSearch, FaCalendarCheck, FaUser, FaBrain, FaGamepad, FaClipboardList } from 'react-icons/fa';

const Features: React.FC = () => {
  const features = [
    {
      title: 'Event Listings',
      description: 'Browse events with advanced search and filter options.',
      icon: <FaSearch />,
    },
    {
      title: 'Event Details & RSVP',
      description: 'View event details and RSVP with ease.',
      icon: <FaCalendarCheck />,
    },
    {
      title: 'User Profiles',
      description: 'Access basic profiles with event history.',
      icon: <FaUser />,
    },
    {
      title: 'AI Recommendations',
      description: 'Get personalized event recommendations using AI.',
      icon: <FaBrain />,
    },
    {
      title: 'Gamification',
      description: 'Earn points, badges, and achievements. Compete on leaderboards.',
      icon: <FaGamepad />,
    },
    {
      title: 'Organizer Tools',
      description: 'Create and manage events with a dedicated dashboard.',
      icon: <FaClipboardList />,
    },
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div style={styles.container} id='features'>
      <motion.h1
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
        transition={{ duration: 0.6 }}
        style={styles.heading}
      >
        Features
      </motion.h1>
      <div style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <Tilt
            key={index}
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            style={styles.tilt}
            glareEnable={true}
            glareMaxOpacity={0.2}
            scale={1.1}
            transitionSpeed={400}
          >
            <motion.div
              style={styles.featureCard}
              whileHover={{
                borderColor: '#ffffff',
                background: 'linear-gradient(145deg, #1d072e, #2a2a8e)',
                boxShadow: '0 8px 16px rgba(255, 255, 255, 0.2)',
              }}
              transition={{ duration: 0.4 }}
            >
              <div style={styles.icon}>{feature.icon}</div>
              <h2 style={styles.featureTitle}>{feature.title}</h2>
              <p style={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#070F2B',
    color: '#E5E7EB',
    padding: '50px 20px',
    textAlign: 'center' as 'center',
  },
  heading: {
    fontWeight: '900' as '900',
    color: '#FFFFFF',
    fontSize: '70px',
    marginBottom: '40px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  tilt: {
    transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
    position: 'relative' as 'relative',
  },
  featureCard: {
    backgroundColor: '#1d072e',
    borderRadius: '15px',
    padding: '30px 20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    border: '2px solid transparent',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative' as 'relative',
    height: '300px',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '20px',
    color: '#E5E7EB',
  },
  featureTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#E5E7EB',
  },
  featureDescription: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#E5E7EB',
    textAlign: 'center' as 'center',
  },
};

export default Features;
