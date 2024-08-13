import React, { useEffect,useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const photo = '/snap.jpg';

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const textGradientVariants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: '100% 50%',
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

const PhotoSection = () => {
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
    <section className="bg-black py-20 relative overflow-hidden" id="about">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInVariants}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center"
        >
          <img
            src={photo}
            alt="Your Name"
            width={400}
            height={400}
            className="rounded-full object-cover shadow-2xl"
            style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)' }}
          />
        </motion.div>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInVariants}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full md:w-1/2 text-center md:text-left px-6"
        >
          <h2
            className="text-3xl md:text-5xl font-bold mb-4 text-gray-800"
            style={{
              fontFamily: '"Style Script", cursive',
              fontSize: '60px',
              color: 'white',
            }}
          >
            About Me
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            I am a passionate Full Stack Developer with expertise in the MERN
            stack and Next.js. I enjoy creating dynamic and responsive web
            applications that provide great user experiences.
          </p>
          <motion.h3
            className="text-xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #ff8a00, #e52e71, #9a00ff)',
              backgroundSize: '200%',
            }}
            variants={textGradientVariants}
            initial="initial"
            animate="animate"
          >
            Scroll to Explore
          </motion.h3>
        </motion.div>
      </div>
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          className="particle absolute rounded-full"
          style={{
            left: `${Math.random() * 80}%`,
            top: `${Math.random() * 80}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: `hsl(${Math.random() * 360}, 50%, 50%)`,
            animation: `float ${Math.random() * 10 + 5}s linear infinite, pulse ${Math.random() * 2 + 1}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </section>
  );
};

export default PhotoSection;
