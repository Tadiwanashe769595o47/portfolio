import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, Github, Linkedin, Mail, Cpu, Code, Terminal, Database, Sparkles, FileText, Award, BookOpen, Globe, Briefcase, GraduationCap, AppWindow, FileBadge, Server, MessageCircle, HeartHandshake, Phone } from 'lucide-react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

import { cn } from './lib/utils';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

function ShineBorder({
  borderRadius = 32,
  borderWidth = 2,
  duration = 4,
  color = ["#4285F4", "#9b51e0", "#e91e63", "#f4b400", "#0f9d58", "#4285F4"],
  className,
  children,
}: {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: string | string[];
  className?: string;
  children: React.ReactNode;
}) {
  const colors = Array.isArray(color) ? color.join(", ") : color;
  
  return (
    <div
      style={{
        "--border-radius": `${borderRadius}px`,
        "--border-width": `${borderWidth}px`,
      } as React.CSSProperties}
      className={cn(
        "relative h-full w-full rounded-[--border-radius] overflow-hidden p-[--border-width] bg-white/5",
        className,
      )}
    >
      {/* Animated Border Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div
          style={{
            "--duration": `${duration}s`,
            background: `conic-gradient(from 0deg, ${colors})`,
          } as React.CSSProperties}
          className={cn(
            "w-[300%] aspect-square animate-[rotate_var(--duration)_linear_infinite]",
            "opacity-100 blur-[1px]"
          )}
        ></div>
      </div>
      
      {/* Inner Content Layer */}
      <div 
        className="relative z-10 w-full h-full bg-[#050505] rounded-[calc(var(--border-radius)-var(--border-width))] overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("h-full", className)}
    >
      <ShineBorder 
        borderRadius={32} 
        color={["#4285F4", "#9b51e0", "#e91e63", "#f4b400", "#0f9d58", "#4285F4"]} 
        duration={4} 
        borderWidth={2}
      >
        <div className="p-8 relative z-10 h-full">
          {children}
        </div>
      </ShineBorder>
    </motion.div>
  );
};

const SectionHeading = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-3 mb-10">
    <div className="p-3 bg-surface border border-border rounded-xl">
      <Icon className="text-muted" size={24} />
    </div>
    <h2 className="text-4xl font-bold tracking-tight font-display">{title}</h2>
  </div>
);

const SafeImage = ({ src, alt, className, fallbackText, ...props }: any) => {
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    const initials = alt
      ?.split(' ')
      .filter(Boolean)
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || '??';

    return (
      <div className={`${className} flex items-center justify-center bg-surface border border-border text-muted text-[10px] font-bold uppercase p-1 text-center overflow-hidden`}>
        {fallbackText || initials}
      </div>
    );
  }

  let resolvedSrc = src;
  
  if (src.startsWith('http')) {
    // For external logos, use Google Favicon service as primary fallback for Clearbit
    if (src.includes('logo.clearbit.com')) {
      const domain = src.split('/').pop();
      resolvedSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
  } else {
    // For local images, ensure they start with /
    resolvedSrc = src.startsWith('/') ? src : `/${src}`;
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
};


export default function App() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], [0, 150]);
  const glowY = useTransform(scrollY, [0, 1000], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 50]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 100, damping: 30 });
  const heroRotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const heroRotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;
    mouseX.set(mX / width - 0.5);
    mouseY.set(mY / height - 0.5);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black pb-24 font-sans">
      {/* Particles Background */}
      {init && (
        <Particles
          id="tsparticles"
          className="fixed inset-0 z-0 pointer-events-none"
          options={{
            fullScreen: { enable: false },
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 0.5,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 40,
              },
              opacity: {
                value: 0.2,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 2 },
              },
            },
            detectRetina: true,
          }}
        />
      )}

      {/* Background Parallax */}
      <motion.div style={{ y: bgY }} className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-40" />
      <motion.div style={{ y: glowY }} className="fixed inset-0 glow-effect z-0" />

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-nav rounded-full px-2 py-2 hidden md:flex items-center gap-1 md:gap-2 shadow-2xl">
        <a href="#" className="px-5 py-2.5 rounded-full text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 transition-all">Home</a>
        <a href="#experience" className="px-5 py-2.5 rounded-full text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 transition-all">Experience</a>
        <a href="#projects" className="px-5 py-2.5 rounded-full text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 transition-all">Projects</a>
        <a href="#research" className="px-5 py-2.5 rounded-full text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 transition-all">Research & Education</a>
        <a href="#contact" className="px-5 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-all ml-2">
          Let's Talk
        </a>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-24 md:pt-32 space-y-24 md:space-y-32">
        
        {/* Hero Section */}
        <motion.section 
          style={{ opacity: heroOpacity, y: heroY, perspective: 1200 }} 
          className="relative py-20 flex flex-col items-center justify-center text-center min-h-[90vh] w-full"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          {/* Spline 3D Embed as Background */}
          <div className="absolute inset-0 w-[100vw] left-1/2 -translate-x-1/2 z-0 overflow-hidden pointer-events-auto">
            <iframe 
              src="https://my.spline.design/bentocardscopycopy-kpccyHyBzyplIs4Cz8WbLIZ3-CVV/" 
              frameBorder="0" 
              width="100%" 
              height="100%" 
              className="w-full h-full scale-100 origin-center"
              title="Spline 3D Interactive Design"
            ></iframe>
            {/* Dark Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[0.5px] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background z-10 pointer-events-none" />
          </div>

          <motion.div style={{ rotateX: heroRotateX, rotateY: heroRotateY, transformStyle: "preserve-3d" }} className="z-20 relative flex flex-col items-center mt-12">
            <FadeIn>
              <div style={{ transform: "translateZ(20px)" }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 border border-border text-sm font-medium mb-8 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Nanjing, China & Zimbabwe · Open to Global Roles
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div style={{ transform: "translateZ(60px)" }}>
                <motion.h1 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 font-display drop-shadow-2xl leading-tight max-w-4xl mx-auto"
                  style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.5)" }}
                >
                  Tadiwanashe Brenda Chitsva
                </motion.h1>
                <p className="text-lg md:text-xl text-white/60 font-medium tracking-[0.2em] uppercase mb-8 max-w-2xl mx-auto">
                  Embedded Systems · Information & Communication · Optical Systems · Autonomous AI Agents
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ transform: "translateZ(40px)" }} className="flex flex-wrap items-center justify-center gap-4">
                <a href="#projects" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                  View Projects <ArrowUpRight size={20} />
                </a>
                <a href="#about" className="inline-flex items-center justify-center gap-2 bg-surface/80 backdrop-blur-md border border-border px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                  About Me
                </a>
              </div>
            </FadeIn>
          </motion.div>
        </motion.section>

        {/* Intro & Skills Bento */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <FadeIn delay={0.3} className="md:col-span-2 lg:col-span-2">
            <Card className="h-full flex flex-col justify-between group">
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-border shrink-0 shadow-xl">
                    <img loading="lazy" src="/profile.jpg" alt="Tadiwanashe Brenda Chitsva" className="w-full h-full object-cover bg-surface-hover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="text-accent" size={20} />
                      <span className="text-accent font-medium tracking-wide uppercase text-sm">About Me</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display">Engineering robust, secure, and autonomous systems.</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-xs font-bold">MSc Information & Communication Engineering</span>
                      <span className="px-3 py-1 bg-white/5 text-white/60 border border-white/10 rounded-full text-xs font-bold">NUIST, China</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 text-muted leading-relaxed text-lg">
                  <p className="text-xl text-accent font-light mb-6">
                    Information and Communication Engineer & Electronic Engineer. Specializing in embedded systems, optical systems, nanotechnology, and autonomous AI agents.
                  </p>
                  <p>
                    I bring a rigorous, systems-level engineering approach to complex technological challenges. My <strong>First-Class B.Tech in Electronic Engineering (HIT)</strong> forged my expertise in low-level hardware, embedded systems, and strict <strong>systems auditing</strong>. My <strong>MSc in Information & Communication Engineering (NUIST)</strong> from <strong>Nanjing University of Information Science and Technology in China</strong> elevated this foundation into complex network architectures, advanced <strong>software engineering</strong>, and cutting-edge <strong>nanotechnology</strong>.
                  </p>
                  <p>
                    I don't just write code; I architect, audit, and secure end-to-end systems. By bridging physical infrastructure with intelligent software, I ensure that every platform—from <strong>optical sensing systems</strong> to <strong>autonomous AI agents</strong>—is architecturally sound and secure by design.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors">
                  Contact Me <ArrowUpRight size={18} />
                </a>
                <a href="#" className="inline-flex items-center justify-center gap-2 bg-surface border border-border px-6 py-3 rounded-full font-medium hover:bg-white/5 transition-colors">
                  <FileText size={18} /> Resume
                </a>
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.4} className="md:col-span-1 lg:col-span-1">
            <Card className="h-full flex flex-col">
              <h3 className="text-2xl font-bold tracking-tight mb-6 font-display">Technical Arsenal</h3>
              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <Sparkles className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Optical Systems & Nanotechnology</p>
                    <p className="text-xs text-muted">Nanoplasmonic sensing, refractive index sensing, COMSOL FDTD, biosensors</p>
                  </div>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <Terminal className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Autonomous AI Agents</p>
                    <p className="text-xs text-muted">Manus, Antigravity, Cursor, Claude, Gemini, OpenClaw, Docker, n8n</p>
                  </div>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <Code className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Software Engineering</p>
                    <p className="text-xs text-muted">Full-stack web, AI-assisted dev, scalable architectures</p>
                  </div>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <FileBadge className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Systems Auditing & Security</p>
                    <p className="text-xs text-muted">Code review, vulnerability assessment, architecture auditing</p>
                  </div>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <Cpu className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Electronic Engineering</p>
                    <p className="text-xs text-muted">Embedded Systems, C/C++, ESP32, ROS2, PLCs</p>
                  </div>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <Database className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Engineering Software</p>
                    <p className="text-xs text-muted">MATLAB, OpenCV, COMSOL, Proteus, Siemens (PLC)</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.5} className="md:col-span-1 lg:col-span-1">
            <Card className="h-full flex flex-col">
              <h3 className="text-2xl font-bold tracking-tight mb-6 font-display">Linguistic Versatility</h3>
              <div className="space-y-4 flex-1">
                <div className="p-4 bg-background/50 border border-border rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Shona</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Native</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="bg-accent h-full" 
                    />
                  </div>
                </div>
                <div className="p-4 bg-background/50 border border-border rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">English</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">C1 (Expert)</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "95%" }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="bg-accent h-full" 
                    />
                  </div>
                </div>
                <div className="p-4 bg-background/50 border border-border rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Chinese (Mandarin)</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">HSK 3 (Fluent)</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "65%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="bg-accent h-full" 
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted italic flex items-center gap-2">
                  <Globe size={14} className="text-accent" /> Bridge builder in global engineering teams.
                </p>
              </div>
            </Card>
          </FadeIn>
        </section>

        {/* Recognition, Impact & Affiliations */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Awards & Honors */}
            <FadeIn delay={0.1} className="lg:col-span-2">
              <Card className="h-full">
                <h3 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-3 font-display"><Award className="text-accent"/> Awards & Honors</h3>
                <div className="grid sm:grid-cols-2 gap-8">
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="mt-1 shrink-0"><SafeImage src="https://logo.clearbit.com/hit.ac.zw" alt="HIT Logo" className="w-8 h-8 rounded bg-white object-contain p-0.5" /></div>
                      <div>
                        <h4 className="font-bold">Emerson Dambudzo Mnangagwa Chancellor's Award</h4>
                        <p className="text-sm text-muted">Overall Best Graduating Female Student ($1000 prize). Awarded at Harare Institute of Technology, Zimbabwe (2023).</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="mt-1 shrink-0"><SafeImage src="https://logo.clearbit.com/hit.ac.zw" alt="HIT Logo" className="w-8 h-8 rounded bg-white object-contain p-0.5" /></div>
                      <div>
                        <h4 className="font-bold">Vice Chancellor's Award</h4>
                        <p className="text-sm text-muted">Best Graduating Female Student in Electronics Engineering. Awarded at Harare Institute of Technology, Zimbabwe (2023).</p>
                      </div>
                    </li>
                  </ul>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="mt-1 shrink-0"><SafeImage src="https://logo.clearbit.com/nuist.edu.cn" alt="NUIST Logo" className="w-8 h-8 rounded bg-white object-contain p-0.5" /></div>
                      <div>
                        <h4 className="font-bold">NUIST Excellent Freshman Scholarship</h4>
                        <p className="text-sm text-muted">1st Class Scholarship based on merit. Awarded by Nanjing University of Information Science and Technology (NUIST) (2023–2025).</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="mt-1 shrink-0"><SafeImage src="https://unavatar.io/duckduckgo/zim.gov.zw" alt="Zimbabwe Govt Logo" className="w-8 h-8 rounded bg-white object-contain p-0.5" /></div>
                      <div>
                        <h4 className="font-bold">STEM Scholarship Zimbabwe</h4>
                        <p className="text-sm text-muted">Recognizing STEM academic promise. Awarded by the Government of Zimbabwe (2016-2018).</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </Card>
            </FadeIn>

            {/* Professional Affiliations */}
            <FadeIn delay={0.2} className="lg:col-span-1">
              <Card className="h-full">
                <h3 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3 font-display"><Globe className="text-accent"/> Affiliations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-background/50 border border-border rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <SafeImage src="https://unavatar.io/duckduckgo/nspe.org" alt="NSPE Logo" className="w-8 h-8 rounded bg-white object-contain p-1" />
                      <h4 className="font-bold text-sm">NSPE Member</h4>
                    </div>
                    <p className="text-xs text-muted">National Society of Professional Engineers. ID: 301173445</p>
                  </div>
                  <div className="p-4 bg-background/50 border border-border rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <SafeImage src="https://unavatar.io/duckduckgo/ieee.org" alt="IEEE Logo" className="w-8 h-8 rounded bg-white object-contain p-1" />
                      <h4 className="font-bold text-sm">IEEE Student Member</h4>
                    </div>
                    <p className="text-xs text-muted">Member ID: 101231198. Robotics & Automation Society.</p>
                  </div>
                  <div className="p-4 bg-background/50 border border-border rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <SafeImage src="https://unavatar.io/duckduckgo/ewb.org.za" alt="EWBSA Logo" className="w-8 h-8 rounded bg-white object-contain p-1" />
                      <h4 className="font-bold text-sm">EWBSA Member</h4>
                    </div>
                    <p className="text-xs text-muted">Engineers Without Borders South Africa.</p>
                  </div>
                </div>
              </Card>
            </FadeIn>

            {/* Certifications */}
            <FadeIn delay={0.3} className="lg:col-span-1">
              <Card className="h-full">
                <h3 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-3 font-display"><FileBadge className="text-accent"/> Certifications</h3>
                <ul className="space-y-4">
                  <li className="p-4 bg-background/50 border border-border rounded-xl">
                    <h4 className="font-bold text-sm mb-1">AI Fluency: Frameworks</h4>
                    <p className="text-xs text-muted">Anthropic Education</p>
                  </li>
                  <li className="p-4 bg-background/50 border border-border rounded-xl">
                    <h4 className="font-bold text-sm mb-1">Quantum Computing</h4>
                    <p className="text-xs text-muted">IBM SkillsBuild & Udemy</p>
                  </li>
                  <li className="p-4 bg-background/50 border border-border rounded-xl">
                    <h4 className="font-bold text-sm mb-1">PTE Academic: 90/90</h4>
                    <p className="text-xs text-muted">Elite English Proficiency</p>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted italic">Full certification documents available in the Education section below.</p>
                </div>
              </Card>
            </FadeIn>

            {/* Leadership & Global Impact */}
            <FadeIn delay={0.4} className="lg:col-span-2">
              <Card className="h-full">
                <h3 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-3 font-display"><HeartHandshake className="text-accent"/> Leadership & Global Impact</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white shrink-0 flex items-center justify-center p-1"><SafeImage src="https://ui-avatars.com/api/?name=FFA&background=0D8ABC&color=fff" alt="FFA" /></div>
                      <div>
                        <h4 className="font-bold text-sm">Online English Tutor</h4>
                        <p className="text-xs text-accent mb-1">Free Fluency Academy · USA</p>
                        <p className="text-xs text-muted">Implemented innovative learning technologies to boost student fluency globally.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white shrink-0 flex items-center justify-center p-1"><SafeImage src="https://ui-avatars.com/api/?name=BHI&background=0D8ABC&color=fff" alt="BHI" /></div>
                      <div>
                        <h4 className="font-bold text-sm">Education Advisor</h4>
                        <p className="text-xs text-accent mb-1">Brave Hearts International · Japan</p>
                        <p className="text-xs text-muted">Mentored students through international applications and academic pathways.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white shrink-0 flex items-center justify-center p-1"><SafeImage src="https://ui-avatars.com/api/?name=MCC&background=0D8ABC&color=fff" alt="MCC" /></div>
                      <div>
                        <h4 className="font-bold text-sm">Communications Committee</h4>
                        <p className="text-xs text-accent mb-1">Methodist Community Church · Zim</p>
                        <p className="text-xs text-muted">Managed internal/external communications and community engagement strategies.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl">
                      <p className="text-xs font-medium text-accent italic">"Committed to leveraging technology for social good and educational empowerment across borders."</p>
                    </div>
                  </div>
                </div>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience">
          <FadeIn>
            <SectionHeading title="Work Experience" icon={Briefcase} />
          </FadeIn>
          <div className="grid grid-cols-1 gap-6">
            <FadeIn delay={0.1}>
              <Card>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                  <div className="flex items-center gap-4">
                    <SafeImage src="https://ui-avatars.com/api/?name=Unito+Video&background=0D8ABC&color=fff" alt="Unito Video Logo" className="w-12 h-12 rounded-lg bg-white" />
                    <div>
                      <h3 className="text-3xl font-bold tracking-tight font-display">Information Technologist</h3>
                      <p className="text-accent text-lg">Unito Video (Anyiculture) · Wuhan, China</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted font-mono bg-white/5 px-3 py-1 rounded-full w-fit">Oct 2025 - March 2026</span>
                </div>
                <ul className="space-y-4 text-muted mt-4">
                  <li><strong className="text-foreground">Objective:</strong> Manage website development, network systems, and streamline operations.</li>
                  <li><strong className="text-foreground">Action:</strong> Developed agentic workflows using OpenClaw, Cursor, Claude, and Antigravity, while ensuring high availability for critical operations.</li>
                  <li><strong className="text-foreground">Result:</strong> Successfully automated complex business processes, reducing manual overhead and ensuring high availability for critical operations.</li>
                </ul>
              </Card>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6">
              <FadeIn delay={0.2}>
                <Card className="h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <SafeImage src="https://logo.clearbit.com/zimswitch.co.zw" alt="Zimswitch Logo" className="w-12 h-12 rounded-lg bg-white" />
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight font-display">IT Support Intern</h3>
                      <p className="text-accent">Zimswitch Technologies Pvt Ltd · Zimbabwe</p>
                      <span className="text-xs text-muted font-mono mt-1 block">Jan 2022 - Jan 2023</span>
                    </div>
                  </div>
                  <ul className="space-y-4 text-sm text-muted mt-4">
                    <li><strong className="text-foreground">Objective:</strong> Ensure high availability and seamless operation of the national payment switching infrastructure, supporting over 500,000 daily active users.</li>
                    <li><strong className="text-foreground">Action:</strong> Streamlined complex banking partner integrations, leveraged advanced PostgreSQL analytics for data-driven insights, and executed critical firmware and security updates.</li>
                    <li><strong className="text-foreground">Result:</strong> Successfully deployed AI/ML models to optimize data pipelines, yielding a 3% improvement in processing efficiency while maintaining a secure environment with zero critical vulnerabilities.</li>
                  </ul>
                </Card>
              </FadeIn>
              <FadeIn delay={0.3}>
                <Card className="h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <SafeImage src="https://logo.clearbit.com/zimswitch.co.zw" alt="Zimswitch Logo" className="w-12 h-12 rounded-lg bg-white" />
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight font-display">Customer Service Agent</h3>
                      <p className="text-accent">Zimswitch Technologies Pvt Ltd · Zimbabwe</p>
                      <span className="text-xs text-muted font-mono mt-1 block">Jan 2022 - Jan 2023</span>
                    </div>
                  </div>
                  <ul className="space-y-4 text-sm text-muted mt-4">
                    <li><strong className="text-foreground">Objective:</strong> Improve customer support resolution times and maintain high data quality.</li>
                    <li><strong className="text-foreground">Action:</strong> Facilitated data quality operations on customer databases and monitored system performance using BI tools.</li>
                    <li><strong className="text-foreground">Result:</strong> Achieved a 3-5% increase in issue resolution efficiency through analytical precision and proactive support.</li>
                  </ul>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Projects & Apps */}
        <section id="projects">
          <FadeIn>
            <SectionHeading title="Apps & Engineering Projects" icon={AppWindow} />
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <Card className="group h-full flex flex-col">
                <div className="w-full h-48 bg-surface-hover rounded-xl mb-6 overflow-hidden relative border border-border">
                  <img loading="lazy" src="/anyiculture-screenshot.jpg" alt="Anyiculture" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-400 border border-green-500/30">Solo AI Developer</div>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full">Web Dev</span>
                  <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full">AI Tools</span>
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4 font-display">Anyiculture.com</h3>
                <div className="space-y-3 text-sm text-muted mb-6 flex-1">
                  <p><strong className="text-foreground">Objective:</strong> Build a comprehensive digital platform for agricultural management.</p>
                  <p><strong className="text-foreground">Action:</strong> Single-handedly engineered the full-stack architecture, UI, and complex functionality using advanced AI-assisted workflows.</p>
                  <p><strong className="text-foreground">Result:</strong> Delivered a scalable, high-performance web application serving agricultural stakeholders.</p>
                </div>
                <a href="https://www.anyiculture.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all w-fit">
                  Visit Website <ArrowUpRight size={16} className="text-muted group-hover:text-white transition-colors" />
                </a>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card className="group h-full flex flex-col">
                <div className="w-full h-48 bg-surface-hover rounded-xl mb-6 overflow-hidden relative border border-border">
                  <img loading="lazy" src="/lycore-screenshot.jpg" alt="Lycore" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-400 border border-green-500/30">Solo AI Developer</div>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full">Web Dev</span>
                  <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full">Platform</span>
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4 font-display">Lycore.org</h3>
                <div className="space-y-3 text-sm text-muted mb-6 flex-1">
                  <p><strong className="text-foreground">Objective:</strong> Create an engaging and robust organizational web platform.</p>
                  <p><strong className="text-foreground">Action:</strong> Acted as the sole architect and developer, building a highly scalable infrastructure independently.</p>
                  <p><strong className="text-foreground">Result:</strong> Launched a sleek, responsive platform that elevated the organization's digital presence and user experience.</p>
                </div>
                <a href="https://lycore.org" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all w-fit">
                  Visit Website <ArrowUpRight size={16} className="text-muted group-hover:text-white transition-colors" />
                </a>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card className="group h-full flex flex-col">
                <div className="w-full h-48 bg-surface-hover rounded-xl mb-6 overflow-hidden relative border border-border">
                  <img loading="lazy" src="/igcse-screenshot.jpg" alt="IGCSE Study App" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-400 border border-green-500/30">Solo AI Developer</div>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full">EdTech</span>
                  <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full">App Dev</span>
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4 font-display">IGCSE Study App</h3>
                <div className="space-y-3 text-sm text-muted mb-6 flex-1">
                  <p><strong className="text-foreground">Objective:</strong> Provide an accessible, interactive study companion for IGCSE students.</p>
                  <p><strong className="text-foreground">Action:</strong> Single-handedly developed a dedicated educational application, integrating interactive materials and complete backend architecture.</p>
                  <p><strong className="text-foreground">Result:</strong> Empowered students with a 24/7 study tool, improving engagement and test readiness.</p>
                </div>
                <a href="#" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all w-fit">
                  View Application <ArrowUpRight size={16} className="text-muted group-hover:text-white transition-colors" />
                </a>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Card className="group h-full flex flex-col">
                <div className="w-full h-48 bg-surface-hover rounded-xl mb-6 overflow-hidden relative border border-border">
                  <img loading="lazy" src="/lotanash-screenshot.jpg" alt="Self-Service Fuel Purchase System" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-400 border border-green-500/30">Embedded System</div>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full">Embedded</span>
                  <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full">C++</span>
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4 font-display">Self-Service Fuel Purchase System</h3>
                <div className="space-y-3 text-sm text-muted mb-6 flex-1">
                  <p><strong className="text-foreground">Objective:</strong> Streamline fuel purchasing by reducing transaction processing time.</p>
                  <p><strong className="text-foreground">Action:</strong> Designed an embedded platform integrating DWIN touchscreens, barcode scanning, and biometric authentication.</p>
                  <p><strong className="text-foreground">Result:</strong> Achieved a 30% reduction in transaction processing time, significantly improving user throughput.</p>
                </div>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* Research, Publications & Education */}
        <section id="research">
          <FadeIn>
            <SectionHeading title="Research, Publications & Education" icon={BookOpen} />
          </FadeIn>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Publication */}
            <FadeIn delay={0.1} className="md:col-span-2">
              <Card className="border-accent/30 bg-accent/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-accent" size={24} />
                  <h3 className="text-3xl font-bold tracking-tight font-display">Springer Nature (plus) [Peer-Reviewed Journal] Plasmonics</h3>
                </div>
                <h4 className="text-xl font-bold mb-4 leading-snug">Tunable Square Annular Cavity Array (SACA) Nanoplasmonic Sensor for Refractive Index Sensing and Dynamic Optical Color Generation</h4>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-white/10 text-white border border-white/20 rounded-full text-sm font-bold tracking-wide">
                    Springer Nature
                  </span>
                  <span className="px-4 py-1.5 bg-accent/20 text-accent border border-accent/30 rounded-full text-sm font-bold tracking-wide">
                    Published: 17 July 2025
                  </span>
                  <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-bold tracking-wide">
                    1st Author
                  </span>
                </div>

                <p className="text-muted mb-6 text-lg">
                  <strong>Contribution:</strong> Led the research, experimental design, and academic writing as the primary author. Designed and simulated nanoplasmonic sensing structures with enhanced spectral sensitivity for biosensing and optical detection applications. Conducted extensive scientific simulations and data analysis using <strong>COMSOL Multiphysics (FDTD)</strong>, <strong>MATLAB</strong>, and <strong>Origin</strong>.
                </p>
                
                <a href="https://doi.org/10.1007/s11468-025-03167-1" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Read Full Publication <ArrowUpRight size={18} />
                </a>
              </Card>
            </FadeIn>

            {/* Education Timeline */}
            <FadeIn delay={0.2} className="md:col-span-2">
              <Card>
                <h3 className="text-3xl font-bold tracking-tight mb-10 flex items-center gap-3 font-display"><GraduationCap /> Academic Background</h3>
                <div className="space-y-12">
                  
                  {/* Master's Degree */}
                  <div className="relative group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center shrink-0">
                        <SafeImage src="https://logo.clearbit.com/nuist.edu.cn" alt="NUIST Logo" className="w-8 h-8 rounded bg-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-2xl">Master of Science (MSc)</h4>
                        <p className="text-accent font-medium">Information and Communication Engineering · NUIST, China</p>
                        <span className="text-xs font-mono text-muted">Aug 2025 · GPA: 3.93/5.0</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted mb-6 max-w-3xl">Nanjing University of Information Science and Technology (NUIST). Specialization in Nanophotonic Biosensors. Key Coursework: Digital Image Processing, Big Data Analyzing and Processing, Stochastic Processes.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <img loading="lazy" src="/msc-certificate1.jpg" alt="MSc Certificate 1" className="w-full rounded-2xl border border-border hover:border-accent/50 transition-colors shadow-lg" />
                      <img loading="lazy" src="/msc-certificate2.jpg" alt="MSc Certificate 2" className="w-full rounded-2xl border border-border hover:border-accent/50 transition-colors shadow-lg" />
                    </div>
                  </div>

                  {/* Bachelor's Degree */}
                  <div className="relative group pt-12 border-t border-border/50">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center shrink-0">
                        <SafeImage src="https://logo.clearbit.com/hit.ac.zw" alt="HIT Logo" className="w-8 h-8 rounded bg-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-2xl">Bachelor of Technology</h4>
                        <p className="text-accent font-medium">Electronic Engineering (1st Class Honours) · HIT</p>
                        <span className="text-xs font-mono text-muted">Oct 2023 · Degree Class 1</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted mb-6 max-w-3xl">Harare Institute of Technology. Awards: Chancellor's Award for Best Graduating Female Student, Vice Chancellor's Prize.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <img loading="lazy" src="/btech-certificate.jpg" alt="BTech Certificate" className="w-full rounded-2xl border border-border hover:border-accent/50 transition-colors shadow-lg" />
                      <img loading="lazy" src="/tertiary-ed-certificate.jpg" alt="Tertiary Education Certificate" className="w-full rounded-2xl border border-border hover:border-accent/50 transition-colors shadow-lg" />
                    </div>
                  </div>

                  {/* A & O Levels */}
                  <div className="relative group pt-12 border-t border-border/50">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center shrink-0">
                        <SafeImage src="https://logo.clearbit.com/zimsec.co.zw" alt="ZIMSEC Logo" className="w-8 h-8 rounded bg-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-2xl">Advanced & Ordinary Levels</h4>
                        <p className="text-accent font-medium">ZIMSEC Certification</p>
                        <span className="text-xs font-mono text-muted">2016 - 2018</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted">A Level (Left)</p>
                        <img loading="lazy" src="/a-level-certificate.jpg" alt="A Level Certificate" className="w-full rounded-2xl border border-border hover:border-accent/50 transition-colors shadow-lg" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted">O Level (Right)</p>
                        <img loading="lazy" src="/o-level-certificate.jpg" alt="O Level Certificate" className="w-full rounded-2xl border border-border hover:border-accent/50 transition-colors shadow-lg" />
                      </div>
                    </div>
                  </div>

                </div>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* Socials & Contact */}
        <section id="contact">
          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto">
              <Card className="flex flex-col items-center text-center gap-8 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.05),_transparent_50%)]">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight mb-4 font-display">Let's build together.</h2>
                  <p className="text-muted max-w-md mx-auto mb-8">Currently open for new opportunities in Agentic AI, Web Development, Embedded Systems, and Research.</p>
                  
                  <div className="flex items-center justify-center gap-4">
                    <a href="https://wa.me/263779406846" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg" title="WhatsApp: +263 779 406 846">
                      <MessageCircle size={24} />
                    </a>
                    <a href="tel:+263779406846" className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg" title="Call: +263 779 406 846">
                      <Phone size={24} />
                    </a>
                    <a href="https://linkedin.com/in/tadiwanashe-brenda-chitsva" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg" title="LinkedIn">
                      <Linkedin size={24} />
                    </a>
                    <a href="mailto:chitsvatadiwanashe@gmail.com" className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg" title="Email: chitsvatadiwanashe@gmail.com">
                      <Mail size={24} />
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </FadeIn>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="mt-32 border-t border-border bg-surface/30 py-8 px-6 text-center">
        <p className="text-muted text-sm">© {new Date().getFullYear()} Tadiwanashe Brenda Chitsva. All rights reserved.</p>
      </footer>
    </div>
  );
}
