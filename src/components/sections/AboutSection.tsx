import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, Users } from "lucide-react";
import afreenHeadshot from "@/assets/afreen-headshot.jpeg";

const credentials = [
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "B.A., LL.B",
    subtitle: "Pondicherry University",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "LL.M Constitutional Law",
    subtitle: "CMR University",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "PhD (Law)",
    subtitle: "Pursuing - CMR University",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "3+ Years",
    subtitle: "Legal Experience",
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-legal">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Photo & Credentials */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Headshot Photo */}
            <div className="flex justify-center lg:justify-start">
              <motion.div 
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gold/30 shadow-elevated transition-all duration-500 group-hover:border-accent group-hover:shadow-gold">
                  <img
                    src={afreenHeadshot}
                    alt="Afreen Nadeem - Legal Professional"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Decorative ring with animation */}
                <div className="absolute -inset-3 rounded-full border-2 border-primary/20 -z-10 transition-all duration-500 group-hover:border-accent/40 group-hover:-inset-4" />
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-accent/0 group-hover:bg-accent/5 transition-all duration-500 -z-5" />
              </motion.div>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-2 gap-4">
              {credentials.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-card rounded-xl p-5 shadow-card hover:shadow-elevated transition-shadow border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-serif font-semibold text-foreground text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </motion.div>
              ))}
            </div>

            {/* Publication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-primary/5 rounded-xl p-6 border border-primary/10"
            >
              <span className="legal-badge mb-4 inline-block">Published Research</span>
              <p className="text-sm text-foreground font-medium">
                "The Menacing Risks of Space Debris on the Environment: An Analysis"
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                AJASRA (UGC CARE Group 1 Journal), Vol. 13, Issue 2, Feb 2024
              </p>
            </motion.div>
          </motion.div>

          {/* Right - About Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="legal-badge">About Me</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Research-Driven Legal{" "}
              <span className="text-gold">Excellence</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I am a legal professional with a strong foundation in constitutional law 
                and a passion for research-driven legal solutions. With an LL.M. in 
                Constitutional Law and currently pursuing a Ph.D. in Law at CMR University, 
                I bring academic rigor to every legal matter I handle.
              </p>
              <p>
                My experience spans legal drafting, contract analysis, compliance advisory, 
                and blockchain & digital asset legal work. I specialize in transforming 
                complex legal concepts into clear, actionable documentation that protects 
                your interests.
              </p>
              <p>
                Whether you're a startup seeking foundational legal documents, an MSME 
                requiring compliance guidance, or a law firm needing research support, 
                I deliver thorough, ethical, and client-centric legal services.
              </p>
            </div>

            {/* Key Traits */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Research-Oriented",
                "Clear Communication",
                "Ethical Practice",
                "Client-Centric",
                "Confidential",
              ].map((trait) => (
                <span
                  key={trait}
                  className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground"
                >
                  {trait}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};