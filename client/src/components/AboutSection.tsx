export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-card">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">About Mostafa Mohamed</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional Full-Stack Developer & AI Specialist creating innovative digital solutions that drive business success
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern creative workspace" 
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary">Mostafa Mohamed - Transforming Ideas into Digital Reality</h3>
            <p className="text-lg text-foreground leading-relaxed">
              As an expert Full-Stack Developer and AI Specialist, Mostafa Mohamed bridges technical excellence with innovative problem-solving. My portfolio showcases cutting-edge web development, AI integration, and modern digital solutions that deliver measurable results for clients worldwide.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">5+ years of professional web development experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">Certified in AI, Machine Learning, and modern web technologies</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">Expert in React, Node.js, TypeScript, and database optimization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">Portfolio showcasing successful projects and client satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-muted rounded-2xl card-hover">
            <div className="w-16 h-16 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-code text-2xl"></i>
            </div>
            <h4 className="text-xl font-semibold text-primary mb-2">Frontend Development</h4>
            <p className="text-muted-foreground">React, Vue.js, HTML5, CSS3, JavaScript ES6+</p>
          </div>

          <div className="text-center p-6 bg-muted rounded-2xl card-hover">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-server text-2xl"></i>
            </div>
            <h4 className="text-xl font-semibold text-primary mb-2">Backend Development</h4>
            <p className="text-muted-foreground">Node.js, Python, PHP, MySQL, MongoDB</p>
          </div>

          <div className="text-center p-6 bg-muted rounded-2xl card-hover">
            <div className="w-16 h-16 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-pen-nib text-2xl"></i>
            </div>
            <h4 className="text-xl font-semibold text-primary mb-2">Content Strategy</h4>
            <p className="text-muted-foreground">SEO, Copywriting, Digital Marketing, Brand Storytelling</p>
          </div>

          <div className="text-center p-6 bg-muted rounded-2xl card-hover">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-brain text-2xl"></i>
            </div>
            <h4 className="text-xl font-semibold text-primary mb-2">AI Integration</h4>
            <p className="text-muted-foreground">Machine Learning, AI APIs, Automation, Smart Solutions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
