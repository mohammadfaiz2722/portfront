import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const CosmicProjectForm = () => {
  const navigate=useNavigate()
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, referencePhoto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const response=await fetch ('https://portbackend-ipyo.onrender.com/api/auth/sendmessage',{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({...formData})

    })
    const res=await response.json();
    console.log(res)
    if(response.ok)
    {
      setProcessing(false);
      setSuccess(true);
setTimeout(()=>{
navigate("/")
},1500)
    }
    // setTimeout(() => {
    // }, 2000);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex items-center justify-center px-4 py-12">
      {/* Starry background */}
      {[...Array(80)].map((_, i) => (
        <div
          key={i}
          className="star absolute rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: `hsl(${Math.random() * 360}, 50%, 50%)`,
            animation: `twinkle ${Math.random() * 5 + 3}s linear infinite`,
          }}
        />
      ))}

      {/* Floating planets */}
      <div className="planet absolute w-20 h-20 rounded-full bg-purple-500 opacity-50" style={{ top: '10%', left: '5%', animation: 'float 15s infinite ease-in-out' }} />
      <div className="planet absolute w-32 h-32 rounded-full bg-blue-500 opacity-50" style={{ bottom: '15%', right: '10%', animation: 'float 20s infinite ease-in-out' }} />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden"
        style={{ boxShadow: '0 0 40px rgba(123, 31, 162, 0.5)' }}
      >
        <h1 className="text-center mb-8 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Cosmic Project Launch 🚀
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Astronaut Name" name="username" value={formData.username} onChange={handleChange} required />
            <Input label="Space Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <Select
            label="Mission Type"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            required
            options={[
              { value: 'Frontend', label: 'Frontend Nebula' },
              { value: 'Backend', label: 'Backend Black Hole' },
              { value: 'Fullstack', label: 'Fullstack Galaxy' },
              { value: 'Other', label: 'Alien Technology' },
            ]}
          />

          <Input label="Reference Star System (URL)" name="referenceWebsite" type="url" value={formData.referenceWebsite} onChange={handleChange} />

          <div className="mb-4">
            <label className="block text-blue-300 font-semibold mb-2" htmlFor="referencePhoto">
              Cosmic Inspiration Image
            </label>
            <input
              className="w-full px-3 py-2 text-white bg-black bg-opacity-50 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              type="file"
              id="referencePhoto"
              name="referencePhoto"
              onChange={handleFileChange}
            />
          </div>

          <Select
            label="Stardust Budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            options={[
              { value: '1k-10k', label: '1k - 10k Stardust' },
              { value: '10k-25k', label: '10k - 25k Stardust' },
              { value: '25k-1lac', label: '25k - 1lac Stardust' },
            ]}
          />

          <div className="text-right">
            <Link to="/pricing" className="text-blue-400 underline hover:text-blue-300 transition-colors duration-300">
              Need a cosmic price check? View our intergalactic rates 🛸
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`w-full ${
              processing
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
            } text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-lg`}
            disabled={processing}
          >
            {processing ? 'Launching...' : 'Initiate Space Mission 🌠'}
          </motion.button>
        </form>

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90"
          >
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Mission Launched! 🎉</h2>
              <p className="text-xl">Your cosmic project is now among the stars. We'll contact you soon via intergalactic communication.</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const Input = ({ label, type = 'text', name, value, onChange, required }) => (
  <div className="mb-4">
    <label className="block text-blue-300 font-semibold mb-2" htmlFor={name}>
      {label}
    </label>
    <input
      className="w-full px-3 py-2 text-white bg-black bg-opacity-50 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300 placeholder-gray-500"
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
      className="w-full px-3 py-2 text-white bg-black bg-opacity-50 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
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

export default CosmicProjectForm;