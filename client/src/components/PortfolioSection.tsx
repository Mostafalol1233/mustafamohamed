
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
        <div className="text-cyan-300 animate-pulse" style={{ animationDelay: '0.5s' }}>{'> Dragon.exe running'}</div>
        <div className="text-blue-300 animate-pulse" style={{ animationDelay: '1s' }}>{'> Mouse tracking enabled'}</div>
        <div className="text-purple-300 animate-pulse" style={{ animationDelay: '1.5s' }}>{'> AI Dragon initialized'}</div>
      </div>
      
      {/* Interactive Dragon with Joints */}
      <div 
        className="absolute transition-all duration-300 ease-out transform hover:scale-125"
        style={{
          left: `${dragonPosition.x}%`,
          top: `${dragonPosition.y}%`,
          transform: `translate(-50%, -50%) rotate(${(mousePosition.x - dragonPosition.x) * 0.1}deg)`
        }}
      >
        <div className="relative">
          {/* Dragon Body with Articulated Joints */}
          <div className="w-16 h-10 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full relative animate-pulse shadow-lg">
            
            {/* Dragon Head with Moving Parts */}
            <div className="absolute -right-3 top-2 w-8 h-6 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transform hover:scale-110 transition-transform">
              {/* Animated Eyes */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-red-900 rounded-full animate-ping"></div>
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-900 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              {/* Dragon Mouth */}
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-red-700 rounded-full animate-bounce"></div>
            </div>
            
            {/* Articulated Tail with Multiple Joints */}
            <div className="absolute -left-4 top-3 w-10 h-6 bg-gradient-to-l from-red-600 to-red-800 rounded-full transform rotate-12 animate-pulse">
              <div className="absolute -left-3 top-1 w-8 h-4 bg-gradient-to-l from-red-800 to-red-900 rounded-full transform -rotate-6 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute -left-5 top-2 w-6 h-2 bg-gradient-to-l from-red-900 to-purple-800 rounded-full transform rotate-3 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
            
            {/* Animated Wings with Joint Movement */}
            <div className="absolute -top-3 left-3 w-6 h-8 bg-gradient-to-t from-blue-600 to-purple-500 rounded-full transform -rotate-12 animate-bounce opacity-80 shadow-lg"></div>
            <div className="absolute -top-3 right-3 w-6 h-8 bg-gradient-to-t from-blue-600 to-purple-500 rounded-full transform rotate-12 animate-bounce opacity-80 shadow-lg" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Dragon Legs with Joint Articulation */}
            <div className="absolute -bottom-2 left-2 w-2 h-4 bg-orange-600 rounded-full transform rotate-6 animate-pulse"></div>
            <div className="absolute -bottom-2 right-2 w-2 h-4 bg-orange-600 rounded-full transform -rotate-6 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
          
          {/* Dragon Fire Breath Effect */}
          <div className="absolute -right-8 top-3 flex space-x-1">
            <div className="w-3 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-1 bg-red-500 rounded-full animate-ping"></div>
            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
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
