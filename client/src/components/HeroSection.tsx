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
                Hi, I'm <span className="text-accent">Mustafa Mohamed</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-muted-foreground font-medium">
                Full-Stack Web Developer & Content Strategist
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                I build high-performance websites and craft content that converts.
              </p>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                With a unique blend of technical proficiency and creative storytelling, I specialize in developing responsive, user-centered web applications — and writing impactful content that drives engagement and delivers results.
              </p>
              <p className="text-lg text-foreground">
                Whether you need a sleek landing page, a custom web solution, or compelling digital content, I bring precision, clarity, and creativity to every project.
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
