import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

interface PremiumSplashScreenProps {
  onComplete: () => void;
}

export const PremiumSplashScreen: React.FC<PremiumSplashScreenProps> = ({ onComplete }) => {
  const [show, setShow] = useState<boolean>(true);
  const [audioPlayed, setAudioPlayed] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Soft Ambient Acoustic Chime
  const playSymphonyChime = (force = false) => {
    if (muted && !force) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Warm acoustic bass pad
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65.41, now); // C2
      subOsc.frequency.exponentialRampToValueAtTime(130.81, now + 1.0);

      const subFilter = ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(200, now);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(ctx.destination);

      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(0.08, now + 0.2);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      subOsc.start(now);
      subOsc.stop(now + 2.5);

      // Polyphonic warm glass bells
      const playNote = (freq: number, delay: number, vol: number, dur: number) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);

        g.gain.setValueAtTime(0, now + delay);
        g.gain.linearRampToValueAtTime(vol, now + delay + 0.05);
        g.gain.exponentialRampToValueAtTime(0.00001, now + delay + dur);

        osc.connect(g);
        g.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + dur + 0.1);
      };

      playNote(523.25, 0.00, 0.06, 1.8); // C5
      playNote(659.25, 0.12, 0.07, 2.0); // E5
      playNote(783.99, 0.24, 0.08, 2.2); // G5
      playNote(1046.50, 0.38, 0.06, 2.4); // C6

      setAudioPlayed(true);
    } catch (e) {
      console.warn('Startup sound skipped:', e);
    }
  };

  // Subtle ambient backdrop canvas with soft floating light dust
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Particle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.5 + 0.5;
        this.speedY = -(Math.random() * 0.3 + 0.1);
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
      }

      update() {
        this.y += this.speedY;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }

        this.opacity += this.fadeSpeed;
        if (this.opacity >= 0.6 || this.opacity <= 0.1) {
          this.fadeSpeed = -this.fadeSpeed;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = `rgba(52, 211, 153, ${this.opacity})`;
        c.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      // Solid rich midnight background
      ctx.fillStyle = '#061019';
      ctx.fillRect(0, 0, width, height);

      // Soft center vignette
      const grad = ctx.createRadialGradient(
        width / 2, height * 0.45, 20,
        width / 2, height * 0.45, Math.max(width, height) * 0.6
      );
      grad.addColorStop(0, 'rgba(4, 120, 87, 0.2)');
      grad.addColorStop(0.5, 'rgba(6, 78, 59, 0.07)');
      grad.addColorStop(1, 'rgba(6, 16, 25, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Natural App Entry Timing (~2.2s clean splash)
  useEffect(() => {
    const audioTimer = setTimeout(() => {
      playSymphonyChime();
    }, 120);

    const exitTimer = setTimeout(() => {
      setShow(false);
    }, 2100);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2550);

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {show ? (
        <motion.div
          key="splash-screen-clean"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.02,
            transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } 
          }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-between overflow-hidden bg-[#061019] text-white select-none cursor-pointer"
          onClick={() => {
            if (!audioPlayed) {
              playSymphonyChime(true);
            } else {
              setShow(false);
              setTimeout(onComplete, 250);
            }
          }}
        >
          {/* Subtle Canvas Backdrop */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none block z-0" />

          {/* Top Bar: Absolutely NO text, only a discreet muted audio icon */}
          <div className="w-full max-w-4xl px-6 py-5 flex items-center justify-end z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMuted(!muted);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title={muted ? "সাউন্ড অন করুন" : "মিউট করুন"}
              aria-label="সাউন্ড মিউট বা আনমিউট করুন"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400/80" />}
            </button>
          </div>

          {/* Center Brand Identity (Focused, Pure, Clean) */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 z-10 w-full max-w-md my-auto">
            
            {/* Iconic City Emblem */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              {/* Soft ambient glow */}
              <div className="absolute inset-0 -m-3 rounded-3xl bg-emerald-500/15 blur-xl pointer-events-none" />

              <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-800 p-[1.5px] shadow-xl shadow-emerald-950/60">
                <div className="w-full h-full rounded-[14px] bg-[#081822] flex flex-col items-center justify-center">
                  
                  {/* Syedpur Connect Geometric Node Symbol */}
                  <svg 
                    className="w-10 h-10 text-emerald-400" 
                    viewBox="0 0 40 40" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M10 28C10 20 14 14 20 14C26 14 30 20 30 28" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M8 30H32" 
                      stroke="#34D399" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                    />
                    <circle cx="20" cy="14" r="3" fill="#34D399" />
                    <circle cx="10" cy="28" r="2.5" fill="#38BDF8" />
                    <circle cx="30" cy="28" r="2.5" fill="#38BDF8" />
                    <circle cx="20" cy="22" r="2" fill="#F59E0B" />
                  </svg>

                </div>
              </div>
            </motion.div>

            {/* Main Bangla Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              className="text-3xl sm:text-4xl font-black text-white tracking-wide leading-tight"
            >
              আমার কুষ্টিয়া
            </motion.h1>

            {/* Clean Sub-title */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-xs sm:text-sm font-black tracking-[0.2em] text-emerald-400 uppercase mt-1"
            >
              AMAR KUSHTIA
            </motion.p>

          </div>

          {/* Bottom Area: NO unnecessary text whatsoever, only a minimal 3-dot micro pulsing loader */}
          <div className="w-full max-w-sm px-6 pb-12 sm:pb-16 flex flex-col items-center justify-center z-10">
            <div className="flex items-center gap-2 py-2">
              <motion.span 
                animate={{ scale: [1, 1.35, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              <motion.span 
                animate={{ scale: [1, 1.35, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              <motion.span 
                animate={{ scale: [1, 1.35, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
            </div>
          </div>

        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
