
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { Typewriter } from 'react-simple-typewriter';
import { FaStar } from 'react-icons/fa';
import './Hero.css';
const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 150); // Adjust typing speed here

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="inline-block min-w-[200px] text-left">
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  );
};

const SplashScreen = ({ onEnd }) => {
  useEffect(() => {
    const timer = setTimeout(onEnd, 3000); // Change the timeout to 3000 milliseconds (3 seconds)
    return () => clearTimeout(timer);
  }, [onEnd]);
  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 5, duration: 1 }} // fade out after 5 seconds
    >
      <div className="text-center text-white" style={{ fontFamily: '"Style Script", cursive' }}>
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Mohammad Faiz
        </motion.h1>
        <div className="text-2xl md:text-4xl mt-4 h-12" style={{marginLeft:'20%'}}>
          <TypewriterText text="Weeb Developer" />
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative" id='hero'>
         {[...Array(200)].map((_, i) => (
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
      <AnimatePresence>
        {showSplash && <SplashScreen onEnd={() => setShowSplash(false)} />}
      </AnimatePresence>
      <section className={`bg-black text-white min-h-screen flex items-center justify-center transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`} style={{backgroundColor:'black'}}>
        
        {/* Navigation Icons */}
    
        {/* Main Content */}
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{fontFamily:'"Style Script", cursive'}}>Welcome to My Portfolio</h1>
          <p className="text-lg md:text-2xl mb-8">
            I am a <span className="text-blue-500">
              <Typewriter
                words={['Web Developer', 'Gamer', 'Student','Coder']}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span><span className='hide'> specializing in MERN stack and Next.js. </span>
          </p>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
          <ScrollLink to="projects" smooth={true} duration={500}>
             View My Work
          </ScrollLink>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hero;
