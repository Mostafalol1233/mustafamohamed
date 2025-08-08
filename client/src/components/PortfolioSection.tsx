
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
      className="relative w-full h-80 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-xl overflow-hidden border border-cyan-500/30 shadow-2xl cursor-none"
    >
      {/* Console Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-16 grid-rows-12 h-full">
          {Array.from({ length: 192 }).map((_, i) => (
            <div key={i} className="border border-cyan-500/10"></div>
          ))}
        </div>
      </div>
      
      {/* Animated Console Text */}
      <div className="absolute top-4 left-4 text-green-400 font-mono text-sm space-y-1">
        <div className="animate-pulse">{'> System Active...'}</div>
        <div className="text-cyan-300 animate-pulse" style={{ animationDelay: '0.5s' }}>{'> Skeletal_Dragon.exe running'}</div>
        <div className="text-blue-300 animate-pulse" style={{ animationDelay: '1s' }}>{'> Mouse tracking enabled'}</div>
        <div className="text-purple-300 animate-pulse" style={{ animationDelay: '1.5s' }}>{'> Bone Dragon initialized'}</div>
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
        <svg width="120" height="60" viewBox="0 0 120 60" className="drop-shadow-lg">
          {/* Dragon Skull */}
          <g className="animate-pulse">
            {/* Skull outline */}
            <path 
              d="M85 25 Q95 20 100 25 Q102 30 98 35 Q95 40 85 38 Q80 35 85 25 Z" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="2"
              className="animate-pulse"
            />
            
            {/* Eye sockets */}
            <circle cx="90" cy="28" r="3" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" />
            <circle cx="95" cy="26" r="2.5" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" style={{ animationDelay: '0.5s' }} />
            
            {/* Jaw */}
            <path 
              d="M88 35 Q95 38 100 35 Q98 40 88 38 Z" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="1.5"
            />
            
            {/* Teeth */}
            <line x1="92" y1="35" x2="92" y2="38" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="96" y1="35" x2="96" y2="37" stroke="#f3f4f6" strokeWidth="1" />
          </g>
          
          {/* Spine/Vertebrae */}
          <g>
            {/* Main spine */}
            <line x1="85" y1="30" x2="20" y2="30" stroke="#10b981" strokeWidth="2" className="animate-pulse" />
            
            {/* Vertebrae */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <circle 
                  cx={85 - i * 8} 
                  cy="30" 
                  r="2" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="1.5" 
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
                {/* Rib bones */}
                <line 
                  x1={85 - i * 8} 
                  y1="30" 
                  x2={85 - i * 8 - 2} 
                  y2="20" 
                  stroke="#10b981" 
                  strokeWidth="1" 
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
                <line 
                  x1={85 - i * 8} 
                  y1="30" 
                  x2={85 - i * 8 - 2} 
                  y2="40" 
                  stroke="#10b981" 
                  strokeWidth="1" 
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              </g>
            ))}
          </g>
          
          {/* Wing Bones */}
          <g>
            {/* Left Wing */}
            <g className="animate-bounce">
              <line x1="70" y1="28" x2="60" y2="15" stroke="#06b6d4" strokeWidth="2" />
              <line x1="60" y1="15" x2="45" y2="10" stroke="#06b6d4" strokeWidth="1.5" />
              <line x1="45" y1="10" x2="35" y2="18" stroke="#06b6d4" strokeWidth="1" />
              <line x1="70" y1="28" x2="55" y2="25" stroke="#06b6d4" strokeWidth="1" />
              <line x1="55" y1="25" x2="40" y2="22" stroke="#06b6d4" strokeWidth="1" />
            </g>
            
            {/* Right Wing */}
            <g className="animate-bounce" style={{ animationDelay: '0.5s' }}>
              <line x1="70" y1="32" x2="60" y2="45" stroke="#06b6d4" strokeWidth="2" />
              <line x1="60" y1="45" x2="45" y2="50" stroke="#06b6d4" strokeWidth="1.5" />
              <line x1="45" y1="50" x2="35" y2="42" stroke="#06b6d4" strokeWidth="1" />
              <line x1="70" y1="32" x2="55" y2="35" stroke="#06b6d4" strokeWidth="1" />
              <line x1="55" y1="35" x2="40" y2="38" stroke="#06b6d4" strokeWidth="1" />
            </g>
          </g>
          
          {/* Tail Bones */}
          <g>
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                <circle 
                  cx={20 - i * 6} 
                  cy={30 + Math.sin(i * 0.5) * 3} 
                  r="1.5" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="1"
                />
                {i < 5 && (
                  <line 
                    x1={20 - i * 6} 
                    y1={30 + Math.sin(i * 0.5) * 3} 
                    x2={20 - (i + 1) * 6} 
                    y2={30 + Math.sin((i + 1) * 0.5) * 3} 
                    stroke="#10b981" 
                    strokeWidth="1.5"
                  />
                )}
              </g>
            ))}
          </g>
          
          {/* Leg Bones */}
          <g>
            {/* Front legs */}
            <line x1="65" y1="30" x2="65" y2="45" stroke="#10b981" strokeWidth="2" className="animate-pulse" />
            <line x1="65" y1="45" x2="62" y2="52" stroke="#10b981" strokeWidth="1.5" />
            <line x1="65" y1="45" x2="68" y2="52" stroke="#10b981" strokeWidth="1.5" />
            
            {/* Back legs */}
            <line x1="45" y1="30" x2="45" y2="45" stroke="#10b981" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
            <line x1="45" y1="45" x2="42" y2="52" stroke="#10b981" strokeWidth="1.5" />
            <line x1="45" y1="45" x2="48" y2="52" stroke="#10b981" strokeWidth="1.5" />
          </g>
          
          {/* Fire Breath Effect */}
          <g>
            <circle cx="105" cy="25" r="3" fill="#fbbf24" opacity="0.8" className="animate-ping" />
            <circle cx="110" cy="28" r="2" fill="#f59e0b" opacity="0.6" className="animate-ping" style={{ animationDelay: '0.3s' }} />
            <circle cx="115" cy="26" r="1.5" fill="#ef4444" opacity="0.9" className="animate-ping" style={{ animationDelay: '0.6s' }} />
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
      
      {/* Console Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 border border-cyan-500/30">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-green-400">Status: ONLINE</span>
          <span className="text-cyan-400">Dragon AI v3.0</span>
          <span className="text-purple-400">FPS: 60</span>
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
