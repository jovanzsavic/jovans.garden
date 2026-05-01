import './App.css';
import CelestialBackground from './components/CelestialBackground';
import { useState } from 'react';

function App() {
  const [highlight, setHighlight] = useState('');

  return (
    <div className="App" data-highlight={highlight || undefined}>
      <CelestialBackground
        onPhaseChange={undefined}
        onCycle={undefined}
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
            onMouseEnter={() => setHighlight('moon')}
            onMouseLeave={() => setHighlight('')}
            onFocus={() => setHighlight('moon')}
            onBlur={() => setHighlight('')}
          >
            Contact
          </a>
        </nav>
      </main>
    </div>
  );
}

export default App;
