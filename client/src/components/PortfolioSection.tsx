import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@shared/schema";
import { DragonConsole } from "./DragonConsole";
import ecoEatsImage from "@assets/eco-eats-preview.png";
import bmoToolsImage from "@assets/bmo-tools-preview.png";
import bravezmImage from "@assets/image_1748447815242.png";
import bestyBoyImage from "@assets/image_1748447890581.png";
import ahmedHellyImage from "@assets/image_1748448070181.png";
import diaaEldenImage from "@assets/diaa-elden-shop.png";
import mrMohammedImage from "@assets/mr-mohammed.png";
import bemoraNewImage from "@assets/bemora-new.png";

function PortfolioSection() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Real projects data with all 9 projects as requested
  const realProjects = [
    {
      id: 1,
      title: "BRAVEZM Gaming",
      description: "Advanced gaming platform built for professional esports tournaments and casual gaming with real-time matchmaking, comprehensive player statistics, tournament management, and streaming integration.",
      imageUrl: bravezmImage,
      technologies: ["React", "Node.js", "WebSocket", "Gaming APIs", "Tournament Management"],
      liveUrl: "https://bravezm.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "BestyBoy Gaming",
      description: "Next-generation gaming companion platform featuring game discovery, achievement tracking, social gaming features, and personalized gaming recommendations.",
      imageUrl: bestyBoyImage,
      technologies: ["Next.js", "TypeScript", "Gaming APIs", "Social Features", "Achievement System"],
      liveUrl: "https://bestyboy.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "Ahmed Helly Academy",
      description: "Complete educational platform for online learning with course management, interactive lessons, progress tracking, certification system, and student-teacher communication tools.",
      imageUrl: ahmedHellyImage,
      technologies: ["React", "Express", "Educational Tools", "Certificate System", "Progress Tracking"],
      liveUrl: "https://ahmed-helly.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 4,
      title: "Eco Eats",
      description: "Environmental awareness platform focused on sustainable food choices and waste reduction. Features meal planning, carbon footprint tracking, local sustainable restaurant finder, and community challenges for eco-friendly eating habits.",
      imageUrl: ecoEatsImage,
      technologies: ["React", "Node.js", "Environmental APIs", "Sustainability", "Community Features"],
      liveUrl: "https://eco-eats.vercel.app/",
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
            <p className="text-muted-foreground">Move your mouse to control the advanced physics-based dragon!</p>
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

export default PortfolioSection;