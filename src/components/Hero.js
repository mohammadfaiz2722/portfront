import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { Typewriter } from 'react-simple-typewriter';
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
  const [particleCount, setParticleCount] = useState(80);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Change 768 to your breakpoint for small screens
        setParticleCount(40);
      } else {
        setParticleCount(80);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative" id='hero'>
      
      <AnimatePresence>
        {showSplash && <SplashScreen onEnd={() => setShowSplash(false)} />}
      </AnimatePresence>
      <section className={`bg-black text-white min-h-screen flex items-center justify-center transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`} style={{backgroundColor:'black'}}>
        {/* Navigation Icons */}
    
        {/* Main Content */}
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 " id='type2' style={{fontFamily:'"Style Script", cursive'}}>Welcome to My Portfolio</h1>
          <p className="text-lg md:text-2xl mb-8" id="type">
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
          
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 ease-in-out">
            <ScrollLink to="projects" smooth={true} duration={500} className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-full group-hover:bg-opacity-0">
              View My Work
            </ScrollLink>
          </button>
        </div>
      </section>
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
    </div>
  );
};

export default Hero;
