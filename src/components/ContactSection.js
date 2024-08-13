'use client';

import React from 'react';
import { FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import Link from 'next/link';

// import '../not.css'
const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};
// console.log(process.env.PORT_LIVE);

const ContactSection = () => {

  return (
    <section className="relative  py-20 text-white"  style={{backgroundColor:'black'}}>
       {[...Array(80)].map((_, i) => (
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
      <div className="relative container mx-auto px-6 text-center">
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          transition={{ duration: 1 }}
          className="text-4xl font-extrabold mb-8"
        >
          <span style={{fontFamily:'"Kaushan Script", cursive'}}>Let &apos; s Talk About the Next Big Thing</span>
        </motion.h2>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg mb-12 max-w-2xl mx-auto"
        >
          I&apos;m always excited to work on new projects. Feel free to reach out to me on any of these platforms!
          
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          transition={{ duration: 1, delay: 1 }}
          className="flex justify-center space-x-8 mb-12"
        >
         <Link
            to="https://www.linkedin.com/in/your-linkedin-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 transition duration-300 transform hover:scale-110"
          >
            <FaLinkedin size={40} />
         </Link>
         <Link
            to="hhttps://www.instagram.com/mohammadfaiz_27/?igsh=MWE0ejdib2IzaDg5Zw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-600 transition duration-300 transform hover:scale-110"
          >
            <FaInstagram size={40} />
         </Link>
         <Link
            to="https://github.com/mohammadfaiz2722"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-gray-100 transition duration-300 transform hover:scale-110"
          >
            <FaGithub size={40} />
         </Link>
         <Link
            to="mailto:myyard789@gmail.com"
            className="text-red-400 hover:text-red-600 transition duration-300 transform hover:scale-110"
          >
            <FaEnvelope size={40} />
         </Link>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8"
        >
         <Link
            to="/projectform"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Discuss Project
         </Link>
         <Link
            to="https://api.whatsapp.com/send?phone=6392569054&text=Hi%20Faiz%20I%20need%20more%20info%20about%20your%20project%20pricing "
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Write a Message
         </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
