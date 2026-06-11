import './Projects.css';

import CelestialBackground from '../components/CelestialBackground';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moonImg from '../images/moon.png';

const PLACEHOLDER_PROJECTS = [
  {
    id: 'p1',
    title: 'Lunar Mapping',
    date: '2043-04-01',
    excerpt: 'Scanned a shallow crater rim. Equipment humming; faint radio blips recorded. Surface dust patterns suggest micro-geysers.',
    image: moonImg,
  },
  {
    id: 'p2',
    title: 'Static Relay',
    date: '2043-04-15',
    excerpt: 'Deployed a low-orbit relay. Signal drift noted at 03:12 UTC. Logged thermal variance and re-routed power to secondary buss.',
    image: moonImg,
  },
  {
    id: 'p3',
    title: 'Regolith Sample',
    date: '2043-05-02',
    excerpt: 'Collected sample from shaded basalt. Grain cohesion higher than predicted. Sample sealed and stored for return.',
    image: moonImg,
  },
];

export default function Projects() {
  const [isEntering, setIsEntering] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveBlackout, setShowLeaveBlackout] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
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

  const selected = PLACEHOLDER_PROJECTS[selectedIdx] || PLACEHOLDER_PROJECTS[0];

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
          <h2 className="sr-only">Projects</h2>

          <div className="ProjectsGrid">
            <aside className="ProjectsList" aria-label="Project list">
              <ul>
                {PLACEHOLDER_PROJECTS.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={`ProjectsListItem${i === selectedIdx ? ' is-active' : ''}`}
                      onClick={() => { setSelectedIdx(i); }}
                      aria-pressed={i === selectedIdx}
                    >
                      <div className="ProjectsListItemTitle">{p.title}</div>
                      <div className="ProjectsListItemDate">{p.date}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <article className="ProjectDetail" aria-live="polite">
              <figure className="ProjectFigure">
                <div className="ProjectImageWrap">
                  <img src={selected.image} alt={selected.title} className="ProjectImage" />
                  <div className="ImageBanner is-open">
                    <div className="JournalTitle">Mission Log — {selected.title}</div>
                    <div className="JournalDate">{selected.date} • ID {selected.id.toUpperCase()}</div>
                    <div className="JournalParagraph">{selected.excerpt}</div>
                    <div className="JournalParagraph">Entry recorded by field unit TW-7. Stored in local cache.</div>
                  </div>
                </div>
                <figcaption className="ProjectCaption sr-only">{selected.title} — {selected.date}</figcaption>
              </figure>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
