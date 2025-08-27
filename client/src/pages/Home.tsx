import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CertificationsSection from "@/components/CertificationsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import AdminDashboard from "@/components/AdminDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <CertificationsSection />
        <PortfolioSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <footer className="bg-secondary text-white py-8">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-xl font-bold mb-2">Mustafa Mohamed</h3>
              <p className="text-gray-300 text-sm">Full-Stack Developer & Content Strategist</p>
              <p className="text-gray-300 text-sm">Transforming ideas into powerful digital experiences</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <a href="#certifications" className="text-gray-300 hover:text-accent transition-colors text-sm px-2 py-1 rounded border border-gray-600">Certifications</a>
                <a href="#portfolio" className="text-gray-300 hover:text-accent transition-colors text-sm px-2 py-1 rounded border border-gray-600">Portfolio</a>
                <a href="#contact" className="text-gray-300 hover:text-accent transition-colors text-sm px-2 py-1 rounded border border-gray-600">Contact</a>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-semibold mb-2">Connect</h4>
              <div className="flex justify-center md:justify-start space-x-3">
                <a href="https://x.com/Bemora_BEMO" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <i className="fab fa-twitter text-sm"></i>
                </a>
                <a href="https://www.youtube.com/@Bemora-site" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <i className="fab fa-youtube text-sm"></i>
                </a>
                <a href="mailto:overthegardenwall317@gmail.com" className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <i className="fas fa-envelope text-sm"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-4 text-center">
            <p className="text-gray-300 text-sm">&copy; 2024 Mustafa Mohamed. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <AdminDashboard />
    </div>
  );
}
