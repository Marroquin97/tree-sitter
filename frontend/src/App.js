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
  Instagram
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

// Assets from design guidelines
const ASSETS = {
  hero_bg: "https://images.unsplash.com/photo-1724770388815-0e0a9654ec66?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHx0ZWNobm9sb2d5JTIwZ29sZCUyMGNpcmN1aXR8ZW58MHx8fHwxNzcyOTY3MTY1fDA&ixlib=rb-4.1.0&q=85",
  systems: "https://images.unsplash.com/photo-1724770388447-30b015a5cbb6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZ29sZCUyMGNpcmN1aXR8ZW58MHx8fHwxNzcyOTY3MTY1fDA&ixlib=rb-4.1.0&q=85",
  experience: "https://images.unsplash.com/photo-1569402766266-9c58bfe2f4ed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwyfHxtb2xlY3VsYXIlMjBjb2NrdGFpbCUyMHNtb2tlJTIwbHV4dXJ5JTIwYmFyJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzcyOTY3MTUxfDA&ixlib=rb-4.1.0&q=85",
  academy: "https://images.pexels.com/photos/8369249/pexels-photo-8369249.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  founder: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
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
          <Hexagon className="w-8 h-8 text-gold" strokeWidth={1.5} />
          <span className="font-syne text-xl font-bold tracking-tight">ATARAXIA</span>
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
    "EXPERIENCIAS"
  ];

  return (
    <section 
      ref={containerRef}
      id="inicio" 
      className="hero-section relative noise-overlay"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSETS.hero_bg}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Content */}
          <div className="space-y-8">
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
              className="font-syne text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1]"
            >
              <span className="gradient-text">ATARAXIA</span>
              <br />
              <span className="text-[#EDEDED]">TECH LAB</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-outfit text-lg md:text-xl text-[#A1A1AA] max-w-lg leading-relaxed"
            >
              Diseñamos sistemas y experiencias que elevan el desempeño técnico y humano.
              <span className="text-gold"> Precision. Experience. Evolution.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
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
          </div>

          {/* Right Content - Floating Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              <div className="animate-float">
                <Hexagon 
                  size={300} 
                  className="text-gold opacity-20" 
                  strokeWidth={0.5}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-mono text-xs text-gold tracking-widest">EST. 2024</span>
                  <div className="mt-2 font-syne text-2xl font-bold">Engineering</div>
                  <div className="font-outfit text-[#A1A1AA]">Experiences</div>
                </div>
              </div>
            </div>
          </motion.div>
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
                src={ASSETS.founder}
                alt="Brian Marroquín - Fundador"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>
            /* Floating Badge */}
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
              Nuestro enfoque combina <span className="text-gold">orden + creatividad + experiencia + impacto humano</span>. 
              Ya sea optimizando sistemas, diseñando experiencias sensoriales o transfiriendo conocimiento real, 
              cada proyecto lleva la firma de la precisión y la innovación.
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
                <span className="font-outfit text-sm">1er Lugar Mixología - Restaurante Tonatzin</span>
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

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="service-icon">
                  <Mail className="text-gold" size={24} />
                </div>
                <div>
                  <p className="font-outfit text-sm text-[#52525B]">Email</p>
                  <p className="font-outfit text-[#EDEDED]">contacto@ataraxiatechlab.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="service-icon">
                  <Phone className="text-gold" size={24} />
                </div>
                <div>
                  <p className="font-outfit text-sm text-[#52525B]">WhatsApp</p>
                  <p className="font-outfit text-[#EDEDED]">+52 459 116 2796</p>
                </div>
              </div>

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
              <Hexagon className="w-8 h-8 text-gold" strokeWidth={1.5} />
              <span className="font-syne text-xl font-bold">ATARAXIA TECH LAB</span>
            </div>
            <p className="font-outfit text-[#A1A1AA] max-w-md">
              Diseñamos sistemas y experiencias que elevan el desempeño técnico y humano. 
              Precision. Experience. Evolution.
            </p>
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

          {/* Links */}
          <div>
            <h4 className="font-syne font-bold text-[#EDEDED] mb-4">Síguenos</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://instagram.com/Marroquin7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link font-outfit text-sm flex items-center gap-2"
                >
                  <Instagram size={16} />
                  @Marroquin7
                </a>
              </li>
              <li><a href="#portafolio" className="footer-link font-outfit text-sm">Portafolio</a></li>
              <li><a href="#about" className="footer-link font-outfit text-sm">Nosotros</a></li>
              <li><a href="#contacto" className="footer-link font-outfit text-sm">Contacto</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-[#52525B]">
            © {new Date().getFullYear()} ATARAXIA TECH LAB. Todos los derechos reservados.
          </p>
          <p className="font-mono text-xs text-[#52525B]">
            Engineering Experiences
          </p>
        </div>
      </div>
    </footer>
  );
};

// WhatsApp Button
const WhatsAppButton = () => {
  const whatsappNumber = "524591162796";
  const message = "Hola Brian, me interesa conocer más sobre los servicios de ATARAXIA TECH LAB.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

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
