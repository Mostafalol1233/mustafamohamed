import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CertificationsSection from "@/components/CertificationsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation showAdminButton={true} />
      <main>
        <HeroSection />
        <AboutSection />
        <CertificationsSection />
        <PortfolioSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <footer className="bg-secondary text-white py-12">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Mustafa Mohamed</h3>
              <p className="text-gray-300 mb-4">Full-Stack Developer & Content Strategist</p>
              <p className="text-gray-300">Transforming ideas into powerful digital experiences</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-300 hover:text-accent transition-colors">About</a></li>
                <li><a href="#certifications" className="text-gray-300 hover:text-accent transition-colors">Certifications</a></li>
                <li><a href="#portfolio" className="text-gray-300 hover:text-accent transition-colors">Portfolio</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://x.com/Bemora_BEMO" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.youtube.com/@Bemora-site" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="mailto:overthegardenwall317@gmail.com" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">&copy; 2024 Mustafa Mohamed. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
