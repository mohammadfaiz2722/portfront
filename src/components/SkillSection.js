// 'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaReact, FaNodeJs, FaDatabase, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
import { SiNextdotjs } from 'react-icons/si';
import './SkillSection.css'; // Assuming you have a CSS file for the animation styles

const skills = [
  { name: 'React', icon: FaReact },
  { name: 'Node.js', icon: FaNodeJs },
  { name: 'MongoDB', icon: FaDatabase },
  { name: 'HTML5', icon: FaHtml5 },
  { name: 'CSS3', icon: FaCss3Alt },
  { name: 'JavaScript', icon: FaJs },
  { name: 'Next.js', icon: SiNextdotjs },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hover: {
    scale: 1.1,
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)', // Adjusted shadow color and spread
    transition: {
      duration: 0.3,
      yoyo: 5 // Repeat the animation 5 times
    }
  },
  tap: { scale: 0.95 }
};

const SkillsSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  const [particleCount, setParticleCount] = useState(80);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Change 768 to your breakpoint for small screens
        setParticleCount(20);
      } else {
        setParticleCount(80);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <section className="bg-black py-20 relative" id='skills'>
      <div className="container mx-auto px-6 md:px-12 text-center">
        
        <motion.h2
        
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInVariants}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-12 text-white"
        >
          <span style={{ fontFamily: '"Style Script", cursive', fontSize: '60px' }}>My Skills</span>
        </motion.h2>
        <div className="flex flex-wrap justify-center relative z-10">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial="hidden"
              animate={controls}
              variants={fadeInVariants}
              transition={{ duration: 1, delay: index * 0.1 }} // Adjust delay for smoother appearance
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 p-4"
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }} // Improved shadow and color
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <skill.icon className="text-blue-400 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-200">{skill.name}</h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      {[...Array(particleCount)].map((_, i) => (
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
    </section>
  );
};

export default SkillsSection;
