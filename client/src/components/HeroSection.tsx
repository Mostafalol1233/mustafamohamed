export default function HeroSection() {
  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 section-padding">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
                Hi, I'm <span className="text-accent">Mostafa Mohamed</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-muted-foreground font-medium">
                Expert Full-Stack Developer & AI Specialist
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Professional Portfolio showcasing cutting-edge web development and AI solutions.
              </p>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                مصطفى محمد Mostafa Mohamed - Experienced Full-Stack Web Developer and Software Engineer specializing in React.js, Node.js, TypeScript, JavaScript, Python, and cutting-edge AI technologies. Professional programmer with expertise in building high-performance web applications, responsive portfolio websites, e-commerce platforms, and innovative digital solutions that drive business growth and deliver exceptional user experiences.
              </p>
              <p className="text-lg text-foreground">
                From custom web development to AI integration, database design to user experience optimization - I deliver professional development services that exceed expectations. View my portfolio of successful projects and discover why clients choose Mostafa Mohamed for their development needs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToPortfolio}
                className="btn-primary"
              >
                <i className="fas fa-eye mr-2"></i>View My Work
              </button>
              <button 
                onClick={scrollToContact}
                className="btn-secondary"
              >
                <i className="fas fa-envelope mr-2"></i>Contact Me
              </button>
            </div>
          </div>
          
          <div className="relative animate-float">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Professional web development workspace" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            <div className="absolute -top-6 -right-6 bg-accent text-accent-foreground p-4 rounded-2xl shadow-lg">
              <i className="fas fa-code text-2xl"></i>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg">
              <i className="fas fa-pen-fancy text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
