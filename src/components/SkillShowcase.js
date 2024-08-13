import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const workProcess = [
  {
    step: 1,
    title: 'Discovery',
    description: 'Understanding your needs and project requirements in depth.',
    icon: '🔍', // You can replace this with an actual icon component or image
  },
  {
    step: 2,
    title: 'Planning',
    description: 'Crafting a detailed roadmap and timeline for your project.',
    icon: '📝',
  },
  {
    step: 3,
    title: 'Development',
    description: 'Bringing your vision to life with clean, efficient code.',
    icon: '💻',
  },
  {
    step: 4,
    title: 'Testing',
    description: 'Rigorous quality assurance to ensure a flawless product.',
    icon: '🧪',
  },
  {
    step: 5,
    title: 'Delivery',
    description: 'Launching your project and providing ongoing support.',
    icon: '🚀',
  },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const WorkProcessSection = () => {
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

  return (
    <section className="bg-black py-20 relative">
      {/* Stars background */}
      {[...Array(80)].map((_, i) => (
        <div
          key={i}
          className="star absolute rounded-full"
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
      
      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.h2
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInVariants}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-12 text-white"
        >
          <span style={{ fontFamily: '"Style Script", cursive', fontSize:'60px'}}>My Work Process</span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {workProcess.map((step, index) => (
            <motion.div
              key={step.title}
              initial="hidden"
              animate={controls}
              variants={fadeInVariants}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-gray-200 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">Step {step.step}</p>
              <p className="text-gray-300 mt-4">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkProcessSection;