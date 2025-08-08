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
      <Navigation showAdminButton={false} />
      <main>
        <HeroSection />
        <AboutSection />
        <CertificationsSection />
        <PortfolioSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Mustafa Mohamed</h3>
              <p className="text-gray-100 mb-4 font-medium">Full-Stack Developer & Content Strategist</p>
              <p className="text-gray-200 font-medium">Transforming ideas into powerful digital experiences</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-100 hover:text-green-400 transition-colors font-medium">About</a></li>
                <li><a href="#certifications" className="text-gray-100 hover:text-green-400 transition-colors font-medium">Certifications</a></li>
                <li><a href="#portfolio" className="text-gray-100 hover:text-green-400 transition-colors font-medium">Portfolio</a></li>
                <li><a href="#contact" className="text-gray-100 hover:text-green-400 transition-colors font-medium">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://x.com/Bemora_BEMO" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors">
                  <i className="fab fa-twitter text-white"></i>
                </a>
                <a href="https://www.youtube.com/@Bemora-site" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors">
                  <i className="fab fa-youtube text-white"></i>
                </a>
                <a href="mailto:overthegardenwall317@gmail.com" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors">
                  <i className="fas fa-envelope text-white"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p className="text-gray-100 font-medium">&copy; 2024 Mustafa Mohamed. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
