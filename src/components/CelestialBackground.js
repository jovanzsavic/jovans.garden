import React, { useEffect, useMemo, useRef, useState } from 'react';
import sunImg from '../images/sun.png';
import twinsImg from '../images/twins.png';
import timberHearthImg from '../images/timber heart.png';
import brittleHollowImg from '../images/brittle hollow.png';
import giantsDeepImg from '../images/giants deep.png';
import darkBrambleImg from '../images/dark bramble.png';

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
  speed = 1,
  onPhaseChange,
  onCycle,
}) {
  const containerRef = useRef(null);
  const simTimeSecRef = useRef(0);
  const lastNowRef = useRef(0);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });

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
    const now0 = performance.now();
    if (!lastNowRef.current) lastNowRef.current = now0;

    const tick = (now) => {
      const last = lastNowRef.current || now;
      const dt = Math.min(64, Math.max(0, now - last));
      lastNowRef.current = now;

      const sp = Number.isFinite(speed) ? Math.max(0, speed) : 1;
      simTimeSecRef.current += (dt * sp) / 1000;
      // Cycle for optional callbacks/tint (0..1). Motion does NOT depend on this.
      const t = (simTimeSecRef.current / (totalMs / 1000)) % 1;
      setCycleT(t < 0 ? t + 1 : t);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalMs, speed]);

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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

  // Optional: slightly dim the active body when "inactive" for flavor.
  const sunDim = '';

  // Spin sprites to “fake” rotation (especially useful for Twins/Timber Hearth).
  // Keep this independent of orbit direction so it reads as body rotation.
  // Slower overall rotation to match calmer orbit pace
  const sunSpinStyle = { transform: `rotate(${simTimeSecRef.current * 9}deg)` };

  // Planet orbits (Outer Wilds-ish)
  // NOTE: These are easy to tweak later: radius is in CSS via --r.
  const planets = useMemo(
    () => [
      {
        key: 'twins',
        name: 'Twins',
        img: twinsImg,
        className: 'Planet Planet--twins Planet--bodyTwins',
        radius: 130,
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
        radius: 175,
        size: 68,
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
        radius: 225,
        size: 72,
        orbitSpeed: 0.46,
        spinSpeed: 0.94,
        phaseDeg: 300,
        dimClass: '',
      },
      {
        key: 'giants',
        name: "Giant's Deep",
        img: giantsDeepImg,
        className: 'Planet Planet--giants Planet--bodyGiants',
        radius: 410,
        size: 154,
        orbitSpeed: 0.19,
        spinSpeed: 0.72,
        phaseDeg: 30,
        dimClass: '',
      },
      {
        key: 'bramble',
        name: 'Dark Bramble',
        img: darkBrambleImg,
        className: 'Planet Planet--bramble Planet--bodyBramble',
        radius: 470,
        size: 104,
        orbitSpeed: 0.19,
        spinSpeed: 0.55,
        phaseDeg: 165,
        dimClass: '',
      },
    ],
    []
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
          // True ellipse (not transform stacking):
          // x = a*cos(t), y = b*sin(t)
          // Also clamp `a`/`b` so the sprite never leaves the viewport.
          // Continuous motion: angle grows with monotonic sim time.
          // `orbitSpeed` here is treated as revolutions per minute-ish scale.
          // (We map it to radians/sec with a constant so existing values still feel right.)
          // ~70% slower baseline at 1.0x
          const orbitOmega = p.orbitSpeed * 0.165; // radians/sec scale
          const angle = simTimeSecRef.current * orbitOmega + (p.phaseDeg * Math.PI) / 180;
          const ellipseY = 0.62; // rounder ellipse (closer to a circle)
          const pad = 26;
          const aMax = viewport.w / 2 - p.size / 2 - pad;
          const bMax = viewport.h / 2 - p.size / 2 - pad;
          const a = Math.max(30, Math.min(p.radius, aMax));
          const b = Math.max(18, Math.min(p.radius * ellipseY, bMax));
          const x = a * Math.cos(angle);
          const y = b * Math.sin(angle);

          // Depth ordering (reversed): if a body is "above" the sun (smaller y), render it behind.
          // If it's "below" (larger y), render it in front.
          const zIndex = y < 0 ? 1 : 3;

          const orbit = { transform: `translate3d(${x}px, ${y}px, 0)`, zIndex };
          const spinOmega = p.spinSpeed * 0.07; // radians/sec scale (much slower self-spin)
          const spin = { transform: `rotate(${simTimeSecRef.current * spinOmega}rad)` };

          return (
            <div key={p.key} className="Planet-orbit" style={orbit}>
              <div
                className={`${p.className} ${p.dimClass || ''}`}
                style={{ width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
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
