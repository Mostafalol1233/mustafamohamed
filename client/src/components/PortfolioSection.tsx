import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragonConsole } from "./DragonConsole";
import ecoEatsImage from "@assets/eco-eats-preview.png";
import bmoToolsImage from "@assets/bmo-tools-preview.png";
import bravezmImage from "@assets/image_1748447815242.png";
import bestyBoyImage from "@assets/image_1748447890581.png";
import ahmedHellyImage from "@assets/image_1748448070181.png";
import diaaEldenImage from "@assets/diaa-elden-shop.png";
import mrMohammedImage from "@assets/mr-mohammed.png";
import bemoraNewImage from "@assets/bemora-new.png";
import oneTeamImage from "@assets/one-team-logo_1756325440379.png";

function PortfolioSection() {
  // Static projects data - all data is now hardcoded to avoid database dependencies
  const staticProjects = [
    {
      id: 1,
      title: "BRAVEZM Gaming",
      description: "منصة العاب تجمع بين التسلية والتنافس في عالم الألعاب الإلكترونية",
      imageUrl: bravezmImage,
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://bravezm.vercel.app",
      githubUrl: "https://github.com/mustafa-mahmud/bravezm",
      featured: true
    },
    {
      id: 2, 
      title: "BestyBoy Gaming",
      description: "تطبيق ويب متقدم للألعاب مع واجهة مستخدم عصرية وتجربة تفاعلية ممتازة",
      imageUrl: bestyBoyImage,
      technologies: ["React", "Node.js", "Express"],
      liveUrl: "https://bestyboy.vercel.app",
      githubUrl: "https://github.com/mustafa-mahmud/bestyboy",
      featured: true
    },
    {
      id: 3,
      title: "Ahmed Helly Academy",
      description: "منصة تعليمية شاملة لتعلم البرمجة وتطوير المهارات التقنية",
      imageUrl: ahmedHellyImage, 
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://ahmed-helly-academy.vercel.app",
      githubUrl: "https://github.com/mustafa-mahmud/ahmed-helly-academy",
      featured: true
    },
    {
      id: 4,
      title: "Eco Eats",
      description: "حملة توعوية لتقليل هدر الطعام وتعزيز الاستدامة البيئية",
      imageUrl: ecoEatsImage,
      technologies: ["React", "CSS3", "Environmental Awareness"],
      liveUrl: "https://eco-eats-campaign.vercel.app",
      githubUrl: "https://github.com/mustafa-mahmud/eco-eats",
      featured: false
    },
    {
      id: 5,
      title: "BMO Tools",
      description: "مجموعة أدوات الحاسبة العربية مع دعم كامل للغة العربية والتصميم RTL",
      imageUrl: bmoToolsImage,
      technologies: ["React", "RTL Support", "Arabic UI"],
      liveUrl: "https://bmo-tools.vercel.app",
      githubUrl: "https://github.com/mustafa-mahmud/bmo-tools",
      featured: false
    },
    {
      id: 6,
      title: "OneTeam",
      description: "منصة إدارة الفرق والمشاريع مع أدوات التعاون المتقدمة",
      imageUrl: oneTeamImage,
      technologies: ["React", "Team Management", "Collaboration"],
      liveUrl: "https://oneteamss.vercel.app",
      githubUrl: "https://github.com/mustafa-mahmud/oneteam",
      featured: false
    },
    {
      id: 7,
      title: "Bemora",
      description: "تطبيق متقدم للإدارة والتنظيم مع واجهة مستخدم حديثة",
      imageUrl: bemoraNewImage,
      technologies: ["React", "Management", "Modern UI"],
      liveUrl: "https://bemora.netlify.app",
      githubUrl: "https://github.com/mustafa-mahmud/bemora",
      featured: false
    },
    {
      id: 8,
      title: "MR Mohammed",
      description: "منصة احترافية لخدمات الأعمال والاستشارات الرقمية",
      imageUrl: mrMohammedImage,
      technologies: ["React", "Business", "Consulting"],
      liveUrl: "https://mrmo.vercel.app",
      githubUrl: "https://github.com/mustafa-mahmud/mr-mohammed",
      featured: false
    },
    {
      id: 9,
      title: "Diaa Elden Shop",
      description: "متجر إلكتروني متطور للألعاب مع نظام دفع آمن وإدارة المخزون",
      imageUrl: diaaEldenImage,
      technologies: ["React", "E-commerce", "Gaming"],
      liveUrl: "https://diaa-elden.vercel.app",
      githubUrl: "https://github.com/mustafa-mahmud/diaa-elden-shop",
      featured: false
    },
  ];

  const displayProjects = staticProjects;

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
          {displayProjects.map((project) => (
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