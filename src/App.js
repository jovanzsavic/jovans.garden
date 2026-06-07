import './App.css';
import CelestialBackground from './components/CelestialBackground';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Laboratory from './pages/Laboratory';
import About from './pages/About';
import Contact from './pages/Contact';
import Projects from './pages/Projects';

function HomeRoute() {
  const [highlight, setHighlight] = useState('');
  const [speed, setSpeed] = useState(1);
  const [isEnteringLab, setIsEnteringLab] = useState(false);
  const [isEnteringHome, setIsEnteringHome] = useState(true);
  const navigate = useNavigate();

  const clampSpeed = (v) => Math.max(0.25, Math.min(4, v));

  useEffect(() => {
    if (!isEnteringLab) return;
    const t = setTimeout(() => {
      navigate('/laboratory');
    }, 900);
    return () => clearTimeout(t);
  }, [isEnteringLab, navigate]);

  useEffect(() => {
    // When (re)entering Home (e.g. from /laboratory), start black then fade out.
    const t = setTimeout(() => setIsEnteringHome(false), 50);
    return () => clearTimeout(t);
  }, []);

  const startLabTransition = () => {
    // prevent double-clicks triggering multiple timers
    if (isEnteringLab) return;
    setHighlight('brittle');
    setIsEnteringLab(true);
  };

  const [isEnteringAbout, setIsEnteringAbout] = useState(false);
  useEffect(() => {
    if (!isEnteringAbout) return;
    const t = setTimeout(() => {
      navigate('/about');
    }, 900);
    return () => clearTimeout(t);
  }, [isEnteringAbout, navigate]);

  const startAboutTransition = () => {
    if (isEnteringAbout) return;
    setHighlight('timber');
    setIsEnteringAbout(true);
  };

  const [isEnteringContact, setIsEnteringContact] = useState(false);
  useEffect(() => {
    if (!isEnteringContact) return;
    const t = setTimeout(() => {
      navigate('/contact');
    }, 900);
    return () => clearTimeout(t);
  }, [isEnteringContact, navigate]);

  const startContactTransition = () => {
    if (isEnteringContact) return;
    setHighlight('giants');
    setIsEnteringContact(true);
  };

  const [isEnteringProjects, setIsEnteringProjects] = useState(false);
  useEffect(() => {
    if (!isEnteringProjects) return;
    const t = setTimeout(() => {
      navigate('/projects');
    }, 900);
    return () => clearTimeout(t);
  }, [isEnteringProjects, navigate]);

  const startProjectsTransition = () => {
    if (isEnteringProjects) return;
    setHighlight('twins');
    setIsEnteringProjects(true);
  };

  const setHighlightIfAllowed = (key) => {
    if (isEnteringLab || isEnteringAbout || isEnteringContact || isEnteringProjects) return;
    setHighlight(key);
  };

  return (
    <div className="App" data-highlight={highlight || undefined}>
        <div
          className={`Blackout${isEnteringHome || isEnteringLab || isEnteringAbout || isEnteringContact || isEnteringProjects ? ' is-on' : ''}`}
          aria-hidden="true"
        />
      <CelestialBackground
        onPhaseChange={undefined}
        onCycle={undefined}
        speed={speed}
        focusKey={
          isEnteringLab
            ? 'brittle'
            : isEnteringAbout
            ? 'timber'
            : isEnteringContact
            ? 'giants'
            : isEnteringProjects
            ? 'twins'
            : undefined
        }
        focusCenter={false}
        focusScale={3.2}
        focusHideOthers={true}
        focusHideOthersAt={0.88}
        focusDimAll={isEnteringLab || isEnteringAbout || isEnteringContact || isEnteringProjects}
        focusDimFrom={0}
        focusDimTo={1}
        focusDimIncludeFocused={true}
      />
      <div className="Stars" aria-hidden="true" />
      <div className="Stars Stars--2" aria-hidden="true" />

      <main className="Menu" aria-label="Main menu">
        <h1 className="Menu-title">Jovan's Garden</h1>
        <p className="Menu-subtitle">
          welcome.
        </p>

        <nav className="Menu-buttons" aria-label="Primary navigation">
          <button
            className="Menu-button"
            type="button"
            data-key="timber"
            onClick={startAboutTransition}
            onMouseEnter={() => setHighlightIfAllowed('timber')}
            onMouseLeave={() => setHighlightIfAllowed('')}
            onFocus={() => setHighlightIfAllowed('timber')}
            onBlur={() => setHighlightIfAllowed('')}
            aria-disabled={isEnteringAbout}
            disabled={isEnteringAbout}
          >
            About
          </button>
          <button
            className="Menu-button"
            type="button"
            data-key="twins"
            onClick={startProjectsTransition}
            onMouseEnter={() => setHighlightIfAllowed('twins')}
            onMouseLeave={() => setHighlightIfAllowed('')}
            onFocus={() => setHighlightIfAllowed('twins')}
            onBlur={() => setHighlightIfAllowed('')}
            aria-disabled={isEnteringProjects}
            disabled={isEnteringProjects}
          >
            Projects
          </button>
          <button
            type="button"
            className="Menu-button"
            data-key="brittle"
            onClick={startLabTransition}
            onMouseEnter={() => setHighlightIfAllowed('brittle')}
            onMouseLeave={() => setHighlightIfAllowed('')}
            onFocus={() => setHighlightIfAllowed('brittle')}
            onBlur={() => setHighlightIfAllowed('')}
            aria-disabled={isEnteringLab}
            disabled={isEnteringLab}
          >
            Laboratory
          </button>
          <button
            className="Menu-button"
            type="button"
            data-key="giants"
            onClick={startContactTransition}
            onMouseEnter={() => setHighlightIfAllowed('giants')}
            onMouseLeave={() => setHighlightIfAllowed('')}
            onFocus={() => setHighlightIfAllowed('giants')}
            onBlur={() => setHighlightIfAllowed('')}
            aria-disabled={isEnteringContact}
            disabled={isEnteringContact}
          >
            Contact
          </button>
        </nav>
      </main>

      <div className="SpeedControls" aria-label="Animation speed controls">
        <button
          type="button"
          className="SpeedControls-btn"
          onClick={() => setSpeed((s) => clampSpeed(s / 1.5))}
          disabled={isEnteringLab || isEnteringAbout || isEnteringContact || isEnteringProjects}
        >
          -
          <span className="sr-only">Slow down</span>
        </button>
        <button
          type="button"
          className="SpeedControls-btn"
          onClick={() => setSpeed(1)}
          disabled={isEnteringLab || isEnteringAbout || isEnteringContact || isEnteringProjects}
        >
          1x
          <span className="sr-only">Normal speed</span>
        </button>
        <button
          type="button"
          className="SpeedControls-btn"
          onClick={() => setSpeed((s) => clampSpeed(s * 1.5))}
          disabled={isEnteringLab || isEnteringAbout || isEnteringContact || isEnteringProjects}
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/laboratory" element={<Laboratory />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/projects" element={<Projects />} />
    </Routes>
  );
}

export default App;
