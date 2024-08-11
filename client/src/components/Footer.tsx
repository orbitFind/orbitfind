import React from 'react';
import { FaLinkedin, FaTiktok } from 'react-icons/fa';
import styles from './Footer.module.css'; // Import the CSS module for styling

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Join Waitlist</a>
          <a href="#about" className={styles.footerLink}>About Us</a>
          <a href="#features" className={styles.footerLink}>Features</a>
        </div>
        <div className={styles.footerSocial}>
          <a href="https://www.linkedin.com/company/orbitfind" target="_blank" rel="noopener noreferrer" className={styles.footerIcon} aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://www.tiktok.com/@orbitfind" target="_blank" rel="noopener noreferrer" className={styles.footerIcon} aria-label="Instagram">
            <FaTiktok />
          </a>
        </div>
        <div className={styles.footerCopyright}>
          &copy; 2024 OrbitFind. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
