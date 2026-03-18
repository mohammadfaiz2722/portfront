import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

/* ── Step config ── */
const formSteps = [
  {
    label: '01',
    title: 'Identity',
    sub: 'Who are you?',
    fields: ['username', 'email'],
  },
  {
    label: '02',
    title: 'Project',
    sub: "What's the mission?",
    fields: ['projectType', 'referenceWebsite'],
  },
  {
    label: '03',
    title: 'Budget',
    sub: 'Resources & vision.',
    fields: ['referencePhoto', 'budget'],
  },
];

/* ── Tilt card wrapper ── */
const TiltCard = ({ children }) => {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sX = useSpring(rotX, { stiffness: 120, damping: 24 });
  const sY = useSpring(rotY, { stiffness: 120, damping: 24 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    rotY.set(((e.clientX - rect.left - rect.width  / 2) / rect.width)  * 8);
    rotX.set(((rect.top + rect.height / 2 - e.clientY) / rect.height) * 8);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: sX, rotateY: sY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className="pf-card"
    >
      {children}
    </motion.div>
  );
};

/* ── Field components ── */
const Input = ({ label, type = 'text', name, value, onChange, required, placeholder }) => (
  <div className="pf-field">
    <label className="pf-label" htmlFor={name}>{label}</label>
    <input
      className="pf-input"
      id={name} type={type} name={name}
      value={value} onChange={onChange}
      required={required}
      placeholder={placeholder || ''}
      autoComplete="off"
    />
  </div>
);

const Select = ({ label, name, value, onChange, required, options }) => (
  <div className="pf-field">
    <label className="pf-label" htmlFor={name}>{label}</label>
    <select
      className="pf-input pf-select"
      id={name} name={name}
      value={value} onChange={onChange}
      required={required}
    >
      <option value="">Select an option</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const FileInput = ({ label, name, onChange, file }) => (
  <div className="pf-field">
    <label className="pf-label">{label}</label>
    <label htmlFor={name} className="pf-file-label">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      <span>{file ? file.name : 'Choose a reference image'}</span>
      <input type="file" id={name} name={name} onChange={onChange} style={{ display: 'none' }} accept="image/*" />
    </label>
  </div>
);

/* ── Main ── */
const CosmicProjectForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', email: '', projectType: '',
    referenceWebsite: '', referencePhoto: null, budget: '',
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, referencePhoto: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setShowLoading(true);
    setTimeout(async () => {
      const response = await fetch('https://portbackend-ipyo.onrender.com/api/auth/sendmessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData }),
      });
      const res = await response.json();
      if (response.ok) {
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => navigate('/'), 3000);
      }
      setShowLoading(false);
    }, 3000);
  };

  const nextStep = () => currentStep < formSteps.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);
  const progress  = ((currentStep + 1) / formSteps.length) * 100;

  const renderField = (field) => {
    if (field === 'referencePhoto') return (
      <FileInput key={field} label="Reference Image" name={field} onChange={handleFileChange} file={formData.referencePhoto} />
    );
    if (field === 'projectType') return (
      <Select key={field} label="Project Type" name={field} value={formData[field]} onChange={handleChange} required
        options={[
          { value: 'Frontend',  label: 'Frontend Development' },
          { value: 'Backend',   label: 'Backend Development' },
          { value: 'Fullstack', label: 'Full Stack Application' },
          { value: 'Other',     label: 'Something Else' },
        ]}
      />
    );
    if (field === 'budget') return (
      <Select key={field} label="Budget Range" name={field} value={formData[field]} onChange={handleChange} required
        options={[
          { value: '1k-10k',   label: '₹1,000 – ₹10,000' },
          { value: '10k-25k',  label: '₹10,000 – ₹25,000' },
          { value: '25k-1lac', label: '₹25,000 – ₹1,00,000' },
        ]}
      />
    );
    const labels = { username: 'Your Name', email: 'Email Address', referenceWebsite: 'Reference Website URL' };
    const placeholders = { username: 'Mohammad Faiz', email: 'you@email.com', referenceWebsite: 'https://example.com' };
    return (
      <Input key={field}
        label={labels[field] || field}
        name={field}
        type={field === 'email' ? 'email' : field === 'referenceWebsite' ? 'url' : 'text'}
        value={formData[field]}
        onChange={handleChange}
        required
        placeholder={placeholders[field]}
      />
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@400;500;600;700&display=swap');

        .pf-root {
          min-height: 100svh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 16px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* grid */
        .pf-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, black, transparent);
          -webkit-mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, black, transparent);
          pointer-events: none;
        }

        /* blobs */
        .pf-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none; opacity: 0.08;
          animation: pfBlob 16s ease-in-out infinite alternate;
        }
        @keyframes pfBlob {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(30px,-30px) scale(1.1); }
        }

        /* card */
        .pf-card {
          position: relative;
          width: 100%;
          max-width: 560px;
          border-radius: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          padding: 48px 44px 44px;
          overflow: hidden;
        }
        @media (max-width: 600px) { .pf-card { padding: 36px 24px 32px; } }

        .pf-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #61DAFB, rgba(150,80,255,0.8), #61DAFB);
          background-size: 200% 100%;
          animation: shimmerBar 3s linear infinite;
        }
        @keyframes shimmerBar {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* header */
        .pf-eyebrow {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin-bottom: 16px;
        }
        .pf-eyebrow-line {
          height: 1px; width: 36px;
          background: linear-gradient(90deg, rgba(97,218,251,0.5), transparent);
        }
        .pf-eyebrow-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }
        .pf-heading {
          font-family: 'Italiana', serif;
          font-size: clamp(36px, 6vw, 58px);
          line-height: 1; margin: 0 0 6px;
          text-align: center;
          background: linear-gradient(145deg, #fff 40%, rgba(255,255,255,0.45));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .pf-subheading {
          text-align: center;
          font-size: 13px; color: rgba(255,255,255,0.28);
          letter-spacing: 0.05em; margin-bottom: 36px;
        }

        /* stepper */
        .pf-stepper {
          display: flex; align-items: flex-start;
          gap: 0; margin-bottom: 36px; position: relative;
        }
        .pf-step {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
          position: relative; cursor: default;
        }
        .pf-step-connector {
          position: absolute; top: 17px; left: calc(50% + 20px);
          right: calc(-50% + 20px); height: 1px;
          background: rgba(255,255,255,0.08); z-index: 0;
        }
        .pf-step-connector.active { background: rgba(97,218,251,0.35); }
        .pf-step-dot {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
          color: rgba(255,255,255,0.2);
          position: relative; z-index: 1;
          transition: all 0.4s ease;
        }
        .pf-step-dot.active {
          border-color: #61DAFB;
          background: rgba(97,218,251,0.1);
          color: #61DAFB;
          box-shadow: 0 0 16px rgba(97,218,251,0.3);
        }
        .pf-step-dot.done {
          border-color: rgba(97,218,251,0.4);
          background: rgba(97,218,251,0.06);
          color: #61DAFB;
        }
        .pf-step-info { text-align: center; }
        .pf-step-title {
          font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.22);
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: color 0.3s;
        }
        .pf-step-title.active { color: rgba(255,255,255,0.7); }
        .pf-step-sub {
          font-size: 10px; color: rgba(255,255,255,0.15);
          margin-top: 2px; display: none;
        }
        @media (min-width: 480px) { .pf-step-sub { display: block; } }

        /* progress bar */
        .pf-progress-track {
          height: 2px; background: rgba(255,255,255,0.06);
          border-radius: 999px; margin-bottom: 36px; overflow: hidden;
        }
        .pf-progress-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #61DAFB, rgba(150,80,255,0.8));
          transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 0 8px rgba(97,218,251,0.4);
        }

        /* fields */
        .pf-field { margin-bottom: 20px; }
        .pf-label {
          display: block; font-size: 11px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); margin-bottom: 10px;
        }
        .pf-input {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #fff;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          box-sizing: border-box;
        }
        .pf-input::placeholder { color: rgba(255,255,255,0.18); }
        .pf-input:focus {
          border-color: rgba(97,218,251,0.45);
          background: rgba(97,218,251,0.04);
          box-shadow: 0 0 0 3px rgba(97,218,251,0.08);
        }
        .pf-select { cursor: pointer; appearance: none; }
        .pf-select option { background: #0a0a14; color: #fff; }

        /* file input */
        .pf-file-label {
          display: flex; align-items: center; gap: 12px;
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px dashed rgba(255,255,255,0.12);
          border-radius: 12px;
          font-size: 13px; color: rgba(255,255,255,0.35);
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s, color 0.25s;
          box-sizing: border-box;
        }
        .pf-file-label:hover {
          border-color: rgba(97,218,251,0.35);
          background: rgba(97,218,251,0.04);
          color: rgba(255,255,255,0.6);
        }
        .pf-file-label span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* step action buttons */
        .pf-actions {
          display: flex; justify-content: space-between;
          align-items: center; margin-top: 32px; gap: 12px;
        }

        .pf-btn-back {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 22px; border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.45);
          cursor: pointer; transition: all 0.2s;
        }
        .pf-btn-back:hover { background: rgba(255,255,255,0.09); color: #fff; }

        .pf-btn-next {
          margin-left: auto;
          position: relative;
          display: inline-flex;
          padding: 1.5px;
          border-radius: 999px;
          background: linear-gradient(135deg, #61DAFB, rgba(150,80,255,0.8));
          box-shadow: 0 0 20px rgba(97,218,251,0.2);
          cursor: pointer;
          border: none;
          transition: box-shadow 0.3s;
        }
        .pf-btn-next:hover { box-shadow: 0 0 32px rgba(97,218,251,0.38); }
        .pf-btn-next-inner {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 999px;
          background: #000;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          color: #fff; letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: background 0.25s;
        }
        .pf-btn-next:hover .pf-btn-next-inner { background: rgba(0,0,0,0.8); }
        .pf-btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
        .pf-btn-next:disabled:hover { box-shadow: 0 0 20px rgba(97,218,251,0.2); }

        /* loading overlay */
        .pf-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.92);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
        }
        .pf-overlay-inner { text-align: center; padding: 0 24px; }
        .pf-spinner {
          width: 48px; height: 48px; border-radius: 50%;
          border: 2px solid rgba(97,218,251,0.15);
          border-top-color: #61DAFB;
          animation: pfSpin 0.8s linear infinite;
          margin: 0 auto 24px;
        }
        @keyframes pfSpin { to { transform: rotate(360deg); } }
        .pf-overlay-title {
          font-family: 'Italiana', serif;
          font-size: 36px; color: #fff; margin: 0 0 8px;
        }
        .pf-overlay-sub { font-size: 14px; color: rgba(255,255,255,0.35); }

        /* success overlay */
        .pf-success-icon {
          width: 72px; height: 72px; border-radius: 50%;
          border: 1.5px solid rgba(97,218,251,0.4);
          background: rgba(97,218,251,0.08);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 0 30px rgba(97,218,251,0.2);
        }

        /* back link */
        .pf-back-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; color: rgba(255,255,255,0.22);
          text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase;
          font-weight: 600; margin-bottom: 32px;
          transition: color 0.2s;
        }
        .pf-back-link:hover { color: rgba(255,255,255,0.5); }
      `}</style>

      <div className="pf-root">
        {/* Blobs */}
        <div className="pf-blob" style={{ left: '5%',  top: '10%', width: 400, height: 400, background: 'hsl(200,70%,55%)' }} />
        <div className="pf-blob" style={{ right: '5%', bottom: '10%', width: 340, height: 340, background: 'hsl(270,60%,55%)', animationDelay: '-7s' }} />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 560, margin: '0 auto' }}>

          {/* Back link */}
          <Link to="/" className="pf-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to portfolio
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard>
              {/* Header */}
              <div className="pf-eyebrow">
                <div className="pf-eyebrow-line" />
                <span className="pf-eyebrow-label">New Project</span>
                <div className="pf-eyebrow-line" style={{ transform: 'scaleX(-1)' }} />
              </div>
              <h1 className="pf-heading">Let's Build It</h1>
              <p className="pf-subheading">Fill in the details and I'll get back to you shortly.</p>

              {/* Stepper */}
              <div className="pf-stepper">
                {formSteps.map((step, i) => (
                  <div key={i} className="pf-step">
                    {i < formSteps.length - 1 && (
                      <div className={`pf-step-connector ${i < currentStep ? 'active' : ''}`} />
                    )}
                    <motion.div
                      className={`pf-step-dot ${i === currentStep ? 'active' : i < currentStep ? 'done' : ''}`}
                      animate={{ scale: i === currentStep ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {i < currentStep ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : step.label}
                    </motion.div>
                    <div className="pf-step-info">
                      <div className={`pf-step-title ${i === currentStep ? 'active' : ''}`}>{step.title}</div>
                      <div className="pf-step-sub">{step.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="pf-progress-track">
                <motion.div
                  className="pf-progress-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {formSteps[currentStep].fields.map((field) => renderField(field))}
                  </motion.div>
                </AnimatePresence>

                {/* Actions */}
                <div className="pf-actions">
                  {currentStep > 0 && (
                    <motion.button
                      type="button" onClick={prevStep}
                      className="pf-btn-back"
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                      </svg>
                      Back
                    </motion.button>
                  )}

                  {currentStep < formSteps.length - 1 ? (
                    <motion.button
                      type="button" onClick={nextStep}
                      className="pf-btn-next"
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="pf-btn-next-inner">
                        Continue
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </span>
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      className="pf-btn-next"
                      disabled={processing}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="pf-btn-next-inner">
                        {processing ? 'Sending…' : 'Send Project Brief'}
                        {!processing && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        )}
                      </span>
                    </motion.button>
                  )}
                </div>
              </form>
            </TiltCard>
          </motion.div>
        </div>

        {/* Loading overlay */}
        <AnimatePresence>
          {showLoading && (
            <motion.div
              className="pf-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="pf-overlay-inner">
                <div className="pf-spinner" />
                <h2 className="pf-overlay-title">Sending your brief…</h2>
                <p className="pf-overlay-sub">Hang tight, reaching out to the server.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success overlay */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="pf-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="pf-overlay-inner"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pf-success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="pf-overlay-title">Brief received!</h2>
                <p className="pf-overlay-sub" style={{ maxWidth: 320, margin: '0 auto' }}>
                  I'll review your project and get back to you soon. Redirecting you home…
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CosmicProjectForm;