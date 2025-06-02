import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Static certificates data
const certificates = [
  {
    id: 1,
    title: "ALX AI Starter Kit Certificate",
    description: "Comprehensive AI and Machine Learning fundamentals course completion",
    issueDate: "2024",
    imageUrl: "/113-alx-ai-starter-kit-certificate-mustafa-muhammad.png",
    isVisible: true
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    description: "Advanced web development with modern frameworks and technologies",
    issueDate: "2023",
    imageUrl: null,
    isVisible: true
  },
  {
    id: 3,
    title: "Database Design & Management",
    description: "Professional database design, optimization and management certification",
    issueDate: "2023",
    imageUrl: null,
    isVisible: true
  },
  {
    id: 4,
    title: "Cloud Computing Fundamentals",
    description: "AWS and cloud infrastructure deployment and management",
    issueDate: "2022",
    imageUrl: null,
    isVisible: true
  },
  {
    id: 5,
    title: "Cybersecurity Essentials",
    description: "Network security, ethical hacking and security best practices",
    issueDate: "2022",
    imageUrl: null,
    isVisible: true
  },
  {
    id: 6,
    title: "Project Management Professional",
    description: "Agile methodology and project lifecycle management certification",
    issueDate: "2021",
    imageUrl: null,
    isVisible: true
  }
];

export default function CertificationsSection() {
  return (
    <section id="certifications" className="section-padding gradient-bg">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Certifications & Achievements</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Continuous learning and professional development in cutting-edge technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 bg-gradient-to-br from-background to-background/50 border-2 hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  {certificate.imageUrl ? (
                    <img
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 certificate-image"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:from-accent/30 group-hover:to-primary/30">
                      <i className="fas fa-certificate text-4xl text-accent transition-all duration-500 group-hover:scale-110 group-hover:text-primary"></i>
                    </div>
                  )}
                </div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-primary transition-colors duration-300 group-hover:text-accent">{certificate.title}</CardTitle>
                  {certificate.description && (
                    <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground">{certificate.description}</p>
                  )}
                </CardHeader>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="transition-colors duration-300 group-hover:text-primary">Issued: {certificate.issueDate || 'N/A'}</span>
                  <div className="flex items-center space-x-2">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">Verified</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}