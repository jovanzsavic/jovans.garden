import './Laboratory.css';

import CelestialBackground from '../components/CelestialBackground';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Laboratory() {
  const [isEntering, setIsEntering] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveBlackout, setShowLeaveBlackout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Let the initial paint happen with blackout on, then fade it out.
    const t = setTimeout(() => setIsEntering(false), 50);
    return () => clearTimeout(t);
  }, []);

  const goBack = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setShowLeaveBlackout(false);
    // Let the zoom-out be visible before we fade to black.
    setTimeout(() => setShowLeaveBlackout(true), 120);
    // Match Home->Lab timing. We keep the zoom-out visible for a moment
    // and let blackout carry us over the actual route swap.
    setTimeout(() => {
      navigate('/');
    }, 900);
  };

  return (
    <div className="LabPage" data-highlight="brittle">
      <div
        className={`Blackout${isEntering || showLeaveBlackout ? ' is-on' : ''}`}
        aria-hidden="true"
      />
      {/* Focused background mode (we'll implement the zoom/focus behavior next) */}
  <CelestialBackground
        speed={1}
        focusKey="brittle"
        focusDirection={isLeaving ? 'out' : 'in'}
        focusCenter
        focusScale={3.2}
        hideSun
      />
      <div className="Stars" aria-hidden="true" />
      <div className="Stars Stars--2" aria-hidden="true" />

      <main className="LabUI" aria-label="Laboratory page">
        <header className="LabHeader">
          <button className="TinyLink" type="button" onClick={goBack} disabled={isLeaving}>
            ← Back
          </button>
          <h1 className="LabTitle">Laboratory</h1>
          <p className="LabSubtitle">Brittle Hollow — experiments coming soon.</p>
        </header>

        <section className="LabPanel">
          <h2>Placeholder menu</h2>
          <ul>
            <li>Projects / notes</li>
            <li>Experiments</li>
            <li>Links</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
