
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { Typewriter } from 'react-simple-typewriter';
// import { FaStar } from 'react-icons/fa';
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
    }, 150);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="inline-block typewriter-text">
      {displayText}
      <span className="cursor">|</span>
    </span>
  );
};

const SplashScreen = ({ onEnd }) => {
  useEffect(() => {
    const timer = setTimeout(onEnd, 3000);
    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 5, duration: 1 }}
    >
      <div className="splash-text">
        <motion.h1
          className="splash-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Mohammad Faiz
        </motion.h1>
        <div className="typewriter-container">
          <TypewriterText text="Weeb Developer" />
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="relative hero-section" id='hero'>
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
         {/* {[...Array(100)].map((_, i) => (
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
      ))} */}
      <AnimatePresence>
        {showSplash && <SplashScreen onEnd={() => setShowSplash(false)} />}
      </AnimatePresence>
      <section className={`main-section ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <div className="container">
          <h1 className="hero-title" style={{fontFamily:'"Style Script", cursive'}}>Welcome to My Portfolio</h1>
          <p className="hero-subtitle">
            I am a <span style={{color:"blue"}}>
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
          <button className="cta-button">
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
