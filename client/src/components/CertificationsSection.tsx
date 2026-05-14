import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Certificate } from "@shared/schema";
import { BadgeCheck, Award, Calendar, Building2 } from "lucide-react";
import certificateImage from "@assets/113-alx-ai-starter-kit-certificate-mustafa-muhammad.png";

const staticCertificates = [
  {
    id: "cert-1",
    title: "ALX AI Starter Kit Certificate",
    description: "Advanced AI fundamentals covering machine learning and deep learning applications.",
    issuer: "ALX Africa",
    issueDate: "2024",
    imageUrl: certificateImage as string,
    category: "Artificial Intelligence",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "cert-2",
    title: "Full-Stack Web Development",
    description: "Modern web development with React, Node.js, and database management.",
    issuer: "Meta (Facebook)",
    issueDate: "2023",
    imageUrl: null,
    category: "Web Development",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "cert-3",
    title: "Content Strategy & Digital Marketing",
    description: "Professional content creation, SEO optimization, and digital brand management.",
    issuer: "Google Digital Marketing",
    issueDate: "2023",
    imageUrl: null,
    category: "Digital Marketing",
    color: "from-green-500 to-teal-600",
  },
  {
    id: "cert-4",
    title: "Advanced JavaScript & TypeScript",
    description: "Advanced JavaScript concepts and TypeScript implementation patterns.",
    issuer: "Microsoft",
    issueDate: "2022",
    imageUrl: null,
    category: "Programming",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "cert-5",
    title: "Cloud Computing Fundamentals",
    description: "AWS cloud infrastructure deployment and scalable architecture best practices.",
    issuer: "Amazon Web Services",
    issueDate: "2022",
    imageUrl: null,
    category: "Cloud",
    color: "from-orange-500 to-red-600",
  },
  {
    id: "cert-6",
    title: "Database Design & Management",
    description: "Professional database design, optimization and performance management.",
    issuer: "Oracle Corporation",
    issueDate: "2021",
    imageUrl: null,
    category: "Database",
    color: "from-red-500 to-pink-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function CertificationsSection() {
  const { data: dbCertificates = [] } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
  });

  const extraCerts = dbCertificates
    .filter((c) => c.isVisible)
    .map((c, i) => ({
      id: `db-${c.id}`,
      title: c.title,
      description: c.description || "Professional certification",
      issuer: "Professional Institution",
      issueDate: c.issueDate || "Recent",
      imageUrl: c.imageUrl || null,
      category: "Professional Development",
      color: "from-cyan-500 to-blue-600",
    }));

  const allCerts = [...staticCertificates, ...extraCerts];

  return (
    <section id="certifications" className="section-padding relative overflow-hidden">
      {/* bg tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />

      <div className="container-max relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Proof of expertise</p>
          <h2 className="section-title gradient-text">Certifications</h2>
          <p className="section-subtitle mt-4">
            A track record of continuous learning across AI, development, marketing, and cloud technologies.
          </p>
        </motion.div>

        {/* Certs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
        >
          {allCerts.map((cert) => (
            <motion.div
              key={cert.id}
              variants={itemVariants}
              className="group gradient-border overflow-hidden hover:glow-primary transition-all duration-500"
              data-testid={`card-cert-${cert.id}`}
            >
              {/* Top strip */}
              {cert.id === "cert-1" && cert.imageUrl ? (
                <div
                  className="relative select-none h-44 overflow-hidden"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>
              ) : (
                <div className={`h-44 bg-gradient-to-br ${cert.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Award className="w-24 h-24 text-white" />
                  </div>
                  <div className="absolute bottom-4 left-5">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full">
                      {cert.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-base text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300 leading-snug">
                  {cert.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-4">{cert.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{cert.issuer}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-400 font-medium">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>{cert.issueDate}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="gradient-border p-8 grid md:grid-cols-3 gap-6 text-center"
        >
          {[
            { value: `${allCerts.length}+`, label: "Certifications", color: "text-primary" },
            { value: "4+", label: "Years of Experience", color: "text-violet-400" },
            { value: "10+", label: "Technology Stacks", color: "text-green-400" },
          ].map(({ value, label, color }) => (
            <div key={label}>
              <div className={`text-4xl font-bold ${color} mb-1`}>{value}</div>
              <div className="text-muted-foreground text-sm">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
