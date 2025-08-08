
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import type { Project } from "@shared/schema";
import ecoEatsImage from "@assets/eco-eats-preview.png";
import bmoToolsImage from "@assets/bmo-tools-preview.png";
import bravezmImage from "@assets/image_1748447815242.png";
import bestyBoyImage from "@assets/image_1748447890581.png";
import ahmedHellyImage from "@assets/image_1748448070181.png";
import diaaEldenImage from "@assets/diaa-elden-shop.png";
import mrMohammedImage from "@assets/mr-mohammed.png";
import bemoraNewImage from "@assets/bemora-new.png";

// Interactive Dragon Console Component
function DragonConsole() {
  const [dragonPosition, setDragonPosition] = useState({ x: 50, y: 50 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (consoleRef.current) {
        const rect = consoleRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
        
        // Smooth dragon movement towards mouse
        setDragonPosition(prev => ({
          x: prev.x + (x - prev.x) * 0.1,
          y: prev.y + (y - prev.y) * 0.1
        }));
      }
    };

    const console = consoleRef.current;
    if (console) {
      console.addEventListener('mousemove', handleMouseMove);
      return () => console.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={consoleRef}
      className="relative w-full h-80 bg-black rounded-xl overflow-hidden border border-yellow-600/50 shadow-2xl cursor-none"
      style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 140, 0, 0.08) 0%, transparent 50%),
          linear-gradient(45deg, rgba(255, 215, 0, 0.05) 0%, rgba(0, 0, 0, 0.9) 100%)
        `
      }}
    >
      {/* Ancient Mystical Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255, 215, 0, 0.1) 20px, rgba(255, 215, 0, 0.1) 21px),
            repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(184, 134, 11, 0.1) 20px, rgba(184, 134, 11, 0.1) 21px)
          `
        }}></div>
      </div>
      
      {/* Ancient Dragon Console Text */}
      <div className="absolute top-4 left-4 text-yellow-400 font-mono text-sm space-y-1">
        <div className="animate-pulse">{'> Ancient Magic Activated...'}</div>
        <div className="text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }}>{'> Mystic_Dragon.exe summoned'}</div>
        <div className="text-amber-300 animate-pulse" style={{ animationDelay: '1s' }}>{'> Spirit tracking enabled'}</div>
        <div className="text-orange-300 animate-pulse" style={{ animationDelay: '1.5s' }}>{'> Ancient Dragon awakened'}</div>
      </div>
      
      {/* Skeletal Dragon with Wire Frame */}
      <div 
        className="absolute transition-all duration-200 ease-out"
        style={{
          left: `${dragonPosition.x}%`,
          top: `${dragonPosition.y}%`,
          transform: `translate(-50%, -50%) rotate(${Math.atan2(mousePosition.y - dragonPosition.y, mousePosition.x - dragonPosition.x) * 180 / Math.PI}deg)`
        }}
      >
        <svg width="160" height="80" viewBox="0 0 160 80" className="drop-shadow-2xl">
          {/* Majestic Dragon Head with Horns */}
          <g className="animate-pulse">
            {/* Main skull structure */}
            <path 
              d="M120 35 Q135 25 145 35 Q148 40 145 45 Q140 50 125 48 Q115 45 120 35 Z" 
              fill="none" 
              stroke="#fbbf24" 
              strokeWidth="2.5"
              className="animate-pulse"
            />
            
            {/* Dragon horns */}
            <path d="M125 30 Q130 20 135 25 Q132 28 128 32" fill="none" stroke="#d97706" strokeWidth="2" className="animate-pulse" />
            <path d="M135 28 Q142 18 148 23 Q145 26 140 30" fill="none" stroke="#d97706" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
            
            {/* Intricate skull details */}
            <path d="M120 38 Q125 35 130 38 Q135 35 140 38" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            
            {/* Glowing eyes */}
            <circle cx="128" cy="38" r="3" fill="#ef4444" opacity="0.9" className="animate-ping" />
            <circle cx="137" cy="36" r="2.5" fill="#dc2626" opacity="0.8" className="animate-ping" style={{ animationDelay: '0.5s' }} />
            
            {/* Extended jaw with detailed teeth */}
            <path d="M125 45 Q135 48 145 45 Q143 52 125 50 Z" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <line x1="130" y1="45" x2="130" y2="50" stroke="#f9fafb" strokeWidth="1.5" />
            <line x1="135" y1="45" x2="135" y2="49" stroke="#f9fafb" strokeWidth="1.5" />
            <line x1="140" y1="45" x2="140" y2="48" stroke="#f9fafb" strokeWidth="1.5" />
          </g>
          
          {/* Articulated Neck and Spine */}
          <g>
            {/* Main spine with curves */}
            <path d="M120 40 Q100 42 80 40 Q60 38 40 40 Q20 42 5 40" stroke="#fbbf24" strokeWidth="2.5" fill="none" className="animate-pulse" />
            
            {/* Detailed vertebrae with movement */}
            {Array.from({ length: 12 }).map((_, i) => {
              const x = 120 - i * 9;
              const y = 40 + Math.sin(i * 0.3) * 2;
              return (
                <g key={i}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="2.5" 
                    fill="none" 
                    stroke="#fbbf24" 
                    strokeWidth="2" 
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  />
                  {/* Articulated rib bones */}
                  <line 
                    x1={x} 
                    y1={y} 
                    x2={x - 3 + Math.sin(i * 0.4) * 2} 
                    y2={y - 12} 
                    stroke="#d97706" 
                    strokeWidth="1.5" 
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  />
                  <line 
                    x1={x} 
                    y1={y} 
                    x2={x - 3 + Math.sin(i * 0.4) * 2} 
                    y2={y + 12} 
                    stroke="#d97706" 
                    strokeWidth="1.5" 
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  />
                </g>
              );
            })}
          </g>
          
          {/* Advanced Wing Structure */}
          <g>
            {/* Left wing with multiple bones */}
            <g className="animate-bounce">
              <line x1="100" y1="38" x2="85" y2="20" stroke="#b45309" strokeWidth="3" />
              <line x1="85" y1="20" x2="65" y2="10" stroke="#b45309" strokeWidth="2.5" />
              <line x1="65" y1="10" x2="50" y2="15" stroke="#b45309" strokeWidth="2" />
              <line x1="50" y1="15" x2="40" y2="25" stroke="#b45309" strokeWidth="1.5" />
              
              {/* Wing membrane lines */}
              <path d="M100 38 Q85 25 70 15 Q55 20 45 30" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.6" />
              <path d="M90 35 Q75 25 60 20 Q50 25 45 30" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.6" />
            </g>
            
            {/* Right wing with multiple bones */}
            <g className="animate-bounce" style={{ animationDelay: '0.3s' }}>
              <line x1="100" y1="42" x2="85" y2="60" stroke="#b45309" strokeWidth="3" />
              <line x1="85" y1="60" x2="65" y2="70" stroke="#b45309" strokeWidth="2.5" />
              <line x1="65" y1="70" x2="50" y2="65" stroke="#b45309" strokeWidth="2" />
              <line x1="50" y1="65" x2="40" y2="55" stroke="#b45309" strokeWidth="1.5" />
              
              {/* Wing membrane lines */}
              <path d="M100 42 Q85 55 70 65 Q55 60 45 50" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.6" />
              <path d="M90 45 Q75 55 60 60 Q50 55 45 50" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.6" />
            </g>
          </g>
          
          {/* Articulated Arms with Claws */}
          <g>
            {/* Left arm */}
            <g className="animate-pulse" style={{ animationDelay: '0.1s' }}>
              <line x1="90" y1="40" x2="85" y2="55" stroke="#fbbf24" strokeWidth="2.5" />
              <line x1="85" y1="55" x2="80" y2="70" stroke="#fbbf24" strokeWidth="2" />
              <line x1="80" y1="70" x2="75" y2="75" stroke="#f9fafb" strokeWidth="1.5" />
              <line x1="80" y1="70" x2="78" y2="77" stroke="#f9fafb" strokeWidth="1.5" />
              <line x1="80" y1="70" x2="82" y2="77" stroke="#f9fafb" strokeWidth="1.5" />
            </g>
            
            {/* Right arm */}
            <g className="animate-pulse" style={{ animationDelay: '0.2s' }}>
              <line x1="70" y1="40" x2="75" y2="55" stroke="#fbbf24" strokeWidth="2.5" />
              <line x1="75" y1="55" x2="80" y2="70" stroke="#fbbf24" strokeWidth="2" />
              <line x1="80" y1="70" x2="85" y2="75" stroke="#f9fafb" strokeWidth="1.5" />
              <line x1="80" y1="70" x2="82" y2="77" stroke="#f9fafb" strokeWidth="1.5" />
              <line x1="80" y1="70" x2="78" y2="77" stroke="#f9fafb" strokeWidth="1.5" />
            </g>
          </g>
          
          {/* Flowing Serpentine Tail */}
          <g>
            {Array.from({ length: 10 }).map((_, i) => {
              const x = 40 - i * 4;
              const y = 40 + Math.sin(i * 0.6) * 8;
              return (
                <g key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="2" 
                    fill="none" 
                    stroke="#fbbf24" 
                    strokeWidth="1.5"
                  />
                  {i < 9 && (
                    <path 
                      d={`M ${x} ${y} Q ${x - 3} ${y + Math.sin((i + 1) * 0.6) * 4} ${x - 4} ${40 + Math.sin((i + 1) * 0.6) * 8}`}
                      stroke="#d97706" 
                      strokeWidth="2" 
                      fill="none"
                    />
                  )}
                  {/* Tail spikes */}
                  {i % 2 === 0 && (
                    <line 
                      x1={x} 
                      y1={y} 
                      x2={x - 2} 
                      y2={y - 6} 
                      stroke="#b45309" 
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </g>
          
          {/* Enhanced Fire Breath */}
          <g>
            <circle cx="150" cy="35" r="4" fill="#fbbf24" opacity="0.9" className="animate-ping" />
            <circle cx="155" cy="38" r="3" fill="#f59e0b" opacity="0.8" className="animate-ping" style={{ animationDelay: '0.2s' }} />
            <circle cx="160" cy="36" r="2" fill="#ef4444" opacity="0.9" className="animate-ping" style={{ animationDelay: '0.4s' }} />
            <ellipse cx="152" cy="37" rx="6" ry="2" fill="#fbbf24" opacity="0.6" className="animate-pulse" />
          </g>
        </svg>
      </div>
      
      {/* Dynamic Particle System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-ping ${
              i % 3 === 0 ? 'bg-cyan-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Mystical Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-yellow-600/40">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-yellow-400">Status: AWAKENED</span>
          <span className="text-amber-400">Ancient Dragon v∞</span>
          <span className="text-orange-400">Power: ∞</span>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <section id="portfolio" className="section-padding bg-card">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Portfolio</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Featured projects showcasing technical expertise and creative solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-muted rounded-full"></div>
                    <div className="h-6 w-16 bg-muted rounded-full"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 w-20 bg-muted rounded"></div>
                    <div className="h-4 w-16 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Real portfolio projects
  const realProjects = [
    // Original Projects
    {
      id: 1,
      title: "BRAVEZM Gaming",
      description: "Exclusive gaming characters & community platform with zombie mode shop",
      imageUrl: bravezmImage,
      technologies: ["React", "JavaScript", "Gaming API", "Community Features"],
      liveUrl: "https://bravegame.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "BestyBoy Gaming",
      description: "CrossFire vouchers and gaming shop for PUBG, Free Fire with special bonuses",
      imageUrl: bestyBoyImage,
      technologies: ["React", "Express", "Gaming API", "Payment Integration"],
      liveUrl: "https://bestyboy-gamma.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "Ahmed Helly Academy",
      description: "Educational platform with AI Chat, video tutorials, and advanced learning tools",
      imageUrl: ahmedHellyImage,
      technologies: ["React", "Node.js", "AI Integration", "Educational Tools"],
      liveUrl: "https://mr-ahmedhelly.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    // New Projects as requested
    {
      id: 4,
      title: "Eco Eats",
      description: "Food Waste Awareness Campaign - A modern, responsive website for the Eco Eats campaign focusing on reducing food waste among students and teenagers.",
      imageUrl: ecoEatsImage,
      technologies: ["React", "JavaScript", "Environmental Awareness", "Campaign Platform"],
      liveUrl: "https://eco-eats-campaign.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 5,
      title: "BMO Tools",
      description: "Arabic Calculator Tools - Comprehensive website for daily tools and calculators in Arabic and English with full RTL support. Features 10 advanced calculators, BMO advanced encryption system, smart encryption detector, comprehensive unit converter, and bilingual support.",
      imageUrl: bmoToolsImage,
      technologies: ["React", "JavaScript", "RTL Support", "Encryption", "Calculators"],
      liveUrl: "https://bmo-tools.netlify.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 6,
      title: "OneTeam",
      description: "HR company platform for workforce management and team collaboration with comprehensive employee management features.",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      technologies: ["Vue.js", "Laravel", "HR Management", "MySQL"],
      liveUrl: "https://oneteamss.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 7,
      title: "Bemora",
      description: "Content creator blog platform with rich media support and audience engagement features for modern content creators.",
      imageUrl: bemoraNewImage,
      technologies: ["WordPress", "PHP", "Content Management", "SEO"],
      liveUrl: "https://bemora.netlify.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 8,
      title: "MR Mohammed",
      description: "Professional business portfolio and consulting services platform showcasing expertise in digital transformation and business strategy.",
      imageUrl: mrMohammedImage,
      technologies: ["React", "TypeScript", "Business Portfolio", "Consulting"],
      liveUrl: "https://mrmo.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 9,
      title: "Diaa Elden Shop",
      description: "Comprehensive e-commerce platform featuring modern shopping experience, secure payment processing, inventory management, and customer support.",
      imageUrl: diaaEldenImage,
      technologies: ["React", "Node.js", "E-commerce", "Payment Integration", "MongoDB"],
      liveUrl: "https://diaa-elden.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
  ];

  const displayProjects = projects.length > 0 ? projects : realProjects;



  return (
    <section id="portfolio" className="section-padding bg-card">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Portfolio</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Featured projects showcasing technical expertise and creative solutions
          </p>
        </div>

        {/* Interactive Dragon Console */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-primary mb-4">Interactive AI Console</h3>
            <p className="text-muted-foreground">Move your mouse to control the dragon!</p>
          </div>
          <DragonConsole />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project: Project | typeof realProjects[0]) => (
            <Card key={project.id} className="group bg-muted overflow-hidden card-hover">
              {project.imageUrl && (
                <img 
                  src={project.imageUrl}
                  alt={project.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <CardContent className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-primary">{project.title}</CardTitle>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardHeader>

                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex space-x-4">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      <i className="fas fa-external-link-alt mr-1"></i>Live Demo
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
