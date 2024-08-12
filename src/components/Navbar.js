import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { motion } from 'framer-motion';
import { FaHome, FaUser, FaMoneyBillWave, FaProjectDiagram, FaBars, FaTimes, FaGraduationCap, FaFileAlt } from 'react-icons/fa';
import './Navbar.css';

const resume = '/faizreal.pdf';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="nav">
     {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="particle absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: `hsl(${Math.random() * 360}, 50%, 50%)`,
            animation: `float ${Math.random() * 10 + 5}s linear infinite, pulse ${Math.random() * 2 + 1}s ease-in-out infinite alternate`
          }}
        />
      ))}
      <div className="logo" id="faizCreation">
        Faiz's Creations
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={30} />}
      </div>
      <ul className={`menu ${menuOpen ? 'open' : ''}`}>
        <motion.li whileHover={{ scale: 1.2 }}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <FaHome /> Home
          </Link>
        </motion.li>
        <motion.li whileHover={{ scale: 1.2 }}>
          <ScrollLink to="about" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>
            <FaUser /> About
          </ScrollLink>
        </motion.li>
        <motion.li whileHover={{ scale: 1.2 }}>
          <ScrollLink to="projects" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>
            <FaProjectDiagram /> Projects
          </ScrollLink>
        </motion.li>
        <motion.li whileHover={{ scale: 1.2 }}>

          <ScrollLink to="skills" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>
            <FaGraduationCap /> Skills
          </ScrollLink>
        </motion.li>
        <motion.li whileHover={{ scale: 1.2 }}>
          <Link to="/pricing" onClick={() => setMenuOpen(false)}>
            <FaMoneyBillWave /> Pricing
          </Link>
        </motion.li>
        <motion.li whileHover={{ scale: 1.2 }}>
          <a href={resume} target='_blank' rel="noopener noreferrer" download="Faiz.pdf">
            <FaFileAlt /> Resume
          </a>
        </motion.li>
      </ul>
    </nav>
  );
};

export default Navbar;
