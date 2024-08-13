

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const pricingPlans = [
  {
    name: 'Starter Pack',
    price: 'Rs 10k',
    description: '/month',
    features: [
      'Only Frontend Development',
      'Hosting not included',
      'Maintenance not included',
      'Testing Included'
    ],
    buttonText: 'Get Started Now',
    buttonLink: '/projectform',
    gradient: 'from-purple-400 via-pink-500 to-red-500',
  },
  {
    name: 'Enterprise Pack',
    price: 'Rs 25k',
    description: '/month',
    features: [
      'Frontend & Backend Development',
      'Basic Web Hosting',
      'Free Domain not included',
      'Limited Maintenance with extra charges',
    ],
    buttonText: 'Get Started Now',
    buttonLink: '/projectform',
    gradient: 'from-blue-400 via-teal-500 to-green-500',
  },
  {
    name: 'Premium Pack',
    price: 'Rs 50k',
    description: '/month',
    features: [
      'Fullstack Development',
      'Premium Web Hosting',
      'Free Domain',
      'Free Maintenance for 1st year',
    ],
    buttonText: 'Get Started Now',
    buttonLink: '/projectform',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { 
    y: -10, 
    boxShadow: '0 20px 30px -10px rgba(255,255,255,0.3)',
    transition: { duration: 0.3 } 
  },
};

const PricingPage = () => {
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
    <section className="bg-black py-20" id='pricing'>
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-5xl font-bold text-white mb-12" style={{ fontFamily: '"Style Script", cursive' }}>Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial="initial"
              animate="animate"
              whileHover="hover"
              variants={cardVariants}
            >
              {/* Glassmorphism Card */}
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${plan.gradient}`}>
                <div className="absolute inset-0 bg-white opacity-20 backdrop-filter backdrop-blur-lg"></div>
                <div className="relative z-10 p-8 text-white">
                  <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
                  <div className="text-5xl font-extrabold mb-2">{plan.price}</div>
                  <div className="text-xl mb-6 opacity-80">{plan.description}</div>
                  <ul className="mb-8 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="mb-3 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.buttonLink}
                    className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-opacity-80 hover:scale-105 transform"
                  >
                    {plan.buttonText}
                  </a>
                </div>
              </div>
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

export default PricingPage;
