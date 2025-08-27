import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import certificateImage from "@assets/113-alx-ai-starter-kit-certificate-mustafa-muhammad.png";

export default function CertificationsSection() {
  // Static certificates data - no database dependency
  const staticCertificates = [
    {
      id: "cert-1",
      title: "ALX AI Starter Kit Certificate",
      description: "Advanced artificial intelligence fundamentals and applications certificate from ALX program, covering machine learning, deep learning, and AI implementation strategies.",
      issueDate: "2024",
      imageUrl: certificateImage,
      isVisible: true,
    },
    {
      id: "cert-2",
      title: "Full-Stack Web Development",
      description: "Comprehensive certification in modern web development technologies including React, Node.js, database management, and deployment strategies.",
      issueDate: "2023",
      imageUrl: null,
      isVisible: true,
    },
    {
      id: "cert-3",
      title: "Content Strategy & Digital Marketing",
      description: "Professional certification in content creation, SEO optimization, social media marketing, and digital brand management.",
      issueDate: "2023",
      imageUrl: null,
      isVisible: true,
    },
    {
      id: "cert-4",
      title: "Advanced JavaScript & TypeScript",
      description: "Specialized certification covering advanced JavaScript concepts, TypeScript implementation, and modern development patterns.",
      issueDate: "2022",
      imageUrl: null,
      isVisible: true,
    },
    {
      id: "cert-5",
      title: "Cloud Computing Fundamentals",
      description: "AWS and cloud infrastructure deployment and management certification covering scalable architecture and best practices.",
      issueDate: "2022",
      imageUrl: null,
      isVisible: true,
    },
    {
      id: "cert-6",
      title: "Database Design & Management",
      description: "Professional database design, optimization and management certification with focus on performance and security.",
      issueDate: "2021",
      imageUrl: null,
      isVisible: true,
    },
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {staticCertificates.map((certificate) => (
            <div key={certificate.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-0">
                <div className="relative">
                  {certificate.id === "cert-1" ? (
                    // ALX AI Certificate with actual image
                    <div className="relative">
                      <img 
                        src={certificate.imageUrl}
                        alt="ALX AI Starter Kit Certificate" 
                        className="w-full h-40 object-cover"
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
                <div className="text-3xl font-bold text-blue-600 mb-2">6+</div>
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