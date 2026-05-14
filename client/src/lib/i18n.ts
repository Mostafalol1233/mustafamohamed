export type Lang = "en" | "ar";

export const translations = {
  en: {
    nav: {
      home: "Home", skills: "Skills", portfolio: "Portfolio",
      reviews: "Reviews", contact: "Contact", blog: "Blog", admin: "Admin",
    },
    hero: {
      available: "Available for new projects",
      cta_work: "View my work",
      cta_contact: "Contact me",
      cta_resume: "Download Resume",
      stats: { years: "Years", projects: "Projects", certs: "Certificates", coffee: "Coffee" },
    },
    sections: {
      skills: "Skills", portfolio: "Portfolio", reviews: "Reviews",
      contact: "Contact", blog: "Blog", certifications: "Certifications",
    },
    contact: {
      title: "Let's Work Together",
      subtitle: "Have a project in mind or just want to say hello? My inbox is always open.",
    },
    blog: {
      eyebrow: "Insights",
      title: "Blog & Articles",
      subtitle: "Tutorials, case studies, and thoughts on web development and content strategy.",
      read_more: "Read more",
      min_read: "min read",
    },
    footer: {
      rights: "© 2025 Mustafa Mohamed. All rights reserved.",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية", skills: "المهارات", portfolio: "الأعمال",
      reviews: "التقييمات", contact: "التواصل", blog: "المدونة", admin: "لوحة التحكم",
    },
    hero: {
      available: "متاح لمشاريع جديدة",
      cta_work: "شاهد أعمالي",
      cta_contact: "تواصل معي",
      cta_resume: "تحميل السيرة الذاتية",
      stats: { years: "سنوات", projects: "مشروع", certs: "شهادات", coffee: "قهوة" },
    },
    sections: {
      skills: "المهارات", portfolio: "الأعمال", reviews: "التقييمات",
      contact: "التواصل", blog: "المدونة", certifications: "الشهادات",
    },
    contact: {
      title: "لنعمل معًا",
      subtitle: "هل لديك مشروع في ذهنك أو تريد فقط أن تقول مرحباً؟ بريدي الوارد مفتوح دائماً.",
    },
    blog: {
      eyebrow: "مقالات",
      title: "المدونة والمقالات",
      subtitle: "دروس تعليمية ودراسات حالة وأفكار حول تطوير الويب واستراتيجية المحتوى.",
      read_more: "اقرأ المزيد",
      min_read: "دقيقة للقراءة",
    },
    footer: {
      rights: "© 2025 مصطفى محمد. جميع الحقوق محفوظة.",
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;
