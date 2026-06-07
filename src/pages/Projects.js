import './Projects.css';

import CelestialBackground from '../components/CelestialBackground';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
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
    <div className="ProjectsPage" data-highlight="twins">
      <div
        className={`Blackout${isEntering || showLeaveBlackout ? ' is-on' : ''}`}
        aria-hidden="true"
      />

      <CelestialBackground
        speed={1}
        focusKey="twins"
        focusDirection={isLeaving ? 'out' : 'in'}
        focusCenter
        focusScale={3.2}
        hideSun
      />

      <div className="Stars" aria-hidden="true" />
      <div className="Stars Stars--2" aria-hidden="true" />

      <main className="ProjectsUI" aria-label="Projects page">
        <header className="ProjectsHeader">
          <button className="TinyLink" type="button" onClick={goBack} disabled={isLeaving}>
            ← Back
          </button>
          <h1 className="ProjectsTitle">Projects</h1>
          <p className="ProjectsSubtitle">Twins — projects & experiments.</p>
        </header>

        <section className="ProjectsPanel">
          <h2>Projects</h2>
          <p>Project list placeholder.</p>
        </section>
      </main>
    </div>
  );
}
