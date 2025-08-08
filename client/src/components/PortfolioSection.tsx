
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
        <svg width="200" height="120" viewBox="0 0 200 120" className="drop-shadow-2xl">
          {/* Realistic Dragon Head */}
          <g className="animate-pulse">
            {/* Dragon skull */}
            <path 
              d="M150 55 Q170 45 185 55 Q190 65 185 75 Q175 85 155 80 Q145 70 150 55 Z" 
              fill="none" 
              stroke="#fbbf24" 
              strokeWidth="3"
            />
            
            {/* Glowing eyes */}
            <circle cx="165" cy="60" r="4" fill="#ef4444" opacity="0.9" className="animate-ping" />
            <circle cx="175" cy="58" r="3.5" fill="#dc2626" opacity="0.8" className="animate-ping" style={{ animationDelay: '0.5s' }} />
            
            {/* Jaw with teeth */}
            <path d="M155 70 Q170 75 185 70 Q183 82 155 78 Z" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="165" y1="70" x2="165" y2="78" stroke="#f9fafb" strokeWidth="2" />
            <line x1="172" y1="70" x2="172" y2="76" stroke="#f9fafb" strokeWidth="2" />
            <line x1="178" y1="70" x2="178" y2="75" stroke="#f9fafb" strokeWidth="2" />
          </g>
          
          {/* Dragon Body and Spine */}
          <g>
            <path d="M150 60 Q120 62 90 60 Q60 58 30 60 Q10 62 5 60" stroke="#fbbf24" strokeWidth="3.5" fill="none" className="animate-pulse" />
            
            {Array.from({ length: 15 }).map((_, i) => {
              const x = 150 - i * 10;
              const y = 60 + Math.sin(i * 0.3) * 3;
              return (
                <g key={i}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="3" 
                    fill="none" 
                    stroke="#fbbf24" 
                    strokeWidth="2.5" 
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                  {/* Detailed ribs */}
                  <line 
                    x1={x} 
                    y1={y} 
                    x2={x - 4 + Math.sin(i * 0.5) * 3} 
                    y2={y - 18} 
                    stroke="#d97706" 
                    strokeWidth="2" 
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                  <line 
                    x1={x} 
                    y1={y} 
                    x2={x - 4 + Math.sin(i * 0.5) * 3} 
                    y2={y + 18} 
                    stroke="#d97706" 
                    strokeWidth="2" 
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                </g>
              );
            })}
          </g>
          
          {/* Realistic Wing Structure */}
          <g>
            {/* Upper Wing */}
            <g className="animate-bounce">
              {/* Main wing bone */}
              <line x1="130" y1="58" x2="100" y2="25" stroke="#b45309" strokeWidth="4" />
              <line x1="100" y1="25" x2="70" y2="15" stroke="#b45309" strokeWidth="3.5" />
              <line x1="70" y1="15" x2="45" y2="20" stroke="#b45309" strokeWidth="3" />
              <line x1="45" y1="20" x2="25" y2="35" stroke="#b45309" strokeWidth="2.5" />
              
              {/* Wing fingers */}
              <line x1="100" y1="25" x2="85" y2="10" stroke="#b45309" strokeWidth="2.5" />
              <line x1="70" y1="15" x2="55" y2="8" stroke="#b45309" strokeWidth="2" />
              <line x1="45" y1="20" x2="35" y2="15" stroke="#b45309" strokeWidth="2" />
              
              {/* Wing membrane */}
              <path d="M130 58 Q100 30 70 20 Q45 25 30 40 Q40 35 55 30 Q80 25 110 35 Q125 45 130 58" 
                    fill="rgba(180, 83, 9, 0.3)" 
                    stroke="#92400e" 
                    strokeWidth="1.5" />
              
              {/* Wing support lines */}
              <path d="M120 50 Q90 25 60 20" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.7" />
              <path d="M110 45 Q80 22 50 18" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.7" />
            </g>
            
            {/* Lower Wing */}
            <g className="animate-bounce" style={{ animationDelay: '0.4s' }}>
              {/* Main wing bone */}
              <line x1="130" y1="62" x2="100" y2="95" stroke="#b45309" strokeWidth="4" />
              <line x1="100" y1="95" x2="70" y2="105" stroke="#b45309" strokeWidth="3.5" />
              <line x1="70" y1="105" x2="45" y2="100" stroke="#b45309" strokeWidth="3" />
              <line x1="45" y1="100" x2="25" y2="85" stroke="#b45309" strokeWidth="2.5" />
              
              {/* Wing fingers */}
              <line x1="100" y1="95" x2="85" y2="110" stroke="#b45309" strokeWidth="2.5" />
              <line x1="70" y1="105" x2="55" y2="112" stroke="#b45309" strokeWidth="2" />
              <line x1="45" y1="100" x2="35" y2="105" stroke="#b45309" strokeWidth="2" />
              
              {/* Wing membrane */}
              <path d="M130 62 Q100 90 70 100 Q45 95 30 80 Q40 85 55 90 Q80 95 110 85 Q125 75 130 62" 
                    fill="rgba(180, 83, 9, 0.3)" 
                    stroke="#92400e" 
                    strokeWidth="1.5" />
              
              {/* Wing support lines */}
              <path d="M120 70 Q90 95 60 100" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.7" />
              <path d="M110 75 Q80 98 50 102" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.7" />
            </g>
          </g>
          
          {/* Dragon Arms */}
          <g>
            {/* Left arm */}
            <g className="animate-pulse" style={{ animationDelay: '0.15s' }}>
              <line x1="110" y1="60" x2="105" y2="85" stroke="#fbbf24" strokeWidth="3.5" />
              <line x1="105" y1="85" x2="100" y2="110" stroke="#fbbf24" strokeWidth="3" />
              <line x1="100" y1="110" x2="95" y2="118" stroke="#f9fafb" strokeWidth="2" />
              <line x1="100" y1="110" x2="97" y2="120" stroke="#f9fafb" strokeWidth="2" />
              <line x1="100" y1="110" x2="103" y2="120" stroke="#f9fafb" strokeWidth="2" />
            </g>
            
            {/* Right arm */}
            <g className="animate-pulse" style={{ animationDelay: '0.25s' }}>
              <line x1="90" y1="60" x2="95" y2="85" stroke="#fbbf24" strokeWidth="3.5" />
              <line x1="95" y1="85" x2="100" y2="110" stroke="#fbbf24" strokeWidth="3" />
              <line x1="100" y1="110" x2="105" y2="118" stroke="#f9fafb" strokeWidth="2" />
              <line x1="100" y1="110" x2="102" y2="120" stroke="#f9fafb" strokeWidth="2" />
              <line x1="100" y1="110" x2="98" y2="120" stroke="#f9fafb" strokeWidth="2" />
            </g>
          </g>
          
          {/* Serpentine Tail */}
          <g>
            {Array.from({ length: 12 }).map((_, i) => {
              const x = 30 - i * 5;
              const y = 60 + Math.sin(i * 0.7) * 12;
              return (
                <g key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="2.5" 
                    fill="none" 
                    stroke="#fbbf24" 
                    strokeWidth="2"
                  />
                  {i < 11 && (
                    <path 
                      d={`M ${x} ${y} Q ${x - 4} ${y + Math.sin((i + 1) * 0.7) * 6} ${x - 5} ${60 + Math.sin((i + 1) * 0.7) * 12}`}
                      stroke="#d97706" 
                      strokeWidth="2.5" 
                      fill="none"
                    />
                  )}
                </g>
              );
            })}
          </g>
          
          {/* Enhanced Fire Breath */}
          <g>
            <ellipse cx="190" cy="55" rx="8" ry="4" fill="#fbbf24" opacity="0.8" className="animate-ping" />
            <circle cx="195" cy="58" r="4" fill="#f59e0b" opacity="0.7" className="animate-ping" style={{ animationDelay: '0.3s' }} />
            <circle cx="200" cy="56" r="3" fill="#ef4444" opacity="0.9" className="animate-ping" style={{ animationDelay: '0.6s' }} />
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
