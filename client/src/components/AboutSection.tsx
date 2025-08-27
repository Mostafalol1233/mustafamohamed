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
              أعمل على تحويل الأفكار الإبداعية إلى مواقع وتطبيقات عملية ومميزة. أجمع بين الخبرة التقنية والحس الإبداعي لإنتاج حلول رقمية تلبي احتياجات العملاء وتحقق أهدافهم بفعالية.
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
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center p-6 bg-muted rounded-2xl card-hover">
            <div className="w-16 h-16 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-pen-nib text-2xl"></i>
            </div>
            <h4 className="text-xl font-semibold text-primary mb-2">استراتيجية المحتوى</h4>
            <p className="text-muted-foreground">تحسين محركات البحث، كتابة المحتوى، التسويق الرقمي، بناء الهوية التجارية</p>
          </div>

          <div className="text-center p-6 bg-muted rounded-2xl card-hover">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-brain text-2xl"></i>
            </div>
            <h4 className="text-xl font-semibold text-primary mb-2">تطبيقات الذكاء الاصطناعي</h4>
            <p className="text-muted-foreground">التعلم الآلي، واجهات برمجة الذكاء الاصطناعي، الأتمتة، الحلول الذكية</p>
          </div>
        </div>
      </div>
    </section>
  );
}
