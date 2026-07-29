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
          <h2>Who is Me?</h2>
          <p> I am a software engineer with a passion for helping people. I am currently working at <a href="https://www.etf.bg.ac.rs" target="_blank" rel="noopener noreferrer">School of Electrical Engineering</a> as a laboratory assistant. </p>
          <p> I am also a student at <a href="https://www.etf.bg.ac.rs" target="_blank" rel="noopener noreferrer">School of Electrical Engineering</a> where I am studying computer science. </p>
          <p> I am interested in various fields of computer science, and their intersection with other fields. Currently, I am working on making a world a better place.</p>
          <p>I love learning new things such as languages, new technologies, cooking recipes, playing instruments, composing music, films and photography.</p>
          <p> Lately im into philosophy, spirituality and medicine, nutrition and lifestyle. I want to hope there is more then what meets the eye.</p>
          <p> I am positive person and I believe all people are good people. I have a lot to talk about, we all do.</p>
          <p>Loneliness is not foregin to me, neither is patience. That's my proudest virtue.</p>
        </section>
      </main>
    </div>
  );
}
