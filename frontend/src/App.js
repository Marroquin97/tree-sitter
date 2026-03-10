import { useEffect, useState, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  FlaskConical, 
  GraduationCap, 
  Menu, 
  X, 
  ArrowRight, 
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Hexagon,
  Award,
  Users,
  Briefcase,
  Send,
  Instagram,
  Facebook
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Brian's Real Images
const BRIAN_IMAGES = {
  // About section - Brian working
  profile: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/y6s5zi7i_FB_IMG_1756844718511.jpg",
  action: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/liudhhpr_FB_IMG_1772989023614.jpg",
  // Concurso Tonatzin
  tonatzin_group: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/yud6zenz_FB_IMG_1772989019719.jpg",
  // Ambiente
  speakeasy_decor: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/mmjeeufp_FB_IMG_1772989040348.jpg"
};

// Cócteles de Autor - Concurso Tonatzin
const COCKTAILS_AUTOR = [
  {
    id: 1,
    name: "Jardín Esmeralda",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/up6mt1n1_arlettecuellar7-20260308-0002.jpg",
    description: "Cóctel de autor con flores comestibles y cítricos deshidratados",
    event: "Concurso Tonatzin"
  },
  {
    id: 2,
    name: "Bosque Encantado",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/lzvgr86y_arlettecuellar7-20260308-0001.jpg",
    description: "Presentación con técnica de pinzas y decoración floral",
    event: "Concurso Tonatzin"
  },
  {
    id: 3,
    name: "Atardecer en Capas",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/b36ywsto_brian_marroquin7-20260308-0003.jpg",
    description: "Shot de técnica de capas con efecto visual degradado",
    event: "Concurso Tonatzin"
  }
];

// Cócteles del Curso 2020 - Cielo y Pecados con Mane Maldonado
const COCKTAILS_CURSO = [
  {
    id: 1,
    name: "Blue Lagoon",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/g4q9e4l8_IMG-20210907-WA0018.jpg",
    description: "Curso de Mixología 2020 - Speakeasy Cielo y Pecados, Morelia"
  },
  {
    id: 2,
    name: "Lava Frozen",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/za3mqo85_IMG-20210811-WA0000.jpg",
    description: "Instructor: Mane Maldonado - Colegio de Bartenders"
  },
  {
    id: 3,
    name: "Rainbow Paradise",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/eqd40mmw_IMG-20210804-WA0021.jpg",
    description: "Técnicas de degradado y presentación"
  },
  {
    id: 4,
    name: "Blue Ocean",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/pcaehv75_IMG-20210804-WA0002.jpg",
    description: "Decoración con frutas y cristalería"
  },
  {
    id: 5,
    name: "Golden Sunset",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/vh8aqetv_IMG-20210727-WA0002.jpg",
    description: "Técnica de capas y garnish"
  }
];

// Platillos de Gastronomía - Club de Cuisine 2018
const GASTRONOMY_IMAGES = [
  {
    id: 1,
    name: "Plato de Autor",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/lvormepl_brian_marroquin7-20260308-0001.jpg",
    description: "Club de Cuisine - Tacámbaro de Codallos, 2018"
  },
  {
    id: 2,
    name: "Técnica Culinaria",
    image: "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/dazkdr0c_brian_marroquin7-20260308-0002.jpg",
    description: "Estudios de Gastronomía"
  }
];

// Logo URL
const LOGO_URL = "https://customer-assets.emergentagent.com/job_personal-brand-hub-11/artifacts/urh7x0j7_file_000000007034722fb8d8add7522442ce.png";

// Assets from design guidelines
const ASSETS = {
  hero_bg: "https://images.unsplash.com/photo-1724770388815-0e0a9654ec66?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHx0ZWNobm9sb2d5JTIwZ29sZCUyMGNpcmN1aXR8ZW58MHx8fHwxNzcyOTY3MTY1fDA&ixlib=rb-4.1.0&q=85",
  systems: "https://images.unsplash.com/photo-1724770388447-30b015a5cbb6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZ29sZCUyMGNpcmN1aXR8ZW58MHx8fHwxNzcyOTY3MTY1fDA&ixlib=rb-4.1.0&q=85",
  experience: "https://images.unsplash.com/photo-1569402766266-9c58bfe2f4ed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwyfHxtb2xlY3VsYXIlMjBjb2NrdGFpbCUyMHNtb2tlJTIwbHV4dXJ5JTIwYmFyJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzcyOTY3MTUxfDA&ixlib=rb-4.1.0&q=85",
  academy: "https://images.pexels.com/photos/8369249/pexels-photo-8369249.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  founder: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
};

// Animated Logo Component
const AnimatedLogo = ({ size = "md", showText = true }) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  return (
    <div className="relative group">
      {/* Glow effect behind logo */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gold/20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Rotating ring effect */}
      <motion.div
        className="absolute -inset-2 rounded-full border border-gold/30"
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Sparkle particles */}
      <motion.div
        className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          y: [0, -10, -20],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0,
        }}
      />
      <motion.div
        className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gold-light rounded-full"
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          y: [0, -8, -16],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.7,
        }}
      />
      <motion.div
        className="absolute top-1/2 -right-2 w-1 h-1 bg-gold rounded-full"
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          x: [0, 10, 20],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1.4,
        }}
      />
      
      {/* Main logo image */}
      <motion.img
        src={LOGO_URL}
        alt="ATARAXIA - El Loco Sabio"
        className={`${sizes[size]} object-contain relative z-10 rounded-lg`}
        whileHover={{ 
          scale: 1.1,
          filter: "brightness(1.2)",
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#divisiones", label: "Divisiones" },
    { href: "#portafolio", label: "Portafolio" },
    { href: "#about", label: "Nosotros" },
    { href: "#contacto", label: "Contacto" }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-4" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-3" data-testid="logo-link">
          <AnimatedLogo size="sm" showText={false} />
          <span className="font-syne text-xl font-bold tracking-tight hidden sm:block">ATARAXIA</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link font-outfit text-sm tracking-wide link-underline"
              data-testid={`nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
          <Button 
            className="btn-gold px-6 py-2 font-outfit font-medium"
            onClick={() => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' })}
            data-testid="nav-cta-btn"
          >
            Iniciar Proyecto
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gold"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="mobile-menu-toggle"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-4"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-outfit text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button 
                className="btn-gold w-full py-3"
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Iniciar Proyecto
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Hero Section
const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const services = [
    "IT & SISTEMAS",
    "MIXOLOGÍA",
    "DISEÑO",
    "CAPACITACIÓN",
    "BRANDING",
    "GASTRONOMÍA"
  ];

  return (
    <section 
      ref={containerRef}
      id="inicio" 
      className="hero-section relative overflow-hidden"
      data-testid="hero-section"
    >
      {/* Logo as Large Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Glow behind logo */}
          <motion.div
            className="absolute w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          
          {/* Large Logo */}
          <motion.img
            src={LOGO_URL}
            alt="ATARAXIA - El Loco Sabio"
            className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[800px] lg:h-[800px] object-contain opacity-15 md:opacity-20"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Magic circles around logo */}
          <motion.div
            className="absolute w-[600px] h-[600px] md:w-[850px] md:h-[850px] border border-gold/10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-[700px] h-[700px] md:w-[950px] md:h-[950px] border border-gold/5 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 z-[1] noise-overlay pointer-events-none" />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20"
      >
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          {/* Small Logo for Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:hidden mb-8"
          >
            <img 
              src={LOGO_URL} 
              alt="ATARAXIA" 
              className="w-32 h-32 object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs tracking-[0.3em] text-gold uppercase">
              Laboratorio Creativo-Técnico
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-syne text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-[1.1] mt-6"
          >
            <span className="gradient-text">ATARAXIA</span>
            <br />
            <span className="text-[#EDEDED]">TECH LAB</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-outfit text-lg md:text-xl text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed mt-8"
          >
            Diseñamos sistemas y experiencias que elevan el desempeño técnico y humano.
            <span className="text-gold block mt-2 font-syne text-2xl">Precision. Experience. Evolution.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            <Button 
              className="btn-gold px-8 py-6 text-base font-outfit font-medium flex items-center gap-2"
              onClick={() => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' })}
              data-testid="hero-cta-btn"
            >
              Iniciar Proyecto
              <ArrowRight size={18} />
            </Button>
            <Button 
              variant="outline"
              className="btn-outline-gold px-8 py-6 text-base font-outfit"
              onClick={() => document.getElementById('divisiones').scrollIntoView({ behavior: 'smooth' })}
              data-testid="hero-explore-btn"
            >
              Explorar Servicios
            </Button>
          </motion.div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs text-[#52525B] tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="text-gold" size={24} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Marquee */}
      <div className="relative z-10 border-y border-[rgba(255,255,255,0.08)] py-4 overflow-hidden">
        <div className="marquee-wrapper">
          <div className="marquee-content animate-marquee">
            {[...services, ...services].map((service, index) => (
              <span 
                key={index}
                className="font-mono text-sm text-[#52525B] tracking-widest flex items-center gap-4"
              >
                <Hexagon size={12} className="text-gold" />
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Divisions Section
const DivisionsSection = () => {
  const divisions = [
    {
      id: "systems",
      name: "ATARAXIA SYSTEMS",
      tagline: "Precision. Structure. Results.",
      description: "Soluciones técnicas y digitales con enfoque en eficiencia y resultados medibles.",
      services: ["Soporte IT y reparación", "Diseño gráfico y montaje", "Optimización de procesos", "Branding y desarrollo conceptual"],
      icon: Cpu,
      image: ASSETS.systems
    },
    {
      id: "experience",
      name: "ATARAXIA EXPERIENCE",
      tagline: "Sensation. Emotion. Memory.",
      description: "Experiencias sensoriales que generan impacto emocional y rentabilidad.",
      services: ["Mixología conceptual", "Diseño de conceptos gastronómicos", "Activaciones sensoriales", "Desarrollo de marcas para bares"],
      icon: FlaskConical,
      image: ASSETS.experience
    },
    {
      id: "academy",
      name: "ATARAXIA ACADEMY",
      tagline: "Knowledge. Growth. Mastery.",
      description: "Transferencia real de conocimiento para el desarrollo profesional.",
      services: ["Cursos técnicos", "Formación en mixología", "Capacitación profesional", "Mentorías estratégicas"],
      icon: GraduationCap,
      image: ASSETS.academy
    }
  ];

  return (
    <section id="divisiones" className="py-24 relative" data-testid="divisions-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header text-center"
        >
          <span className="section-label">Nuestras Divisiones</span>
          <h2 className="font-syne text-4xl sm:text-5xl font-bold text-[#EDEDED]">
            Tres Pilares, <span className="gradient-text">Una Visión</span>
          </h2>
          <p className="font-outfit text-[#A1A1AA] mt-4 max-w-2xl mx-auto">
            Integramos técnica, arte y estrategia para transformar personas y proyectos.
          </p>
        </motion.div>

        {/* Triptych Cards - Desktop */}
        <div className="hidden lg:flex gap-4 h-[600px]">
          {divisions.map((division, index) => (
            <motion.div
              key={division.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="division-card group cursor-pointer"
              data-testid={`division-card-${division.id}`}
            >
              {/* Background Image */}
              <img
                src={division.image}
                alt={division.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Content */}
              <div className="division-card-content">
                <division.icon 
                  size={40} 
                  className="text-gold mb-4 transition-transform duration-300 group-hover:scale-110" 
                />
                <h3 className="font-syne text-2xl font-bold text-[#EDEDED] mb-2">
                  {division.name}
                </h3>
                <p className="font-mono text-xs text-gold tracking-wider mb-4">
                  {division.tagline}
                </p>
                
                {/* Expanded Content on Hover */}
                <div className="max-h-0 overflow-hidden transition-all duration-500 group-hover:max-h-[300px]">
                  <p className="font-outfit text-[#A1A1AA] mb-4">
                    {division.description}
                  </p>
                  <ul className="space-y-2">
                    {division.services.map((service, idx) => (
                      <li key={idx} className="font-outfit text-sm text-[#EDEDED] flex items-center gap-2">
                        <ArrowRight size={12} className="text-gold" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-6">
          {divisions.map((division, index) => (
            <motion.div
              key={division.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl overflow-hidden"
              data-testid={`division-mobile-${division.id}`}
            >
              <img
                src={division.image}
                alt={division.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <division.icon size={32} className="text-gold mb-3" />
                <h3 className="font-syne text-xl font-bold text-[#EDEDED]">{division.name}</h3>
                <p className="font-mono text-xs text-gold tracking-wider mt-1">{division.tagline}</p>
                <p className="font-outfit text-sm text-[#A1A1AA] mt-3">{division.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Cocktail Gallery Section - Updated with proper categories
const CocktailGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("autor");

  const tabs = [
    { id: "autor", label: "Cócteles de Autor", subtitle: "Concurso Tonatzin" },
    { id: "curso", label: "Formación", subtitle: "Cielo y Pecados 2020" },
    { id: "gastro", label: "Gastronomía", subtitle: "Club de Cuisine 2018" }
  ];

  const getCurrentImages = () => {
    switch(activeTab) {
      case "autor": return COCKTAILS_AUTOR;
      case "curso": return COCKTAILS_CURSO;
      case "gastro": return GASTRONOMY_IMAGES;
      default: return COCKTAILS_AUTOR;
    }
  };

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden" data-testid="cocktail-gallery">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 border border-gold rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-gold rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header text-center"
        >
          <span className="section-label">Trayectoria & Creaciones</span>
          <h2 className="font-syne text-4xl sm:text-5xl font-bold text-[#EDEDED]">
            Arte <span className="gradient-text">Culinario</span>
          </h2>
          <p className="font-outfit text-[#A1A1AA] mt-4 max-w-2xl mx-auto">
            Cada creación es una experiencia sensorial única, resultado de años de formación y pasión.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-outfit text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gold text-[#050505]"
                  : "bg-[#121212] text-[#A1A1AA] hover:text-gold border border-[rgba(255,255,255,0.08)]"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <span className="block font-semibold">{tab.label}</span>
              <span className="block text-xs opacity-70">{tab.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`grid gap-4 ${
              activeTab === "gastro" 
                ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto" 
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            }`}
          >
            {getCurrentImages().map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(item)}
                data-testid={`gallery-item-${activeTab}-${item.id}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-syne text-sm font-bold text-[#EDEDED]">{item.name}</h3>
                </div>
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-gold/20 rotate-45 group-hover:bg-gold/40 transition-colors" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View More CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://instagram.com/Marroquin7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold rounded-full hover:bg-gold hover:text-[#050505] transition-all duration-300"
          >
            <Instagram size={18} />
            Ver más en Instagram
          </a>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold transition-colors"
              >
                <X size={32} />
              </button>
              <img
                src={selectedImage.image}
                alt={selectedImage.name}
                className="w-full rounded-2xl"
              />
              <div className="mt-4 text-center">
                <h3 className="font-syne text-2xl font-bold text-[#EDEDED]">{selectedImage.name}</h3>
                <p className="font-outfit text-[#A1A1AA] mt-2">{selectedImage.description}</p>
                {selectedImage.event && (
                  <span className="inline-block mt-2 px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-mono">
                    {selectedImage.event}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const stats = [
    { number: "50+", label: "Proyectos Completados", icon: Briefcase },
    { number: "3", label: "Divisiones Especializadas", icon: Hexagon },
    { number: "100%", label: "Clientes Satisfechos", icon: Users },
    { number: "1er", label: "Lugar Mixología", icon: Award }
  ];

  return (
    <section className="py-20 border-y border-[rgba(255,255,255,0.08)]" data-testid="stats-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon size={32} className="text-gold mx-auto mb-4" />
              <div className="stats-number">{stat.number}</div>
              <p className="font-outfit text-[#A1A1AA] mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Portfolio Section
const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const portfolioItems = [
    {
      id: 1,
      title: "Sistema de Gestión IT",
      category: "systems",
      description: "Optimización de infraestructura tecnológica para empresa de retail.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Concepto Bar Molecular",
      category: "experience",
      description: "Diseño de carta de mixología molecular para bar premium.",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Programa de Capacitación",
      category: "academy",
      description: "Curso intensivo de mixología para cadena de restaurantes.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Branding Restaurante",
      category: "systems",
      description: "Desarrollo de identidad visual para nuevo concepto gastronómico.",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&h=400&fit=crop"
    },
    {
      id: 5,
      title: "Activación Sensorial",
      category: "experience",
      description: "Evento experiencial para lanzamiento de marca de bebidas.",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop"
    },
    {
      id: 6,
      title: "Mentoría Emprendedores",
      category: "academy",
      description: "Programa de acompañamiento para startups gastronómicas.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
    }
  ];

  const filters = [
    { id: "all", label: "Todos" },
    { id: "systems", label: "Systems" },
    { id: "experience", label: "Experience" },
    { id: "academy", label: "Academy" }
  ];

  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portafolio" className="py-24 bg-[#0A0A0A]" data-testid="portfolio-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="section-label">Casos de Impacto</span>
          <h2 className="font-syne text-4xl sm:text-5xl font-bold text-[#EDEDED]">
            Proyectos <span className="gradient-text">Destacados</span>
          </h2>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full font-outfit text-sm transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-gold text-[#050505]"
                  : "bg-[#121212] text-[#A1A1AA] hover:text-gold border border-[rgba(255,255,255,0.08)]"
              }`}
              data-testid={`filter-${filter.id}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden card-hover"
                data-testid={`portfolio-item-${item.id}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="font-mono text-xs text-gold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-syne text-xl font-bold text-[#EDEDED] mt-2">
                    {item.title}
                  </h3>
                  <p className="font-outfit text-sm text-[#A1A1AA] mt-2">
                    {item.description}
                  </p>
                </div>
                {/* Always visible category badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#050505]/80 rounded-full">
                  <span className="font-mono text-xs text-gold uppercase">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  return (
    <section id="about" className="py-24" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden gold-glow">
              <img
                src={BRIAN_IMAGES.profile}
                alt="Brian Marroquín Ambriz - Fundador"
                className="w-full h-[500px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 glass p-6 rounded-xl gold-glow">
              <div className="font-mono text-xs text-gold mb-1">FUNDADOR</div>
              <div className="font-syne text-xl font-bold">Brian Marroquín Ambriz</div>
              <div className="font-outfit text-sm text-[#A1A1AA]">El Loco Sabio</div>
              <a 
                href="https://instagram.com/Marroquin7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-3 text-gold hover:text-gold-light transition-colors"
              >
                <Instagram size={16} />
                <span className="font-outfit text-sm">@Marroquin7</span>
              </a>
            </div>
            
            {/* Second image - action shot */}
            <div className="absolute -top-4 -left-4 w-32 h-32 rounded-xl overflow-hidden border-2 border-gold/30 hidden lg:block">
              <img
                src={BRIAN_IMAGES.action}
                alt="Brian en acción"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="section-label">Sobre Nosotros</span>
              <h2 className="font-syne text-4xl sm:text-5xl font-bold text-[#EDEDED] mt-4">
                El Arte de <span className="gradient-text">Integrar Mundos</span>
              </h2>
            </div>

            <p className="font-outfit text-lg text-[#A1A1AA] leading-relaxed">
              <span className="text-gold font-semibold">ATARAXIA TECH LAB</span> nace de la visión del 
              <span className="text-[#EDEDED]"> Loco Sabio</span>: aquel que parece disperso, pero en realidad 
              integra mundos. No somos "los que hacen de todo". Somos arquitectos de soluciones técnicas 
              y experiencias transformadoras.
            </p>

            <p className="font-outfit text-[#A1A1AA] leading-relaxed">
              Con formación en <span className="text-gold">Gastronomía</span> (Club de Cuisine, 2018) y 
              <span className="text-gold"> Mixología</span> (Colegio de Bartenders con Mane Maldonado, 2020), 
              combinamos técnica culinaria con creatividad sensorial para crear experiencias únicas.
            </p>

            <div className="border-l-2 border-gold pl-6">
              <p className="font-outfit text-lg text-[#EDEDED] italic">
                "Diseño experiencias y sistemas que transforman personas y proyectos, 
                combinando técnica, arte y estrategia."
              </p>
              <p className="font-mono text-sm text-gold mt-3">— Promesa de Valor</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-[#121212] rounded-lg">
                <Award className="text-gold" size={20} />
                <span className="font-outfit text-sm">1er Lugar - Concurso Mixología Tonatzin</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-[#121212] rounded-lg">
                <GraduationCap className="text-gold" size={20} />
                <span className="font-outfit text-sm">Club de Cuisine 2018</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-[#121212] rounded-lg">
                <FlaskConical className="text-gold" size={20} />
                <span className="font-outfit text-sm">Colegio de Bartenders 2020</span>
              </div>
            </div>
            
            {/* Tonatzin Group Photo */}
            <div className="relative rounded-xl overflow-hidden mt-6">
              <img
                src={BRIAN_IMAGES.tonatzin_group}
                alt="Concurso de Mixología - Restaurante Tonatzin"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="font-mono text-xs text-gold">CONCURSO DE MIXOLOGÍA</p>
                <p className="font-outfit text-sm text-[#EDEDED]">Restaurante Tonatzin - 1er Lugar</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Mensaje enviado exitosamente. Te contactaremos pronto.");
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (error) {
      toast.error("Error al enviar el mensaje. Por favor intenta nuevamente.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-[#0A0A0A]" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="section-label">Contacto</span>
              <h2 className="font-syne text-4xl sm:text-5xl font-bold text-[#EDEDED] mt-4">
                Iniciemos Tu <span className="gradient-text">Proyecto</span>
              </h2>
              <p className="font-outfit text-[#A1A1AA] mt-4 max-w-md">
                ¿Listo para transformar tu visión en realidad? Cuéntanos sobre tu proyecto 
                y diseñemos juntos la solución perfecta.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {/* WhatsApp Personal */}
              <a 
                href="https://wa.me/5214591162796"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="service-icon group-hover:bg-gold group-hover:border-gold transition-all">
                  <Phone className="text-gold group-hover:text-[#050505]" size={24} />
                </div>
                <div>
                  <p className="font-outfit text-sm text-[#52525B]">WhatsApp Personal</p>
                  <p className="font-outfit text-[#EDEDED] group-hover:text-gold transition-colors">+52 1 459 116 2796</p>
                </div>
              </a>

              {/* WhatsApp Cursos */}
              <a 
                href="https://wa.me/message/UHTR4XOK2P7PJ1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="service-icon group-hover:bg-gold group-hover:border-gold transition-all">
                  <GraduationCap className="text-gold group-hover:text-[#050505]" size={24} />
                </div>
                <div>
                  <p className="font-outfit text-sm text-[#52525B]">WhatsApp Cursos (Academy)</p>
                  <p className="font-outfit text-[#EDEDED] group-hover:text-gold transition-colors">Información de cursos</p>
                </div>
              </a>

              {/* Facebook Personal */}
              <a 
                href="https://www.facebook.com/share/19rq5KhMNP/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="service-icon group-hover:bg-gold group-hover:border-gold transition-all">
                  <Facebook className="text-gold group-hover:text-[#050505]" size={24} />
                </div>
                <div>
                  <p className="font-outfit text-sm text-[#52525B]">Facebook Personal</p>
                  <p className="font-outfit text-[#EDEDED] group-hover:text-gold transition-colors">Brian Marroquín Ambriz</p>
                </div>
              </a>

              {/* Facebook Cursos */}
              <a 
                href="https://www.facebook.com/share/1Hh4ozprLr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="service-icon group-hover:bg-gold group-hover:border-gold transition-all">
                  <FlaskConical className="text-gold group-hover:text-[#050505]" size={24} />
                </div>
                <div>
                  <p className="font-outfit text-sm text-[#52525B]">Facebook Cursos</p>
                  <p className="font-outfit text-[#EDEDED] group-hover:text-gold transition-colors">ATARAXIA Academy</p>
                </div>
              </a>

              {/* Ubicación */}
              <div className="flex items-center gap-4">
                <div className="service-icon">
                  <MapPin className="text-gold" size={24} />
                </div>
                <div>
                  <p className="font-outfit text-sm text-[#52525B]">Ubicación</p>
                  <p className="font-outfit text-[#EDEDED]">Tacámbaro y Morelia, Michoacán</p>
                </div>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://instagram.com/Marroquin7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#121212] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all"
              >
                <Instagram size={20} className="text-gold" />
              </a>
              <a
                href="https://www.facebook.com/share/19rq5KhMNP/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#121212] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all"
              >
                <Facebook size={20} className="text-gold" />
              </a>
              <a
                href="https://wa.me/5214591162796"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#121212] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all"
              >
                <MessageCircle size={20} className="text-gold" />
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-outfit text-sm text-[#A1A1AA] mb-2 block">Nombre *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className="bg-[#121212] border-[rgba(255,255,255,0.08)] text-[#EDEDED] placeholder:text-[#52525B] focus:border-gold"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="font-outfit text-sm text-[#A1A1AA] mb-2 block">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className="bg-[#121212] border-[rgba(255,255,255,0.08)] text-[#EDEDED] placeholder:text-[#52525B] focus:border-gold"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-outfit text-sm text-[#A1A1AA] mb-2 block">Teléfono</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+52 555 123 4567"
                    className="bg-[#121212] border-[rgba(255,255,255,0.08)] text-[#EDEDED] placeholder:text-[#52525B] focus:border-gold"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <label className="font-outfit text-sm text-[#A1A1AA] mb-2 block">Servicio de interés</label>
                  <Select onValueChange={handleServiceChange} value={formData.service}>
                    <SelectTrigger 
                      className="bg-[#121212] border-[rgba(255,255,255,0.08)] text-[#EDEDED]"
                      data-testid="select-service"
                    >
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[rgba(255,255,255,0.08)]">
                      <SelectItem value="systems">ATARAXIA SYSTEMS</SelectItem>
                      <SelectItem value="experience">ATARAXIA EXPERIENCE</SelectItem>
                      <SelectItem value="academy">ATARAXIA ACADEMY</SelectItem>
                      <SelectItem value="consulting">Consultoría General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="font-outfit text-sm text-[#A1A1AA] mb-2 block">Mensaje *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Cuéntanos sobre tu proyecto..."
                  rows={5}
                  className="bg-[#121212] border-[rgba(255,255,255,0.08)] text-[#EDEDED] placeholder:text-[#52525B] focus:border-gold resize-none"
                  data-testid="input-message"
                />
              </div>

              <Button 
                type="submit" 
                className="btn-gold w-full py-6 font-outfit font-medium flex items-center justify-center gap-2"
                disabled={isSubmitting}
                data-testid="submit-contact-btn"
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    Enviar Mensaje
                    <Send size={18} />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 border-t border-[rgba(255,255,255,0.08)]" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <AnimatedLogo size="sm" showText={false} />
              <span className="font-syne text-xl font-bold">ATARAXIA</span>
            </div>
            <p className="font-outfit text-[#A1A1AA] max-w-md">
              Diseñamos sistemas y experiencias que elevan el desempeño técnico y humano. 
              Precision. Experience. Evolution.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com/Marroquin7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#121212] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all"
              >
                <Instagram size={18} className="text-gold" />
              </a>
              <a
                href="https://www.facebook.com/share/19rq5KhMNP/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#121212] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all"
              >
                <Facebook size={18} className="text-gold" />
              </a>
              <a
                href="https://wa.me/5214591162796"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#121212] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all"
              >
                <MessageCircle size={18} className="text-gold" />
              </a>
            </div>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="font-syne font-bold text-[#EDEDED] mb-4">Divisiones</h4>
            <ul className="space-y-2">
              <li><a href="#divisiones" className="footer-link font-outfit text-sm">ATARAXIA SYSTEMS</a></li>
              <li><a href="#divisiones" className="footer-link font-outfit text-sm">ATARAXIA EXPERIENCE</a></li>
              <li><a href="#divisiones" className="footer-link font-outfit text-sm">ATARAXIA ACADEMY</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-syne font-bold text-[#EDEDED] mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://wa.me/5214591162796" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link font-outfit text-sm flex items-center gap-2"
                >
                  <Phone size={14} />
                  WhatsApp Personal
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/message/UHTR4XOK2P7PJ1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link font-outfit text-sm flex items-center gap-2"
                >
                  <GraduationCap size={14} />
                  WhatsApp Cursos
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/share/1Hh4ozprLr/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link font-outfit text-sm flex items-center gap-2"
                >
                  <Facebook size={14} />
                  Facebook Cursos
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-[#52525B]">
            © {new Date().getFullYear()} ATARAXIA TECH LAB. Todos los derechos reservados.
          </p>
          <p className="font-mono text-xs text-[#52525B]">
            Tacámbaro y Morelia, Michoacán
          </p>
        </div>
      </div>
    </footer>
  );
};

// WhatsApp Button
const WhatsAppButton = () => {
  const whatsappUrl = "https://wa.me/5214591162796?text=Hola%20Brian,%20me%20interesa%20conocer%20más%20sobre%20los%20servicios%20de%20ATARAXIA%20TECH%20LAB.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Contactar por WhatsApp"
      data-testid="whatsapp-btn"
    >
      <MessageCircle size={28} className="text-white" />
    </a>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navigation />
      <HeroSection />
      <DivisionsSection />
      <CocktailGallery />
      <StatsSection />
      <PortfolioSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#121212',
            color: '#EDEDED',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }
        }}
      />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
