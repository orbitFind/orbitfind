import { motion } from 'framer-motion';
import { teamMembers } from '../constants/index'; // Import team members data
import styles from './Team.module.css'; // Import the CSS module for styling
import { styles as globalStyles } from '../styles'; // Import global styles

const Team = () => {
  return (
    <div className={`${globalStyles.padding} ${styles.teamContainer}`} id='team'>
      {/* Meet the Team Section */}
      <motion.div 
        className={styles.meetTheTeam}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className={globalStyles.sectionHeadText}>Meet the Team</h2>
        <div className={styles.teamContainer}>
          {teamMembers.map(member => (
            <div key={member.name} className={styles.teamCard}>
              <div className={styles.teamImage} style={{ backgroundImage: `url(${member.img})` }}>
                <div className={styles.teamOverlay}>
                  <p className={styles.teamDesc}>{member.desc}</p>
                  <a href={member.linkedin} className={styles.linkedinLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Team;
