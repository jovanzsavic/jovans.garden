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
  focusKey,
  focusCenter = false,
  focusScale = 2.4,
  /**
   * When focusing a planet, we can optionally keep the rest of the system visible
   * until partway through the focus animation (useful for pre-navigation zooms).
   * - true: hide non-focused bodies immediately (default, existing behavior)
   * - false: never hide (only camera moves)
   */
  focusHideOthers = true,
  /**
   * If focusHideOthers is true, delay hiding until focusT >= this threshold.
   * 0 hides immediately, 1 hides only at the very end.
   */
  focusHideOthersAt = 0,
  /**
   * When focusing, optionally fade the entire scene (sun + all bodies) away.
   * This is useful when you want the zoom to transition into a new route.
   */
  focusDimAll = false,
  /**
   * Start dimming at this focus progress (0..1).
   */
  focusDimFrom = 0,
  /**
   * End dimming at this focus progress (0..1). At or after this point, opacity is 0.
   */
  focusDimTo = 1,
  /**
   * If true, the focused planet also participates in the global fade.
   * If false, the focused planet stays fully visible while everything else fades.
   */
  focusDimIncludeFocused = false,
  hideSun = false,
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

  // When focusing a body (e.g. on the Laboratory page), we smoothly animate a "camera"
  // transform so it feels like we zoomed toward that planet.
  const focus = useMemo(() => {
    if (!focusKey) return null;
    if (focusKey === 'sun') return { key: 'sun', radius: 0, size: 168, phaseDeg: 0, orbitSpeed: 0 };
    const p = planets.find((x) => x.key === focusKey);
    return p || null;
  }, [focusKey, planets]);

  const [focusT, setFocusT] = useState(0);
  useEffect(() => {
    if (!focus) {
      setFocusT(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 900; // ms

    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      // easeInOutCubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setFocusT(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [focusKey, focus]);

  // Compute the focused planet's current position (same math as render loop)
  // so we can translate the whole system in the opposite direction.
  // If focusCenter is true, we keep the focused body centered (no orbit motion).
  let cameraStyle = undefined;
  if (focus && focus.key !== 'sun') {
    // If focusCenter=true, we don't translate (we'll center the focused body directly).
    // But we still want to animate the zoom.
    let x = 0;
    let y = 0;
    if (!focusCenter) {
      const orbitOmega = focus.orbitSpeed * 0.165;
      const angle = simTimeSecRef.current * orbitOmega + (focus.phaseDeg * Math.PI) / 180;
      const ellipseY = 0.62;
      const pad = 26;
      const aMax = viewport.w / 2 - focus.size / 2 - pad;
      const bMax = viewport.h / 2 - focus.size / 2 - pad;
      const a = Math.max(30, Math.min(focus.radius, aMax));
      const b = Math.max(18, Math.min(focus.radius * ellipseY, bMax));
      x = a * Math.cos(angle);
      y = b * Math.sin(angle);
    }

    // zoom in and translate so the body moves toward the center
    // focusScale is the end-scale at focusT=1
    const scale = 1 + focusT * Math.max(0, focusScale - 1);
    const tx = -x * focusT;
    const ty = -y * focusT;
    cameraStyle = {
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
      transformOrigin: 'center',
      transition: 'none',
    };
  }

  // Optional global fade during focus.
  // IMPORTANT: we only apply inline opacity styles when fading is active,
  // otherwise we'd override CSS hover-dimming rules.
  const isFocusFading = !!(focus && focusDimAll);
  let focusSceneOpacity = 1;
  if (isFocusFading) {
    const from = Math.max(0, Math.min(1, focusDimFrom));
    const to = Math.max(from, Math.min(1, focusDimTo));
    const u = to === from ? 1 : (focusT - from) / (to - from);
    const t = Math.max(0, Math.min(1, u));
    focusSceneOpacity = 1 - t;
  }

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
      <div className="Planetary" aria-hidden="true" style={cameraStyle}>
        {!hideSun && (
          <div
            className={`Sun ${sunDim}`}
            data-body="sun"
            style={isFocusFading ? { opacity: focusSceneOpacity } : undefined}
          >
            <img
              className="Celestial-img"
              src={sunImg}
              alt=""
              draggable={false}
              style={sunSpinStyle}
            />
          </div>
        )}

        {planets.map((p) => {
          const isFocused = focus ? p.key === focus.key : false;
          // If we're focusing a specific body, hide the rest (they're already dimmed elsewhere,
          // but removing them makes the zoom feel like a real camera move).
          const shouldHideOthers =
            !!focus &&
            focusHideOthers &&
            focusT >= Math.max(0, Math.min(1, focusHideOthersAt));
          if (shouldHideOthers && !isFocused) return null;

          // True ellipse (not transform stacking):
          // x = a*cos(t), y = b*sin(t)
          // Also clamp `a`/`b` so the sprite never leaves the viewport.
          // Continuous motion: angle grows with monotonic sim time.
          // `orbitSpeed` here is treated as revolutions per minute-ish scale.
          // (We map it to radians/sec with a constant so existing values still feel right.)
          // ~70% slower baseline at 1.0x
          let x = 0;
          let y = 0;
          if (!focusCenter || (focus && isFocused && focusCenter)) {
            const orbitOmega = p.orbitSpeed * 0.165; // radians/sec scale
            const angle = simTimeSecRef.current * orbitOmega + (p.phaseDeg * Math.PI) / 180;
            const ellipseY = 0.62; // rounder ellipse (closer to a circle)
            const pad = 26;
            const aMax = viewport.w / 2 - p.size / 2 - pad;
            const bMax = viewport.h / 2 - p.size / 2 - pad;
            const a = Math.max(30, Math.min(p.radius, aMax));
            const b = Math.max(18, Math.min(p.radius * ellipseY, bMax));
            x = a * Math.cos(angle);
            y = b * Math.sin(angle);
          }

          // In focusCenter mode we want ONLY the focused planet to sit at the center.
          // Other planets will continue to orbit normally (unless hidden via focusHideOthers).
          if (focusCenter && focus && isFocused) {
            x = 0;
            y = 0;
          }

          // Depth ordering (reversed): if a body is "above" the sun (smaller y), render it behind.
          // If it's "below" (larger y), render it in front.
          const zIndex = y < 0 ? 1 : 3;

          const orbit = { transform: `translate3d(${x}px, ${y}px, 0)`, zIndex };
          const spinOmega = p.spinSpeed * 0.07; // radians/sec scale (much slower self-spin)
          const spin = { transform: `rotate(${simTimeSecRef.current * spinOmega}rad)` };

          let planetOpacity;
          if (isFocusFading) {
            planetOpacity = isFocused
              ? focusDimIncludeFocused
                ? focusSceneOpacity
                : 1
              : focusSceneOpacity;
          }

          return (
            <div key={p.key} className="Planet-orbit" style={orbit}>
              <div
                className={`${p.className} ${p.dimClass || ''}`}
                style={{
                  width: p.size,
                  height: p.size,
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                  ...(isFocusFading ? { opacity: planetOpacity } : null),
                }}
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
