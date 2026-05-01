import React, { useEffect, useMemo, useRef, useState } from 'react';
import sunImg from '../images/sun.png';
import moonImg from '../images/moon.png';
import twinsImg from '../images/twins.png';
import timberHearthImg from '../images/timber heart.png';
import brittleHollowImg from '../images/brittle hollow.png';

/**
 * CelestialBackground
 * - Renders a rotating sun+moon ring (Terraria-ish vibe) using CSS gradients.
 * - Lets you drag the ring to reposition it with mouse/touch (pointer events).
 *
 * No external assets required; swap the .Celestial-sun/.Celestial-moon CSS later.
 */
export default function CelestialBackground({
  size = 520,
  daySeconds = 60,
  nightSeconds = 45,
  onPhaseChange,
  onCycle,
}) {
  const containerRef = useRef(null);

  // Looping cycle clock (0..1). 0..dayFrac is day, the rest is night.
  const [cycleT, setCycleT] = useState(0);

  const totalMs = (daySeconds + nightSeconds) * 1000;
  const dayFrac = daySeconds / (daySeconds + nightSeconds);

  // unique id for aria-describedby if you ever want it; stable across renders
  const helpId = useMemo(
    () => `celestial-help-${Math.random().toString(16).slice(2)}`,
    []
  );

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = (now - start) % totalMs;
      setCycleT(elapsed / totalMs);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalMs]);

  const isDay = cycleT < dayFrac;

  useEffect(() => {
    if (typeof onCycle === 'function') {
      onCycle({ t: cycleT, dayFrac });
    }
  }, [cycleT, dayFrac, onCycle]);

  useEffect(() => {
    if (typeof onPhaseChange === 'function') {
      onPhaseChange(isDay ? 'day' : 'night');
    }
  }, [isDay, onPhaseChange]);

  // Rotate full sky-orbit continuously. Day/night still drives the global tint,
  // but the sun+moon remain opposite each other like Terraria.
  const orbitDeg = cycleT * 360;

  // Optional: slightly dim the active body when "inactive" for flavor.
  const sunDim = '';
  const moonDim = '';

  // Spin sprites to “fake” rotation (especially useful for Twins/Timber Hearth).
  // Keep this independent of orbit direction so it reads as body rotation.
  const sunSpinStyle = { transform: `rotate(${orbitDeg}deg)` };

  // Planet orbits (Outer Wilds-ish)
  // NOTE: These are easy to tweak later: radius is in CSS via --r.
  const planets = useMemo(
    () => [
      {
        key: 'twins',
        name: 'Twins',
        img: twinsImg,
        className: 'Planet Planet--twins Planet--bodyTwins',
        radius: 240,
        size: 62,
        orbitSpeed: 0.56,
        spinSpeed: 1.32,
        phaseDeg: 110,
        dimClass: '',
      },
      {
        key: 'timber',
        name: 'Timber Hearth',
        img: timberHearthImg,
        className: 'Planet Planet--timber Planet--bodyTimber',
        radius: 320,
        size: 66,
        orbitSpeed: 0.41,
        spinSpeed: 1.08,
        phaseDeg: 230,
        dimClass: '',
      },
      {
        key: 'brittle',
        name: 'Brittle Hollow',
        img: brittleHollowImg,
        className: 'Planet Planet--brittle Planet--bodyBrittle',
        radius: 285,
        size: 72,
        orbitSpeed: 0.46,
        spinSpeed: 0.94,
        phaseDeg: 300,
        dimClass: '',
      },
      {
        key: 'moon',
        name: 'Moon',
        img: moonImg,
        className: 'Planet Planet--moon Planet--bodyMoon',
        radius: 150,
        size: 58,
        orbitSpeed: 0.92,
        spinSpeed: 1.18,
        phaseDeg: 0,
        dimClass: moonDim,
      },
    ],
    // moonDim changes with day/night
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [moonDim]
  );

  return (
    <div
      ref={containerRef}
      className="Celestial"
      role="img"
      aria-label="Rotating sun and moon background"
      aria-describedby={helpId}
    >
      <span id={helpId} className="sr-only">
        Rotating sun and moon background.
      </span>

      {/* Centered system: sun in the middle, everything else orbits around it */}
      <div className="Planetary" aria-hidden="true">
        <div className={`Sun ${sunDim}`} data-body="sun">
          <img
            className="Celestial-img"
            src={sunImg}
            alt=""
            draggable={false}
            style={sunSpinStyle}
          />
        </div>

        {planets.map((p) => {
          const oDeg = (cycleT * 360 * p.orbitSpeed + p.phaseDeg) % 360;
          const orbit = { transform: `rotate(${oDeg}deg)`, '--r': `${p.radius}px` };
          const spin = { transform: `rotate(${cycleT * 360 * p.spinSpeed}deg)` };

          return (
            <div key={p.key} className="Planet-orbit" style={orbit}>
              <div
                className={`${p.className} ${p.dimClass || ''}`}
                style={{ width: p.size, height: p.size }}
                title={p.name}
              >
                <img
                  className="Celestial-img"
                  src={p.img}
                  alt=""
                  draggable={false}
                  style={spin}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
