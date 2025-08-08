import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ContactSection() {
  const { toast } = useToast();

  const createContactMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; subject?: string; message: string }) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string || undefined,
      message: formData.get("message") as string,
    };

    createContactMutation.mutate(data);
    
    if (createContactMutation.isSuccess) {
      e.currentTarget.reset();
    }
  };

  return (
    <section id="contact" className="section-padding bg-card">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Let's Work Together</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your project to life? Let's discuss how I can help you achieve your goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-muted rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-primary mb-6">Send me a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact-name">Name *</Label>
                  <Input 
                    id="contact-name"
                    name="name" 
                    placeholder="Your name" 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input 
                    id="contact-email"
                    name="email" 
                    type="email"
                    placeholder="your@email.com" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="contact-subject">Subject</Label>
                <Input 
                  id="contact-subject"
                  name="subject" 
                  placeholder="Project inquiry" 
                />
              </div>

              <div>
                <Label htmlFor="contact-message">Message *</Label>
                <Textarea 
                  id="contact-message"
                  name="message" 
                  rows={6}
                  placeholder="Tell me about your project..." 
                  required 
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-accent text-lg py-4"
                disabled={createContactMutation.isPending}
              >
                {createContactMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-6">Get in touch</h3>
              <p className="text-lg text-gray-700 font-medium mb-8">
                I'm always excited to discuss new projects and opportunities. Feel free to reach out through any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Email</h4>
                  <a 
                    href="mailto:overthegardenwall317@gmail.com" 
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                  >
                    overthegardenwall317@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Phone</h4>
                  <a 
                    href="tel:+201500302461" 
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                  >
                    +20 1500302461
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                  <i className="fab fa-twitter"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Twitter/X</h4>
                  <a 
                    href="https://x.com/Bemora_BEMO" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                  >
                    @Bemora_BEMO
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center">
                  <i className="fab fa-youtube"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">YouTube</h4>
                  <a 
                    href="https://www.youtube.com/@Bemora-site" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                  >
                    Bemora-site
                  </a>
                </div>
              </div>
            </div>

            {/* Professional photo for contact section */}
            <div className="mt-8">
              <img 
                src="https://avatars.githubusercontent.com/u/810438?v=4" 
                alt="Professional headshot - jordwalke style" 
                className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
