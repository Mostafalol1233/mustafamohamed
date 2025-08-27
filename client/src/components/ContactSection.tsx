import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
// Using a professional contact image URL instead of local asset

export default function ContactSection() {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Show success message (no actual database save)
    toast({
      title: "Message Sent!",
      description: "Thank you for your message. I'll get back to you soon!",
    });
    
    // Reset form
    e.currentTarget.reset();
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
              >
                <i className="fas fa-paper-plane mr-2"></i>Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-muted rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-primary mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Email</h4>
                    <a 
                      href="mailto:overthegardenwall317@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      overthegardenwall317@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-400 text-white rounded-lg flex items-center justify-center">
                    <i className="fab fa-twitter text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Twitter</h4>
                    <a 
                      href="https://twitter.com/Bemora_BEMO"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      @Bemora_BEMO
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center">
                    <i className="fab fa-youtube text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">YouTube</h4>
                    <a 
                      href="https://youtube.com/@Bemora-site"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      @Bemora-site
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center">
                    <i className="fas fa-link text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Linktree</h4>
                    <a 
                      href="https://linktr.ee/Mustafa_Bemo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      linktr.ee/Mustafa_Bemo
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Image with Protection */}
            <div 
              className="relative select-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600"
                alt="Mustafa Mohamed - Full Stack Developer" 
                className="w-full h-64 object-cover rounded-2xl shadow-lg pointer-events-none"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-xl font-bold">Mustafa Mohamed</h4>
                <p className="text-white/90">Full-Stack Developer & Content Strategist</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Contact Info with Animation */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-muted rounded-2xl p-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer group">
            <div className="w-16 h-16 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-foreground group-hover:text-accent transition-colors duration-300">
              <i className="fas fa-clock text-2xl"></i>
            </div>
            <h4 className="text-xl font-semibold text-primary group-hover:text-primary-foreground mb-2 transition-colors duration-300">Response Time</h4>
            <p className="text-muted-foreground group-hover:text-primary-foreground/80 transition-colors duration-300">Usually within 24 hours</p>
          </div>
          
          <div className="bg-muted rounded-2xl p-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer group">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-foreground group-hover:text-primary transition-colors duration-300">
              <i className="fas fa-calendar text-2xl"></i>
            </div>
            <h4 className="text-xl font-semibold text-primary group-hover:text-primary-foreground mb-2 transition-colors duration-300">Availability</h4>
            <p className="text-muted-foreground group-hover:text-primary-foreground/80 transition-colors duration-300">Currently accepting new projects</p>
          </div>
          
          <div className="bg-muted rounded-2xl p-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer group">
            <div className="w-16 h-16 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-foreground group-hover:text-accent transition-colors duration-300">
              <i className="fas fa-handshake text-2xl"></i>
            </div>
            <h4 className="text-xl font-semibold text-primary group-hover:text-primary-foreground mb-2 transition-colors duration-300">Consultation</h4>
            <p className="text-muted-foreground group-hover:text-primary-foreground/80 transition-colors duration-300">Free initial consultation</p>
          </div>
        </div>
      </div>
    </section>
  );
}