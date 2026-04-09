import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, Github, Linkedin, Mail, Cpu, Code, Terminal, Database, Sparkles, FileText, Award, BookOpen, Globe, Briefcase, GraduationCap, AppWindow, FileBadge, Server, MessageCircle, HeartHandshake } from 'lucide-react';

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

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`glass-card rounded-[2rem] p-8 relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black pb-24 font-sans">
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

      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-32 md:pt-48 space-y-40">
        
        {/* Hero Section */}
        <motion.section 
          style={{ opacity: heroOpacity, y: heroY, perspective: 1200 }} 
          className="relative py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          {/* Dynamic Background Orb */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[600px] h-[60vw] max-h-[600px] bg-white/10 rounded-full blur-[120px] pointer-events-none -z-10"
          />
          
          {/* Floating Elements for Premium SaaS feel */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/20 rounded-full blur-3xl pointer-events-none -z-10"
          />
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10"
          />

          <motion.div style={{ rotateX: heroRotateX, rotateY: heroRotateY, transformStyle: "preserve-3d" }} className="z-10">
            <FadeIn>
              <div style={{ transform: "translateZ(20px)" }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm font-medium mb-8 shadow-sm">
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
                  className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 font-display drop-shadow-2xl leading-tight"
                  style={{ textShadow: "0 10px 30px rgba(255,255,255,0.15), 0 1px 2px rgba(255,255,255,0.5)" }}
                >
                  Tadiwanashe Brenda Chitsva
                </motion.h1>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ transform: "translateZ(30px)" }}>
                <p className="text-xl md:text-2xl text-muted max-w-2xl leading-relaxed mb-10 font-light">
                  Information and Communication Engineer and Electronic Engineer. Specializing in embedded systems, autonomous AI agencies, and full-stack web development.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div style={{ transform: "translateZ(40px)" }} className="flex flex-wrap items-center gap-4">
                <a href="#projects" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  View Projects <ArrowUpRight size={20} />
                </a>
                <a href="#about" className="inline-flex items-center justify-center gap-2 bg-surface border border-border px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-all hover:scale-105 active:scale-95">
                  About Me
                </a>
              </div>
            </FadeIn>
          </motion.div>

          {/* Spline 3D Embed */}
          <FadeIn delay={0.4} className="relative w-full h-[600px] lg:h-[900px] z-10 lg:scale-125 origin-center lg:translate-x-12">
            <iframe 
              src="https://my.spline.design/bentocardscopycopy-kpccyHyBzyplIs4Cz8WbLIZ3-CVV/" 
              frameBorder="0" 
              width="100%" 
              height="100%" 
              className="w-full h-full"
              title="Spline 3D Interactive Design"
            ></iframe>
          </FadeIn>
        </motion.section>

        {/* Intro & Skills Bento */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <FadeIn delay={0.3} className="md:col-span-2">
            <Card className="h-full flex flex-col justify-between group">
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-border shrink-0 shadow-xl">
                    <SafeImage src="/profile.jpg" alt="Tadiwanashe Brenda Chitsva" className="w-full h-full object-cover bg-surface-hover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="text-accent" size={20} />
                      <span className="text-accent font-medium tracking-wide uppercase text-sm">About Me</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display">Engineering robust, secure, and autonomous systems.</h2>
                  </div>
                </div>
                <div className="space-y-4 text-muted leading-relaxed text-lg">
                  <p>
                    I bring a rigorous, systems-level engineering approach to the tech industry. My <strong>First-Class B.Tech in Electronic Engineering (HIT)</strong> forged my expertise in low-level hardware, embedded systems, and strict <strong>systems auditing</strong>. My <strong>MSc in Information & Communication Engineering (NUIST)</strong> elevated this foundation into complex network architectures and advanced <strong>software engineering</strong>.
                  </p>
                  <p>
                    I don't just write code; I architect, audit, and secure end-to-end systems. By bridging physical infrastructure with intelligent software, I ensure that every platform is architecturally sound and secure by design.
                  </p>
                  <p>
                    <strong>Industry Value:</strong> Before deploying any autonomous agency or enterprise platform, I leverage deep expertise in vulnerability assessment and code auditing to guarantee absolute reliability and performance. From full-stack web platforms to AI-run agencies (OpenClaw, Cursor, Claude), I deliver scalable, production-ready solutions that drive technological innovation.
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

          <FadeIn delay={0.4} className="md:col-span-1">
            <Card className="h-full flex flex-col">
              <h3 className="text-2xl font-bold tracking-tight mb-6 font-display">Technical Arsenal</h3>
              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <Terminal className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Agentic AI & Workflows</p>
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
                    <p className="font-medium text-sm">Engineering Software & Modeling</p>
                    <p className="text-xs text-muted">MATLAB, OpenCV, COMSOL FDTD, Proteus, Siemens (PLC), Origin</p>
                  </div>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <BookOpen className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Research & Development</p>
                    <p className="text-xs text-muted">Academic writing, data analysis, experimental design, scientific simulation</p>
                  </div>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <Cpu className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Hardware Description & PCB</p>
                    <p className="text-xs text-muted">VHDL, Verilog, Altium Designer</p>
                  </div>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <Terminal className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Data Science & ML</p>
                    <p className="text-xs text-muted">Python, PyTorch, TensorFlow, Pandas, Scikit-learn</p>
                  </div>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-3 flex items-center gap-4">
                  <Code className="text-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Cloud, DevOps & IoT</p>
                    <p className="text-xs text-muted">AWS, GCP, Docker, Kubernetes, CI/CD, MQTT, LoRaWAN</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>
        </section>

        {/* Awards & Certifications */}
        <section>
          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <Card className="h-full">
                <h3 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-3 font-display"><Award className="text-accent"/> Awards & Honors</h3>
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
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card className="h-full">
                <h3 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-3 font-display"><FileBadge className="text-accent"/> Certifications</h3>
                <ul className="space-y-4">
                  <li className="p-5 bg-background/50 border border-border rounded-xl hover:border-accent/50 transition-colors">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-bold text-lg text-foreground">AI Fluency: Framework & Foundations</h4>
                      <a href="https://verify.skilljar.com/c/ri4ci9sngnzk" target="_blank" rel="noreferrer" className="text-xs font-medium bg-accent/20 text-accent px-2 py-1 rounded hover:bg-accent/30 transition-colors shrink-0">Verify</a>
                    </div>
                    <p className="text-sm text-muted mb-4">Anthropic Education</p>
                    <SafeImage src="/anthropic-certificate.jpg" alt="Anthropic Certificate" className="w-full rounded-lg border border-border" />
                  </li>
                  <li className="p-5 bg-background/50 border border-border rounded-xl hover:border-accent/50 transition-colors">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-bold text-lg text-foreground">Quantum Computing Fundamentals</h4>
                      <a href="https://www.credly.com/badges/46732ac5-922a-4d6f-8150-4d7f27ef4f16/print" target="_blank" rel="noreferrer" className="text-xs font-medium bg-accent/20 text-accent px-2 py-1 rounded hover:bg-accent/30 transition-colors shrink-0">Verify</a>
                    </div>
                    <p className="text-sm text-muted mb-4">IBM SkillsBuild (Quantum Enigmas) & Udemy (Quantum NLP)</p>
                    <SafeImage src="/quantum-nlp-certificate.jpg" alt="Quantum Computing Certificate" className="w-full rounded-lg border border-border" />
                  </li>
                  <li className="p-5 bg-background/50 border border-border rounded-xl hover:border-accent/50 transition-colors">
                    <h4 className="font-bold text-lg text-foreground mb-1">PTE Academic English Assessment</h4>
                    <p className="text-sm text-muted mb-4">Score: 90 (Elite academic English proficiency)</p>
                    <SafeImage src="/ppte-score-report.jpg" alt="PTE Score Report" className="w-full rounded-lg border border-border" />
                  </li>
                  <li className="p-5 bg-background/50 border border-border rounded-xl hover:border-accent/50 transition-colors">
                    <h4 className="font-bold text-lg text-foreground mb-1">150-Hour TEFL/TESOL Certificate</h4>
                    <p className="text-sm text-muted mb-4">TEFL Universal</p>
                    <SafeImage src="/tefl-certificate.jpg" alt="TEFL Certificate" className="w-full rounded-lg border border-border" />
                  </li>
                </ul>
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
                  <SafeImage src="/anyiculture-screenshot.jpg" alt="Anyiculture" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
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
                  <SafeImage src="/lycore-screenshot.jpg" alt="Lycore" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
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
                  <SafeImage src="/igcse-screenshot.jpg" alt="IGCSE Study App" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
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
                  <SafeImage src="/lotanash-screenshot.jpg" alt="Self-Service Fuel Purchase System" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
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
                  <h3 className="text-3xl font-bold tracking-tight font-display">Peer-Reviewed Journal Publication</h3>
                </div>
                <h4 className="text-xl font-bold mb-4 leading-snug">Tunable Square Annular Cavity Array (SACA) Nanoplasmonic Sensor for Refractive Index Sensing and Dynamic Optical Color Generation</h4>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-white/10 text-white border border-white/20 rounded-full text-sm font-bold tracking-wide">
                    Springer Nature (Plasmonics)
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
                
                <a href="https://doi.org/10.1007/s11468-025-03167-1" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-accent/90 transition-colors shadow-[0_0_20px_rgba(var(--color-accent),0.3)]">
                  Read Full Publication <ArrowUpRight size={18} />
                </a>
              </Card>
            </FadeIn>

            {/* Education Timeline */}
            <FadeIn delay={0.2} className="md:col-span-2">
              <Card>
                <h3 className="text-3xl font-bold tracking-tight mb-10 flex items-center gap-3 font-display"><GraduationCap /> Academic Background</h3>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-lg">Master of Science (MSc)</h4>
                        <span className="text-xs font-mono text-accent">Aug 2025</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2 mt-2">
                        <SafeImage src="https://logo.clearbit.com/nuist.edu.cn" alt="NUIST Logo" className="w-8 h-8 rounded bg-white" />
                        <p className="text-sm font-medium text-foreground">Information and Communication Engineering</p>
                      </div>
                      <p className="text-xs text-muted mb-3">Nanjing University of Information Science and Technology (NUIST). GPA: 3.93/5.0. Specialization in Nanophotonic Biosensors.</p>
                      <p className="text-xs text-foreground/80 mb-3"><strong>Key Coursework:</strong> Digital Image Processing, Big Data Analyzing and Processing, Communication & Information Processing, Stochastic Processes, Matrix Theory.</p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <SafeImage src="/msc-certificate1.jpg" alt="MSc Certificate 1" className="w-full sm:w-1/2 max-w-sm rounded-lg border border-border" />
                        <SafeImage src="/msc-certificate2.jpg" alt="MSc Certificate 2" className="w-full sm:w-1/2 max-w-sm rounded-lg border border-border" />
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <div className="w-3 h-3 bg-muted rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-lg">Bachelor of Technology</h4>
                        <span className="text-xs font-mono text-muted">Oct 2023</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2 mt-2">
                        <SafeImage src="https://logo.clearbit.com/hit.ac.zw" alt="HIT Logo" className="w-8 h-8 rounded bg-white" />
                        <p className="text-sm font-medium text-foreground">Electronic Engineering (1st Class Honours)</p>
                      </div>
                      <p className="text-xs text-muted mb-3">Harare Institute of Technology. Degree Class 1 (First Class).</p>
                      <p className="text-xs text-foreground/80 mb-3"><strong>Key Coursework:</strong> Microcontrollers, DSP, Embedded Systems, Fundamentals of Photonics, Robotics Technology, RF Microwave Devices, Control Engineering.</p>
                      <p className="text-xs text-accent mb-3"><strong>Awards:</strong> Chancellor's Award for Best Graduating Female Student, Vice Chancellor's Prize for Best Graduating Student in Electronic Engineering.</p>
                      <SafeImage src="/btech-certificate.jpg" alt="BTech Certificate" className="w-full max-w-sm rounded-lg border border-border mt-2" />
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <div className="w-3 h-3 bg-muted rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-lg">Higher & Tertiary Ed. Cert.</h4>
                        <span className="text-xs font-mono text-muted">Oct 2023</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2 mt-2">
                        <SafeImage src="https://logo.clearbit.com/hit.ac.zw" alt="HIT Logo" className="w-8 h-8 rounded bg-white" />
                        <p className="text-sm font-medium text-foreground">Harare Institute of Technology (Merit)</p>
                      </div>
                      <p className="text-xs text-muted mb-3">Formal academic certification completing tertiary foundation requirements, demonstrating pedagogical and foundational academic competence.</p>
                      <p className="text-xs text-foreground/80 mb-3"><strong>Key Coursework:</strong> Applied Educational Technology, Research and Development Methodologies, Curriculum Issues in Higher and Tertiary Education.</p>
                      <SafeImage src="/tertiary-ed-certificate.jpg" alt="Tertiary Education Certificate" className="w-full max-w-sm rounded-lg border border-border mt-2" />
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <div className="w-3 h-3 bg-muted rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-lg">A Level (ZIMSEC)</h4>
                        <span className="text-xs font-mono text-muted">Nov 2018</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2 mt-2">
                        <SafeImage src="https://logo.clearbit.com/zimsec.co.zw" alt="ZIMSEC Logo" className="w-8 h-8 rounded bg-white" />
                        <p className="text-sm font-medium text-foreground">Physics (A), Chemistry (B), Pure Mathematics (B)</p>
                      </div>
                      <p className="text-xs text-muted mb-3">ZRP High School.</p>
                      <SafeImage src="/a-level-certificate.jpg" alt="A Level Certificate" className="w-full max-w-sm rounded-lg border border-border mt-2" />
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <div className="w-3 h-3 bg-muted rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-lg">O Level (ZIMSEC)</h4>
                        <span className="text-xs font-mono text-muted">Nov 2016</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2 mt-2">
                        <SafeImage src="https://logo.clearbit.com/zimsec.co.zw" alt="ZIMSEC Logo" className="w-8 h-8 rounded bg-white" />
                        <p className="text-sm font-medium text-foreground">10 A's and 3 B's</p>
                      </div>
                      <p className="text-xs text-muted mb-3">Including Mathematics (A), Physics (A), Chemistry (A), Biology (B), Computer Studies (B).</p>
                      <SafeImage src="/o-level-certificate.jpg" alt="O Level Certificate" className="w-full max-w-sm rounded-lg border border-border mt-2" />
                    </div>
                  </div>

                </div>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* Volunteer & Leadership */}
        <section id="leadership">
          <FadeIn>
            <SectionHeading title="Leadership & Global Impact" icon={HeartHandshake} />
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            <FadeIn delay={0.1}>
              <Card className="h-full">
                <div className="flex items-center gap-4 mb-4">
                  <SafeImage src="https://ui-avatars.com/api/?name=Free+Fluency+Academy&background=0D8ABC&color=fff" alt="Free Fluency Academy Logo" className="w-12 h-12 rounded-lg bg-white" />
                  <div>
                    <h4 className="font-bold text-2xl mb-1 font-display">Online English Tutor</h4>
                    <p className="text-accent text-sm font-medium">Free Fluency Academy · Ohio, USA</p>
                    <span className="text-xs text-muted font-mono mt-1 block">Oct 2024 - 2025</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted mt-4">
                  <p><strong className="text-foreground">Objective:</strong> Enhance English proficiency for international students.</p>
                  <p><strong className="text-foreground">Action:</strong> Developed engaging marketing campaigns and implemented innovative learning technologies.</p>
                  <p><strong className="text-foreground">Result:</strong> Improved language acquisition programs globally and boosted student fluency.</p>
                </div>
              </Card>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <Card className="h-full">
                <div className="flex items-center gap-4 mb-4">
                  <SafeImage src="https://ui-avatars.com/api/?name=Brave+Hearts+International&background=0D8ABC&color=fff" alt="Brave Hearts International Logo" className="w-12 h-12 rounded-lg bg-white" />
                  <div>
                    <h4 className="font-bold text-2xl mb-1 font-display">Education Advisor</h4>
                    <p className="text-accent text-sm font-medium">Brave Hearts International · Japan</p>
                    <span className="text-xs text-muted font-mono mt-1 block">2024 - 2025</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted mt-4">
                  <p><strong className="text-foreground">Objective:</strong> Guide students in navigating international education opportunities.</p>
                  <p><strong className="text-foreground">Action:</strong> Provided expert guidance on academic pathways and assisted in developing educational resources.</p>
                  <p><strong className="text-foreground">Result:</strong> Improved access to quality education and successfully mentored students through applications.</p>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card className="h-full">
                <div className="flex items-center gap-4 mb-4">
                  <SafeImage src="https://ui-avatars.com/api/?name=Methodist+Community+Church&background=0D8ABC&color=fff" alt="Methodist Community Church Logo" className="w-12 h-12 rounded-lg bg-white" />
                  <div>
                    <h4 className="font-bold text-2xl mb-1 font-display">Communications Committee</h4>
                    <p className="text-accent text-sm font-medium">Methodist Community Church · Zimbabwe</p>
                    <span className="text-xs text-muted font-mono mt-1 block">2022 - 2025</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted mt-4">
                  <p><strong className="text-foreground">Objective:</strong> Streamline organizational communication and outreach.</p>
                  <p><strong className="text-foreground">Action:</strong> Managed internal/external communications and executed community engagement strategies.</p>
                  <p><strong className="text-foreground">Result:</strong> Increased community engagement and ensured consistent information flow.</p>
                </div>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* Professional Affiliations */}
        <section id="affiliations">
          <FadeIn>
            <SectionHeading title="Professional Affiliations" icon={Award} />
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            <FadeIn delay={0.1}>
              <Card className="h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    <SafeImage src="https://unavatar.io/duckduckgo/nspe.org" alt="NSPE Logo" className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">National Society of Professional Engineers (NSPE)</h4>
                    <p className="text-accent text-sm font-medium mt-1">Member</p>
                  </div>
                </div>
                <p className="text-sm text-muted font-mono">Member ID: 301173445</p>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card className="h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    <SafeImage src="https://unavatar.io/duckduckgo/ieee.org" alt="IEEE Logo" className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">Institute of Electrical and Electronics Engineers (IEEE)</h4>
                    <p className="text-accent text-sm font-medium mt-1">Student Member</p>
                  </div>
                </div>
                <p className="text-sm text-muted font-mono mb-2">Member ID: 101231198</p>
                <p className="text-sm text-muted">Participating in IEEE Robotics & Automation (RoboCup) and Pre-University STEM Communities.</p>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card className="h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    <SafeImage src="https://unavatar.io/duckduckgo/ewb.org.za" alt="EWBSA Logo" className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">Engineers Without Borders South Africa (EWBSA)</h4>
                    <p className="text-accent text-sm font-medium mt-1">Student Member</p>
                  </div>
                </div>
                <p className="text-sm text-muted">Supporting community-focused engineering and youth innovation in sustainability.</p>
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
