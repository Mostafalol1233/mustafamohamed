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
          <Card className="card-hover">
            <div className="p-6">
              <img 
                src={certificateImage}
                alt="ALX AI Starter Kit Certificate - Mustafa Muhammad" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl text-primary">ALX AI Starter Kit</CardTitle>
                <p className="text-muted-foreground">Successfully completed AI fundamentals program</p>
              </CardHeader>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Issued: May 2024</span>
                <span className="bg-accent text-accent-foreground px-2 py-1 rounded">Verified</span>
              </div>
            </div>
          </Card>

          {/* Dynamic certificates from database */}
          {certificates.map((certificate: Certificate) => (
            <Card key={certificate.id} className="card-hover group">
              <div className="p-6">
                {certificate.imageUrl && (
                  <img 
                    src={certificate.imageUrl}
                    alt={certificate.title} 
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-primary">{certificate.title}</CardTitle>
                  {certificate.description && (
                    <p className="text-muted-foreground">{certificate.description}</p>
                  )}
                </CardHeader>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Issued: {certificate.issueDate || 'N/A'}</span>
                  <div className="flex items-center space-x-2">
                    <span className="bg-accent text-accent-foreground px-2 py-1 rounded">Verified</span>
                    {isAuthenticated && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCertificateMutation.mutate(certificate.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
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
