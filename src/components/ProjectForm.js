import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const CosmicProjectForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    projectType: '',
    referenceWebsite: '',
    referencePhoto: null,
    budget: '',
  });

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, referencePhoto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setShowLoading(true);
    
    setTimeout(async () => {
      const response = await fetch('https://portbackend-ipyo.onrender.com/api/auth/sendmessage', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formData })
      });
      
      const res = await response.json();
      console.log(res);
      
      if (response.ok) {
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
      setShowLoading(false);
    }, 3000);
  };

  const formSteps = [
    { title: "Cosmic Identity", fields: ["username", "email"] },
    { title: "Mission Parameters", fields: ["projectType", "referenceWebsite"] },
    { title: "Resource Allocation", fields: ["referencePhoto", "budget"] },
  ];

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-black bg-opacity-50 p-8 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-lg"
        >
          <h1 className="text-center mb-8 text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Cosmic Project Ignition 🚀
          </h1>

          <div className="mb-8">
            <div className="flex justify-between">
              {formSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center ${
                    index <= currentStep ? 'text-blue-400' : 'text-gray-500'
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 ${
                        index <= currentStep ? 'border-blue-400 bg-blue-900' : 'border-gray-500'
                      }`}
                    >
                      {index < currentStep ? (
                        '✓'
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="mt-2">{step.title}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-blue-400 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {formSteps[currentStep].fields.map((field) => (
                  <React.Fragment key={field}>
                    {field === 'referencePhoto' ? (
                      <FileInput
                        label="Cosmic Inspiration Image"
                        name={field}
                        onChange={handleFileChange}
                      />
                    ) : field === 'projectType' ? (
                      <Select
                        label="Mission Type"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                        options={[
                          { value: 'Frontend', label: 'Frontend Nebula' },
                          { value: 'Backend', label: 'Backend Black Hole' },
                          { value: 'Fullstack', label: 'Fullstack Galaxy' },
                          { value: 'Other', label: 'Alien Technology' },
                        ]}
                      />
                    ) : field === 'budget' ? (
                      <Select
                        label="Stardust Budget"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                        options={[
                          { value: '1k-10k', label: '1k - 10k Stardust' },
                          { value: '10k-25k', label: '10k - 25k Stardust' },
                          { value: '25k-1lac', label: '25k - 1lac Stardust' },
                        ]}
                      />
                    ) : (
                      <Input
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        type={field === 'email' ? 'email' : field === 'referenceWebsite' ? 'url' : 'text'}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </React.Fragment>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-300"
                >
                  Previous
                </motion.button>
              )}
              {currentStep < formSteps.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors duration-300"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className={`px-6 py-2 ${
                    processing
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                  } text-white rounded-full transition-colors duration-300`}
                  disabled={processing}
                >
                  {processing ? 'Launching...' : 'Initiate Space Mission 🌠'}
                </motion.button>
              )}
            </div>
          </form>

          <AnimatePresence>
            {showLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
              >
                <div className="text-center text-white">
                  <h2 className="text-2xl font-bold mb-4">Contacting Intergalactic Servers...</h2>
                  <p className="text-lg">Please hold tight, our quantum computers are processing your request.</p>
                  <div className="mt-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
              >
                <div className="text-center text-white">
                  <h2 className="text-4xl font-bold mb-4">Mission Launched! 🎉</h2>
                  <p className="text-xl">Your cosmic project is now among the stars. We'll contact you soon via intergalactic communication.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
    </div>
  );
};

const Input = ({ label, type = 'text', name, value, onChange, required }) => (
  <div className="mb-4">
    <label className="block text-blue-300 font-semibold mb-2" htmlFor={name}>
      {label}
    </label>
    <input
      className="w-full px-4 py-2 text-white bg-black bg-opacity-50 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300 placeholder-gray-500"
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

const Select = ({ label, name, value, onChange, required, options }) => (
  <div className="mb-4">
    <label className="block text-blue-300 font-semibold mb-2" htmlFor={name}>
      {label}
    </label>
    <select
      className="w-full px-4 py-2 text-white bg-black bg-opacity-50 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="" className="text-gray-500">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-white">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div className="mb-4">
    <label className="block text-blue-300 font-semibold mb-2" htmlFor={name}>
      {label}
    </label>
    <input
      className="w-full px-4 py-2 text-white bg-black bg-opacity-50 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
      type="file"
      id={name}
      name={name}
      onChange={onChange}
    />
  </div>
);

export default CosmicProjectForm;