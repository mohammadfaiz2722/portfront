
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';  
const testimonials = [
  {
    name: 'John Doe',
    position: 'CEO, Tech Company',
    feedback: 'A highly skilled and dedicated developer. Delivered our project on time with exceptional quality.',
    photo: '/snap.jpg',
  },
  {
    name: 'Jane Smith',
    position: 'CTO, Startup Inc.',
    feedback: 'An excellent collaborator and problem-solver. Always goes above and beyond to ensure success.',
    photo: '/snap.jpg',
  },
  {
    name: 'Mike Johnson',
    position: 'Project Manager, Web Solutions',
    feedback: 'A true professional with a keen eye for detail. Great to work with and highly recommended.',
    photo: '/snap.jpg',
  },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const TestimonialsSection = () => {
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
      {[...Array(200)].map((_, i) => (
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
          <span style={{ fontFamily: '"Style Script", cursive', fontSize:'60px'}}>Testimonials</span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial="hidden"
              animate={controls}
              variants={fadeInVariants}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800"
            >
              <div className="flex items-center justify-center mb-4">
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover shadow-lg"
                  style={{ boxShadow: '0 20px 50px rgba(255, 255, 255, 0.3)' }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-200 mb-2">{testimonial.name}</h3>
              <p className="text-sm text-gray-400">{testimonial.position}</p>
              <p className="text-gray-300 mt-4">&quot;{testimonial.feedback}&quot;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;