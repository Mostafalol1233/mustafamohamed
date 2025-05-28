
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@shared/schema";
import bravezmImage from "@assets/image_1748447815242.png";
import bestyBoyImage from "@assets/image_1748447890581.png";
import ahmedHellyImage from "@assets/image_1748448070181.png";

export default function PortfolioSection() {
  const { data: projects = [], isLoading } = useQuery({
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
      title: "Bemora",
      description: "Content creator blog platform with rich media support and audience engagement",
      imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      technologies: ["WordPress", "PHP", "Content Management", "SEO"],
      liveUrl: "https://bemora.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "OneTeam",
      description: "HR company platform for workforce management and team collaboration",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      technologies: ["Vue.js", "Laravel", "HR Management", "MySQL"],
      liveUrl: "https://oneteam1.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
    {
      id: 4,
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
      id: 5,
      title: "Ahmed Helly Academy",
      description: "Educational platform with AI Chat, video tutorials, and advanced learning tools",
      imageUrl: ahmedHellyImage,
      technologies: ["React", "Node.js", "AI Integration", "Educational Tools"],
      liveUrl: "https://mr-ahmedhelly.vercel.app/",
      githubUrl: "https://github.com/mustafa-mohamed",
      isVisible: true,
      createdAt: new Date(),
    },
  ];

  const displayProjects = projects.length > 0 ? projects : realProjects;

  const sampleProjects = [
    {
      id: 1,
      title: "Professional Portfolio Website",
      description: "A full-stack portfolio website built with React, TypeScript, and Express. Features include admin dashboard, reviews system, contact forms, and certificate management.",
      technologies: ["React", "TypeScript", "Express", "PostgreSQL", "TailwindCSS"],
      liveUrl: window.location.origin,
      githubUrl: "https://github.com/username/portfolio",
      imageUrl: null,
      isVisible: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Task Management System",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      technologies: ["React", "Socket.io", "Express", "MongoDB"],
      liveUrl: "https://example-tasks.com",
      githubUrl: "https://github.com/username/task-manager",
      imageUrl: null,
      isVisible: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A responsive weather dashboard that displays current conditions and forecasts using OpenWeatherMap API with beautiful data visualizations.",
      technologies: ["React", "Chart.js", "OpenWeatherMap API", "CSS Grid"],
      liveUrl: "https://example-weather.com",
      githubUrl: "https://github.com/username/weather-dashboard",
      imageUrl: null,
      isVisible: true,
      createdAt: new Date().toISOString()
    }
  ];

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
