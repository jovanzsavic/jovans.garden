import './Contact.css';

import CelestialBackground from '../components/CelestialBackground';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const [isEntering, setIsEntering] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveBlackout, setShowLeaveBlackout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setIsEntering(false), 50);
    return () => clearTimeout(t);
  }, []);

  const goBack = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setShowLeaveBlackout(false);
    setTimeout(() => setShowLeaveBlackout(true), 120);
    setTimeout(() => navigate('/'), 900);
  };

  return (
    <div className="ContactPage" data-highlight="giants">
      <div
        className={`Blackout${isEntering || showLeaveBlackout ? ' is-on' : ''}`}
        aria-hidden="true"
      />

      <CelestialBackground
        speed={1}
        focusKey="giants"
        focusDirection={isLeaving ? 'out' : 'in'}
        focusCenter
        focusScale={3.2}
        hideSun
      />

      <div className="Stars" aria-hidden="true" />
      <div className="Stars Stars--2" aria-hidden="true" />

      <main className="ContactUI" aria-label="Contact page">
        <header className="ContactHeader">
          <button className="TinyLink" type="button" onClick={goBack} disabled={isLeaving}>
            ← Back
          </button>
          <h1 className="ContactTitle">Contact</h1>
          <p className="ContactSubtitle">Giant's Deep — reach out.</p>
        </header>

        <section className="ContactPanel">
          <h2>Contact</h2>
          <p>Reach me via email: <a href="mailto:hello@example.com">hello@example.com</a></p>
        </section>
      </main>
    </div>
  );
}
