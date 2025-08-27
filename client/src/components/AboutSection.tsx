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
          <div className="text-center">
            <h3 className="text-3xl font-bold text-primary">مصطفى أحمد</h3>
          </div>
        </div>

      </div>
    </section>
  );
}
