// Static data for portfolio - this makes the site work instantly on Vercel
import bravezmImage from "@assets/image_1748447815242.png";
import bestyBoyImage from "@assets/image_1748447890581.png";  
import ahmedHellyImage from "@assets/image_1748448070181.png";
import ecoEatsImage from "@assets/eco-eats-preview.png";
import bmoToolsImage from "@assets/bmo-tools-preview.png";
import bemoraNewImage from "@assets/bemora-new.png";
import mrMohammedImage from "@assets/mr-mohammed.png";
import diaaEldenImage from "@assets/diaa-elden-shop.png";

export const staticProjects = [
  {
    id: "1",
    title: "BRAVEZM Gaming",
    description: "منصة العاب تجمع بين التسلية والتنافس في عالم الألعاب الإلكترونية",
    imageUrl: bravezmImage,
    liveUrl: "https://bravezm.vercel.app",
    githubUrl: "https://github.com/mustafa-mahmud/bravezm",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    featured: true
  },
  {
    id: "2", 
    title: "BestyBoy Gaming",
    description: "تطبيق ويب متقدم للألعاب مع واجهة مستخدم عصرية وتجربة تفاعلية ممتازة",
    imageUrl: bestyBoyImage,
    liveUrl: "https://bestyboy.vercel.app",
    githubUrl: "https://github.com/mustafa-mahmud/bestyboy",
    technologies: ["React", "Node.js", "Express"],
    featured: true
  },
  {
    id: "3",
    title: "Ahmed Helly Academy",
    description: "منصة تعليمية شاملة لتعلم البرمجة وتطوير المهارات التقنية",
    imageUrl: ahmedHellyImage, 
    liveUrl: "https://ahmed-helly-academy.vercel.app",
    githubUrl: "https://github.com/mustafa-mahmud/ahmed-helly-academy",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    featured: true
  },
  {
    id: "4",
    title: "Eco Eats",
    description: "حملة توعوية لتقليل هدر الطعام وتعزيز الاستدامة البيئية",
    imageUrl: ecoEatsImage,
    liveUrl: "https://eco-eats-campaign.vercel.app",
    githubUrl: "https://github.com/mustafa-mahmud/eco-eats",
    technologies: ["React", "CSS3", "Environmental Awareness"],
    featured: false
  },
  {
    id: "5",
    title: "BMO Tools",
    description: "مجموعة أدوات الحاسبة العربية مع دعم كامل للغة العربية والتصميم RTL",
    imageUrl: bmoToolsImage,
    liveUrl: "https://bmo-tools.vercel.app",
    githubUrl: "https://github.com/mustafa-mahmud/bmo-tools",
    technologies: ["React", "RTL Support", "Arabic UI"],
    featured: false
  },
  {
    id: "6",
    title: "OneTeam",
    description: "منصة إدارة الفرق والمشاريع مع أدوات التعاون المتقدمة",
    imageUrl: bravezmImage,
    liveUrl: "https://oneteamss.vercel.app",
    githubUrl: "https://github.com/mustafa-mahmud/oneteam",
    technologies: ["React", "Team Management", "Collaboration"],
    featured: false
  },
  {
    id: "7",
    title: "Bemora",
    description: "تطبيق متقدم للإدارة والتنظيم مع واجهة مستخدم حديثة",
    imageUrl: bemoraNewImage,
    liveUrl: "https://bemora.netlify.app",
    githubUrl: "https://github.com/mustafa-mahmud/bemora",
    technologies: ["React", "Management", "Modern UI"],
    featured: false
  },
  {
    id: "8",
    title: "MR Mohammed",
    description: "موقع أعمال متخصص في الخدمات التجارية والاستشارات",
    imageUrl: mrMohammedImage,
    liveUrl: "https://mr-mohammed-business.vercel.app",
    githubUrl: "https://github.com/mustafa-mahmud/mr-mohammed",
    technologies: ["React", "Business", "Consulting"],
    featured: false
  },
  {
    id: "9",
    title: "Diaa Elden Shop",
    description: "متجر إلكتروني متطور للألعاب مع نظام دفع آمن وإدارة متقدمة",
    imageUrl: diaaEldenImage,
    liveUrl: "https://diaa-elden-shop.vercel.app",
    githubUrl: "https://github.com/mustafa-mahmud/diaa-elden-shop",
    technologies: ["React", "E-commerce", "Gaming"],
    featured: false
  }
];

import certificateImage from "@assets/113-alx-ai-starter-kit-certificate-mustafa-muhammad.png";

export const staticCertificates = [
  {
    id: "cert-1",
    title: "ALX AI Starter Kit Certificate",
    description: "شهادة متقدمة في الذكاء الاصطناعي من برنامج ALX",
    imageUrl: certificateImage,
    issuer: "ALX Programme",
    date: "2024",
    issueDate: "2024",
    isVisible: true,
    verified: true
  }
];

export const staticReviews = [
  {
    id: "review-1",
    name: "أحمد محمد",
    comment: "مطور ممتاز ومتميز في عمله، يقدم حلول إبداعية ومبتكرة",
    rating: 5,
    isApproved: true,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "review-2", 
    name: "فاطمة علي",
    comment: "تعامل راقي ومهني، وجودة عمل عالية جداً",
    rating: 5,
    isApproved: true,
    createdAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "review-3",
    name: "محمد حسن",
    comment: "استجابة سريعة وحلول فعالة للمشاكل التقنية",
    rating: 5,
    isApproved: true,
    createdAt: "2024-01-05T09:15:00Z"
  }
];