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

        <div className="flex flex-col items-center mb-16">
          <div className="mb-6">
            <img 
              src={mrMohammedImg}
              alt="مصطفى أحمد - مطور مواقع ومحتوى إبداعي" 
              className="rounded-2xl shadow-lg w-80 h-auto object-cover mx-auto"
            />
          </div>
          <div className="text-center space-y-6 max-w-4xl">
            <h3 className="text-3xl font-bold text-primary">مصطفى أحمد</h3>
            <p className="text-lg text-foreground leading-relaxed">
              أعمل على تحويل الأفكار الإبداعية إلى مواقع وتطبيقات عملية ومميزة. أجمع بين الخبرة التقنية والحس الإبداعي لإنتاج حلول رقمية تلبي احتياجات العملاء وتحقق أهدافهم بفعالية.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-center justify-center space-x-3 space-x-reverse">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">أكثر من 5 سنوات خبرة في تطوير المواقع</span>
              </div>
              <div className="flex items-center justify-center space-x-3 space-x-reverse">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">معتمد في الذكاء الاصطناعي والتقنيات الحديثة</span>
              </div>
              <div className="flex items-center justify-center space-x-3 space-x-reverse">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-foreground">خبير في استراتيجية المحتوى والتسويق الرقمي</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
