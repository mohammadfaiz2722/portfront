// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillsSection from './components/SkillSection';
import ProjectShowcase from './components/ProjectShowcase'
import PhotoSection from './components/PhotoSection';
import ContactSection from './components/ContactSection';
import PricingPage from './components/Pricing';
import SkillShowcase from './components/SkillShowcase'
import ProjectForm from './components/ProjectForm'
function App() {
  return (
  <>
  <Router>
      <Navbar/>
      
      <Routes>
         <Route path="/" element={<>
         <Hero />
         <PhotoSection/>
          <SkillsSection/>
          <ProjectShowcase/>
          <SkillShowcase/>
          </>} />

         <Route path="/pricing" element={<PricingPage />} />
         <Route path="/projectform" element={<ProjectForm />} />
  
      </Routes>
      <ContactSection/>
    </Router>
  </>
  );
}

export default App;
