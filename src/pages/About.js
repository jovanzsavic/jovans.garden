import './About.css';

import CelestialBackground from '../components/CelestialBackground';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function About() {
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
    <div className="AboutPage" data-highlight="timber">
      <div
        className={`Blackout${isEntering || showLeaveBlackout ? ' is-on' : ''}`}
        aria-hidden="true"
      />

      <CelestialBackground
        speed={1}
        focusKey="timber"
        focusDirection={isLeaving ? 'out' : 'in'}
        focusCenter
        focusScale={3.2}
        hideSun
      />

      <div className="Stars" aria-hidden="true" />
      <div className="Stars Stars--2" aria-hidden="true" />

      <main className="AboutUI" aria-label="About page">
        <header className="AboutHeader">
          <button className="TinyLink" type="button" onClick={goBack} disabled={isLeaving}>
            ← Back
          </button>
          <h1 className="AboutTitle">About</h1>
          <p className="AboutSubtitle">Timber Hearth — hello.</p>
        </header>

        <section className="AboutPanel">
          <h2>About Me</h2>
          <p>This is a placeholder about page. Add your bio, links, and notes here.</p>
        </section>
      </main>
    </div>
  );
}
