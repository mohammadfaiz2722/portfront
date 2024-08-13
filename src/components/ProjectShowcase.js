
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

const projects = [
  {
    name: 'CodeWardrobe - Code with Style, Dress with Pride.',
    description: 'An e-Commerce website',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: 'https://example.com/project-one',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/CodeWardrobe',
    image: '/CodeWardrobe.jpg',
    style:{objectFit:'cover'},
  },
  {
    name: 'Real Estate Portfolio',
    description: 'A portfolio for a Real-Estate Company',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://grandblue.omrox.in/#home',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722',
    image: '/gb.png',
    style:{},
  },
  {
    name: 'Portfolio',
    description: 'Explore the cosmos of my journey with a space-themed portfolio, where innovation meets the infinite possibilities of the digital universe',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://github.com/mohammadfaiz2722/portfolio_new',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/portfolio_new',
    image: '/port.png',
    style:{},
  },
  {
    name: 'iNoteBook',
    description: 'A Web App for keeping your Secret notes Secret',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: 'https://github.com/mohammadfaiz2722/iNoteBook',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/iNoteBook',
    image: '/inote.png',
    style:{},
  },
  {
    name: 'FaizBook',
    description: 'A Simple Social Media app where everyone can share their thoughts anonymously',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: 'https://github.com/mohammadfaiz2722/FaizBook',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/FaizBook',
    image: '/fbapp.png',
    style:{},
  },
  {
    name: 'Cosmic Vault',
    description: 'Cosmic Vault: Your gateway to a universe of memories, where digital treasures are securely stored and beautifully showcased.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: 'https://cosmicvaultfrontend.onrender.com/',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/CosmicVaultFrontEnd',
    image: '/cv.png',
    style:{},
  },
  // Add more projects as needed
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const ProjectsShowcase = () => {
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

    <section className="bg-black py-20 relative"  id='projects'>
      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.h2
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeInVariants}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-12 text-white"
        >
          <span style={{ fontFamily: '"Style Script", cursive', fontSize: '60px' }}>My Projects</span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial="hidden"
              animate={controls}
              variants={fadeInVariants}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="relative bg-gray-900 rounded-lg shadow-2xl hover:shadow-dark transition-shadow duration-300 overflow-hidden"

            >
              <img src={project.image} alt={project.name} className="w-full h-48 object"  style={project.style}/>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap justify-center mb-4">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="bg-blue-900 text-blue-200 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-center space-x-4">
                  <a
                    href={project.liveLink}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Live Project
                  </a>
                  <a
                    href={project.sourceCodeLink}
                    className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="mr-2" />
                    Source Code
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

export default ProjectsShowcase;
