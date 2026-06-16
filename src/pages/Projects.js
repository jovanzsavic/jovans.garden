import './Projects.css';

import CelestialBackground from '../components/CelestialBackground';
import MarkdownViewer from '../components/MarkdownViewer';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const PLACEHOLDER_PROJECTS = [
  {
    id: 'fintech',
    title: 'SentinelFlow',
    date: '14.06.2026',
    md: '/projects/sentinelflow.md',
    excerpt: 'Crypto sanctions & AML screening console: deterministic tracing, zk-STARK proof-of-innocence fallbacks, and an analyst case-review console.',
  },
  {
    id: 'os1',
    title: 'RISC-V Multithreaded Kernel',
    date: '10.07.2024',
    md: '/projects/riscv-kernel.md',
    excerpt: 'Multithreaded, time-sharing RISC-V kernel: allocator, threads, semaphores and scheduler (educational).',
  },
  {
    id: 'os2',
    title: 'RAID Subsystem for xv6',
    date: '11.09.2025',
    md: '/projects/raid-xv6.md',
    excerpt: 'Kernel-level RAID implementation for xv6 supporting RAID0/1/4/5, runtime repair and recovery.',
  },
  {
    id: 'fsm-cpu',
    title: 'Finite State Machine CPU',
    date: '25.01.2026',
    md: '/projects/fsm-cpu.md',
    excerpt: 'FSM-based CPU RTL for Cyclone III/V with ALU, register file, synchronous memory and VGA/PS2 IO. Synthesis-ready.',
  },
  {
    id: 'lauzhack',
    title: 'Local Discovery',
    date: '27.11.2025',
    md: '/projects/local-discovery.md',
    excerpt: 'AI-powered local place discovery using OpenStreetMap with image fallbacks and a Leaflet UI.',
  },
  {
    id: 'mean',
    title: 'Booking2.',
    date: '24.9.2025',
    md: '/projects/cottage-reservation.md',
    excerpt: 'Full MEAN-stack cottage reservation platform with roles, calendar, image uploads and booking workflows.',
  },
  {
    id: 'saidkick',
    title: 'Saidkick',
    date: '24.04.2026',
    md: '/projects/saidkick.md',
    excerpt: 'IntelliJ plugin prototype embedding an LLM chat UI with env-driven configuration and in-session history.',
  },
  {
    id: 'surveillance',
    title: 'Surveillance System',
    date: '30.08.2025',
    md: '/projects/surveillance.md',
    excerpt: 'Python surveillance prototype: agents stream screen + audio to a supervisor with optional remote control.',
  },
];

export default function Projects() {
  const [showLeaveBlackout, setShowLeaveBlackout] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
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
          <p className="ProjectsSubtitle">Ember & Ash Twins — projects & experiments. See more on <a href="https://github.com/jovanzsavic" target="_blank" rel="noopener noreferrer">GitHub</a></p>
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
              <div className="ProjectText">
                <h3 className="ProjectTextTitle">{selected.title}</h3>
                <div className="ProjectTextDate">{selected.date}</div>
                <p className="ProjectTextExcerpt">{selected.excerpt}</p>
                {/* Render the README markdown for the selected project */}
                <MarkdownViewer src={selected.md} />
              </div>
            </article>
          </div>
        </section>
        <div className="ProjectsFooter">
          <a href="https://github.com/jovanzsavic" target="_blank" rel="noopener noreferrer">github.com/jovanzsavic</a>
        </div>
      </main>
    </div>
  );
}
