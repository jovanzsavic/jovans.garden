import './Laboratory.css';

import CelestialBackground from '../components/CelestialBackground';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Laboratory() {
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    // Let the initial paint happen with blackout on, then fade it out.
    const t = setTimeout(() => setIsEntering(false), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="LabPage" data-highlight="brittle">
      <div className={`Blackout${isEntering ? ' is-on' : ''}`} aria-hidden="true" />
      {/* Focused background mode (we'll implement the zoom/focus behavior next) */}
  <CelestialBackground speed={1} focusKey="brittle" focusCenter focusScale={3.2} hideSun />
      <div className="Stars" aria-hidden="true" />
      <div className="Stars Stars--2" aria-hidden="true" />

      <main className="LabUI" aria-label="Laboratory page">
        <header className="LabHeader">
          <Link className="TinyLink" to="/">← Back</Link>
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
