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

  const displayCertificates = certificates as Certificate[];

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
          {/* ALX AI Starter Kit Certificate */}
          <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 bg-gradient-to-br from-background to-background/50 border-2 hover:border-primary/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src={certificateImage}
                  alt="ALX AI Starter Kit Certificate - Mustafa Muhammad" 
                  className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
                    <i className="fas fa-award text-white text-2xl"></i>
                  </div>
                </div>
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl text-primary transition-colors duration-300 group-hover:text-accent">ALX AI Starter Kit</CardTitle>
                <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground">Successfully completed AI fundamentals program</p>
              </CardHeader>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="transition-colors duration-300 group-hover:text-primary">Issued: May 2024</span>
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">Verified</span>
              </div>
            </div>
          </Card>

          {/* Dynamic certificates from database */}
          {displayCertificates.map((certificate: Certificate) => (
            <Card key={certificate.id} className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 bg-gradient-to-br from-background to-background/50 border-2 hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="relative overflow-hidden rounded-lg mb-4">
                {certificate.imageUrl ? (
                  certificate.imageUrl.endsWith('.pdf') ? (
                    <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex flex-col items-center justify-center border-2 border-red-300 transition-all duration-700 group-hover:scale-110 group-hover:from-red-200 group-hover:to-red-300 group-hover:shadow-lg">
                      <i className="fas fa-file-pdf text-4xl text-red-600 mb-2 transition-all duration-500 group-hover:scale-110 group-hover:text-red-700"></i>
                      <span className="text-sm text-red-700 font-medium transition-colors duration-300 group-hover:text-red-800">PDF Certificate</span>
                    </div>
                  ) : (
                    <img
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />
                  )
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:from-accent/30 group-hover:to-primary/30">
                    <i className="fas fa-certificate text-4xl text-accent transition-all duration-500 group-hover:scale-110 group-hover:text-primary"></i>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => certificate.imageUrl && window.open(certificate.imageUrl, '_blank')}
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <i className="fas fa-eye mr-2"></i>View Certificate
                  </Button>
                </div>
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
                    {isAuthenticated && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCertificateMutation.mutate(certificate.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 hover:scale-110"
                        disabled={deleteCertificateMutation.isPending}
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </Button>
                    )}
                  </div>
                </div>
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