import './App.css';
import CelestialBackground from './components/CelestialBackground';
import { useState } from 'react';

function App() {
  const [highlight, setHighlight] = useState('');
  const [speed, setSpeed] = useState(1);

  const clampSpeed = (v) => Math.max(0.25, Math.min(4, v));

  return (
    <div className="App" data-highlight={highlight || undefined}>
      <CelestialBackground
        onPhaseChange={undefined}
        onCycle={undefined}
        speed={speed}
      />
      <div className="Stars" aria-hidden="true" />
      <div className="Stars Stars--2" aria-hidden="true" />

      <main className="Menu" aria-label="Main menu">
        <h1 className="Menu-title">Jovan's Garden</h1>
        <p className="Menu-subtitle">
          The Universe isn't meant to be scary. It is what it is.
        </p>

        <nav className="Menu-buttons" aria-label="Primary navigation">
          <a
            className="Menu-button"
            href="#about"
            onMouseEnter={() => setHighlight('timber')}
            onMouseLeave={() => setHighlight('')}
            onFocus={() => setHighlight('timber')}
            onBlur={() => setHighlight('')}
          >
            About
          </a>
          <a
            className="Menu-button"
            href="#projects"
            onMouseEnter={() => setHighlight('twins')}
            onMouseLeave={() => setHighlight('')}
            onFocus={() => setHighlight('twins')}
            onBlur={() => setHighlight('')}
          >
            Projects
          </a>
          <a
            className="Menu-button"
            href="#laboratory"
            onMouseEnter={() => setHighlight('brittle')}
            onMouseLeave={() => setHighlight('')}
            onFocus={() => setHighlight('brittle')}
            onBlur={() => setHighlight('')}
          >
            Laboratory
          </a>
          <a
            className="Menu-button"
            href="#contact"
            onMouseEnter={() => setHighlight('giants')}
            onMouseLeave={() => setHighlight('')}
            onFocus={() => setHighlight('giants')}
            onBlur={() => setHighlight('')}
          >
            Contact
          </a>
        </nav>
      </main>

      <div className="SpeedControls" aria-label="Animation speed controls">
        <button
          type="button"
          className="SpeedControls-btn"
          onClick={() => setSpeed((s) => clampSpeed(s / 1.5))}
        >
          -
          <span className="sr-only">Slow down</span>
        </button>
        <button
          type="button"
          className="SpeedControls-btn"
          onClick={() => setSpeed(1)}
        >
          1x
          <span className="sr-only">Normal speed</span>
        </button>
        <button
          type="button"
          className="SpeedControls-btn"
          onClick={() => setSpeed((s) => clampSpeed(s * 1.5))}
        >
          +
          <span className="sr-only">Speed up</span>
        </button>
        <div className="SpeedControls-readout" aria-hidden="true">
          {speed.toFixed(speed < 1 ? 2 : 1)}x
        </div>
      </div>
    </div>
  );
}

export default App;
