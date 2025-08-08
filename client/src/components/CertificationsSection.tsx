import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Certificate } from "@shared/schema";
import certificateImage from "@assets/113-alx-ai-starter-kit-certificate-mustafa-muhammad.png";

export default function CertificationsSection() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ["/api/certificates"],
  });

  const createCertificateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/certificates", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create certificate");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({
        title: "Success",
        description: "Certificate uploaded successfully!",
      });
      setIsUploadOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload certificate",
        variant: "destructive",
      });
    },
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/certificates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({
        title: "Success",
        description: "Certificate deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete certificate",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createCertificateMutation.mutate(formData);
  };

  const displayCertificates = certificates.length > 0 ? certificates : [
    {
      id: "static-1",
      title: "ALX AI Starter Kit Certificate",
      description: "Comprehensive AI and Machine Learning fundamentals course completion",
      imageUrl: null,
      issueDate: "2024",
      isVisible: true,
      verified: true
    },
    {
      id: "static-2",
      title: "Full Stack Web Development",
      description: "Advanced web development with modern frameworks and technologies",
      imageUrl: null,
      issueDate: "2023",
      isVisible: true,
      verified: true
    },
    {
      id: "static-3",
      title: "Database Design & Management",
      description: "Professional database design, optimization and management certification",
      imageUrl: null,
      issueDate: "2023",
      isVisible: true,
      verified: true
    },
    {
      id: "static-4",
      title: "Cloud Computing Fundamentals",
      description: "AWS and cloud infrastructure deployment and management",
      imageUrl: null,
      issueDate: "2022",
      isVisible: true,
      verified: true
    },
    {
      id: "static-5",
      title: "Cybersecurity Essentials",
      description: "Network security, ethical hacking and security best practices",
      imageUrl: null,
      issueDate: "2022",
      isVisible: true,
      verified: true
    },
    {
      id: "static-6",
      title: "Project Management Professional",
      description: "Agile methodology and project lifecycle management certification",
      imageUrl: null,
      issueDate: "2021",
      isVisible: true,
      verified: true
    }
  ];

  if (isLoading) {
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
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
          {displayCertificates.map((certificate: any) => (
            <div key={certificate.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-0">
                <div className="relative">
                  {certificate.id === "static-1" || certificate.id === "cert-1" ? (
                    // ALX AI Certificate with dark blue design matching the reference
                    <div className="relative">
                      <img 
                        src={certificateImage}
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
                    <span className="text-xs text-gray-500">Issued: {certificate.issueDate}</span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  </div>

                  {isAuthenticated && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCertificateMutation.mutate(certificate.id)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 mt-3"
                      disabled={deleteCertificateMutation.isPending}
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload New Certificate */}
        {isAuthenticated && (
          <div className="text-center">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="btn-accent">
                  <i className="fas fa-plus mr-2"></i>Add New Certificate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload New Certificate</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Certificate Title</Label>
                    <Input 
                      id="title"
                      name="title" 
                      placeholder="Enter certificate title" 
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      name="description" 
                      placeholder="Enter certificate description" 
                    />
                  </div>

                  <div>
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input 
                      id="issueDate"
                      name="issueDate" 
                      placeholder="e.g., May 2024" 
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Certificate Image</Label>
                    <Input 
                      id="image"
                      name="image" 
                      type="file" 
                      accept="image/*" 
                      required 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-accent"
                    disabled={createCertificateMutation.isPending}
                  >
                    {createCertificateMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>Uploading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload mr-2"></i>Upload Certificate
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </section>
  );
}