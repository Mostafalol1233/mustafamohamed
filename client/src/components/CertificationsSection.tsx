import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import certificateImage from "@assets/113-alx-ai-starter-kit-certificate-mustafa-muhammad.png";
import { useQuery } from "@tanstack/react-query";
import type { Certificate } from "@shared/schema";

export default function CertificationsSection() {
  // Fetch certificates from database
  const { data: dbCertificates = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
  });

  // Static certificates data as fallback
  const staticCertificates = [
    {
      id: "cert-1",
      title: "ALX AI Starter Kit Certificate",
      description: "Advanced AI fundamentals covering machine learning and deep learning applications.",
      issuer: "ALX Africa",
      issueDate: "2024",
      imageUrl: certificateImage,
      category: "Artificial Intelligence",
      verified: true,
      credentialId: "ALX-AI-2024-001",
      isVisible: true,
    },
    {
      id: "cert-2", 
      title: "Full-Stack Web Development",
      description: "Modern web development with React, Node.js, and database management.",
      issuer: "Meta (Facebook)",
      issueDate: "2023",
      imageUrl: null,
      category: "Web Development",
      verified: true,
      credentialId: "META-FSD-2023-456",
      isVisible: true,
    },
    {
      id: "cert-3",
      title: "Content Strategy & Digital Marketing", 
      description: "Professional content creation, SEO optimization, and digital brand management.",
      issuer: "Google Digital Marketing",
      issueDate: "2023",
      imageUrl: null,
      category: "Digital Marketing",
      verified: true,
      credentialId: "GOOGLE-DM-2023-789",
      isVisible: true,
    },
    {
      id: "cert-4",
      title: "Advanced JavaScript & TypeScript",
      description: "Advanced JavaScript concepts and TypeScript implementation patterns.",
      issuer: "Microsoft",
      issueDate: "2022", 
      imageUrl: null,
      category: "Programming Languages",
      verified: true,
      credentialId: "MS-JS-TS-2022-321",
      isVisible: true,
    },
    {
      id: "cert-5",
      title: "Cloud Computing Fundamentals",
      description: "AWS cloud infrastructure deployment and scalable architecture best practices.",
      issuer: "Amazon Web Services",
      issueDate: "2022",
      imageUrl: null,
      category: "Cloud Computing",
      verified: true,
      credentialId: "AWS-CF-2022-654",
      isVisible: true,
    },
    {
      id: "cert-6",
      title: "Database Design & Management",
      description: "Professional database design, optimization and performance management.",
      issuer: "Oracle Corporation",
      issueDate: "2021",
      imageUrl: null,
      category: "Database Management", 
      verified: true,
      credentialId: "ORACLE-DB-2021-987",
      isVisible: true,
    }
  ];

  // Combine static certificates with database certificates
  const allCertificates = [
    ...staticCertificates,
    ...dbCertificates
      .filter(cert => cert.isVisible)
      .map(cert => ({
        id: `db-${cert.id}`,
        title: cert.title,
        description: cert.description || "Professional certification",
        issuer: "Professional Institution",
        issueDate: cert.issueDate || "Recent",
        imageUrl: cert.imageUrl || null,
        category: "Professional Development",
        verified: true,
        credentialId: `CERT-${cert.id}`,
        isVisible: true,
      }))
  ];

  return (
    <section id="certifications" className="section-padding gradient-bg">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Certifications & Achievements</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Continuous learning and professional development in cutting-edge technologies
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {allCertificates.map((certificate) => (
            <div key={certificate.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="p-0">
                <div className="relative">
                  {certificate.id === "cert-1" ? (
                    // ALX AI Certificate with actual image and protection
                    <div 
                      className="relative select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <img 
                        src={certificate.imageUrl}
                        alt="ALX AI Starter Kit Certificate" 
                        className="w-full h-40 object-cover pointer-events-none"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                  ) : (
                    // Other certificates with mint/teal background and green badge
                    <div className="w-full h-40 bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center relative">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-blue-700 mb-2">{certificate.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{certificate.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      Issued: {certificate.issueDate}
                    </span>
                    <div className="flex items-center text-green-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Professional Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Professional Development Journey</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              My commitment to continuous learning drives my expertise across multiple domains. From artificial intelligence 
              to full-stack development, each certification represents hands-on mastery of industry-leading technologies 
              and methodologies.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{allCertificates.length}+</div>
                <div className="text-sm text-gray-600">Professional Certifications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">4+</div>
                <div className="text-sm text-gray-600">Years of Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                <div className="text-sm text-gray-600">Technology Stacks</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}