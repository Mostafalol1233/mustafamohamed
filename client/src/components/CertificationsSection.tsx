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

  const displayCertificates = [
    {
      id: 1,
      title: "ALX AI Starter Kit Certificate",
      description: "Comprehensive AI and Machine Learning fundamentals course completion",
      imageUrl: null,
      issueDate: "2024",
      isVisible: true,
      verified: true
    },
    {
      id: 2,
      title: "Full Stack Web Development",
      description: "Advanced web development with modern frameworks and technologies",
      imageUrl: null,
      issueDate: "2023",
      isVisible: true,
      verified: true
    },
    {
      id: 3,
      title: "Database Design & Management",
      description: "Professional database design, optimization and management certification",
      imageUrl: null,
      issueDate: "2023",
      isVisible: true,
      verified: true
    },
    {
      id: 4,
      title: "Cloud Computing Fundamentals",
      description: "AWS and cloud infrastructure deployment and management",
      imageUrl: null,
      issueDate: "2022",
      isVisible: true,
      verified: true
    },
    {
      id: 5,
      title: "Cybersecurity Essentials",
      description: "Network security, ethical hacking and security best practices",
      imageUrl: null,
      issueDate: "2022",
      isVisible: true,
      verified: true
    },
    {
      id: 6,
      title: "Project Management Professional",
      description: "Agile methodology and project lifecycle management certification",
      imageUrl: null,
      issueDate: "2021",
      isVisible: true,
      verified: true
    },
    ...(certificates as Certificate[]),
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayCertificates.map((certificate: any) => (
            <Card key={certificate.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="relative mb-4">
                  {certificate.id === 1 ? (
                    // ALX AI Certificate with special dark blue background
                    <div className="w-full h-48 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                      <div className="absolute top-4 left-4 text-xs text-blue-200">ALX</div>
                      <div className="absolute top-4 right-4 text-xs text-blue-200">ACHIEVEMENT</div>
                      <div className="text-center z-10">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-3">
                          <i className="fas fa-robot text-2xl text-white"></i>
                        </div>
                        <h3 className="font-bold text-lg text-white">AI Muhammad</h3>
                        <p className="text-sm text-blue-200 mt-1">Artificial Intelligence and Machine Learning</p>
                      </div>
                      <div className="absolute bottom-4 left-4 text-xs text-blue-200">Issued: {certificate.issueDate}</div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Verified</span>
                      </div>
                    </div>
                  ) : (
                    // Other certificates with modern card design
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex flex-col items-center justify-center relative">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                        <i className="fas fa-check text-white text-xl"></i>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Verified</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">{certificate.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{certificate.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                    <span>Issued: {certificate.issueDate}</span>
                  </div>
                </div>

                {isAuthenticated && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCertificateMutation.mutate(certificate.id)}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 mt-4"
                    disabled={deleteCertificateMutation.isPending}
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </Button>
                )}
              </div>
            </Card>
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