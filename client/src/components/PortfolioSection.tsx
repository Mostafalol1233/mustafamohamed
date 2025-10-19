import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DragonConsole } from "./DragonConsole";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function PortfolioSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const allTechnologies = Array.from(
    new Set(projects.flatMap((p) => p.technologies || []))
  ).sort();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      searchTerm === "" ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTech = 
      selectedTech === null ||
      (project.technologies && project.technologies.includes(selectedTech));

    return matchesSearch && matchesTech;
  });

  const displayProjects = filteredProjects;

  return (
    <section id="portfolio" className="section-padding bg-card">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Portfolio</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Featured projects showcasing technical expertise and creative solutions
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
              data-testid="input-search-projects"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                data-testid="button-clear-search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Technology Filter */}
          {allTechnologies.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedTech === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTech(null)}
                data-testid="button-filter-all"
              >
                All
              </Button>
              {allTechnologies.map((tech) => (
                <Button
                  key={tech}
                  variant={selectedTech === tech ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                  data-testid={`button-filter-${tech.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {tech}
                </Button>
              ))}
            </div>
          )}
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
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || selectedTech
                  ? "No projects match your search criteria."
                  : "No projects available."}
              </p>
            </div>
          ) : (
            displayProjects.map((project) => (
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
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default PortfolioSection;