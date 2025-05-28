export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-card">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate about creating digital experiences that make a difference
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
            <h3 className="text-3xl font-bold text-primary">Transforming Ideas into Digital Reality</h3>
            <p className="text-lg text-foreground leading-relaxed">
              As a full-stack developer with a passion for content strategy, I bridge the gap between technical excellence and compelling storytelling. My approach combines cutting-edge development practices with user-centered design principles.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">5+ years of web development experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">Certified in AI and modern web technologies</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">Content strategy and digital marketing expertise</span>
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
