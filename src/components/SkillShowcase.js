import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const services = [
  {
    title: 'Web Development',
    description: 'Building responsive and modern web applications with MERN stack and Next.js.',
    icon: '💻',
  },
  {
    title: 'UI/UX Design',
    description: 'Creating user-friendly and visually appealing designs for your projects.',
    icon: '🎨',
  },
  {
    title: 'SEO Optimization',
    description: 'Optimizing your website to rank higher on search engines and drive more traffic.',
    icon: '🚀',
  },
  {
    title: 'Content Creation',
    description: 'Crafting engaging content that resonates with your audience.',
    icon: '✍️',
  },
  {
    title: 'E-commerce Solutions',
    description: 'Developing customized e-commerce platforms to boost your online sales.',
    icon: '🛒',
  },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const ServicesSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
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
    <section className="bg-black py-20 relative">
      {/* Stars background */}
      
      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.h2
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInVariants}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-12 text-white"
        >
          <span style={{ fontFamily: '"Style Script", cursive', fontSize: '60px' }}>My Services</span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial="hidden"
              animate={controls}
              variants={fadeInVariants}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-200 mb-2">{service.title}</h3>
              <p className="text-gray-300 mt-4">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          className="star absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
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

export default ServicesSection;
