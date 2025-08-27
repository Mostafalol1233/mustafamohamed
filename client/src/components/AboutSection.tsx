import mrMohammedImg from "@assets/mr-mohammed.png";

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-card" dir="rtl">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">نبذة عني</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            شغوف بإنشاء تجارب رقمية تحدث فارقاً حقيقياً في حياة الناس
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="flex justify-center lg:justify-end">
            <img 
              src={mrMohammedImg}
              alt="مصطفى أحمد - مطور مواقع ومحتوى إبداعي" 
              className="rounded-2xl shadow-lg w-80 h-auto object-cover"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary">مصطفى أحمد</h3>
            <h4 className="text-2xl font-semibold text-accent">مطور مواقع ومحتوى إبداعي</h4>
            <p className="text-lg text-foreground leading-relaxed">
              مطور متكامل متخصص في تطوير المواقع والتطبيقات الحديثة مع خبرة في استراتيجية المحتوى. أحب أن أحول الأفكار إلى حلول رقمية مبتكرة تجمع بين الجودة التقنية العالية والتصميم المتميز.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">أكثر من 5 سنوات خبرة في تطوير المواقع</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">معتمد في الذكاء الاصطناعي والتقنيات الحديثة</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">خبير في استراتيجية المحتوى والتسويق الرقمي</span>
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
