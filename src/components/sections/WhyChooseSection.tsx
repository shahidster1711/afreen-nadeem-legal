import { motion } from "framer-motion";
import { Search, FileCheck, Shield, Users, Clock, CheckCircle } from "lucide-react";

const reasons = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Research-Driven Approach",
    description:
      "Every legal opinion and document is backed by thorough case-law research and statutory analysis.",
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: "Clear & Structured Drafting",
    description:
      "Complex legal concepts translated into plain English with precise, actionable documentation.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Ethical & Confidential",
    description:
      "Strict adherence to professional ethics with complete confidentiality of all client communications.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Academic + Practical Expertise",
    description:
      "Unique blend of academic rigor from LL.M. & PhD pursuit with hands-on legal experience.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Freelancer-Friendly Engagement",
    description:
      "Flexible engagement models with transparent pricing and no hidden costs.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Client-Centric Approach",
    description:
      "Dedicated attention to understanding your needs and delivering tailored solutions.",
  },
];

export const WhyChooseSection = () => {
  return (
    <section id="why-choose" className="section-padding bg-background">
      <div className="container-legal">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="legal-badge">Why Work With Me</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Your Legal Matters Deserve{" "}
              <span className="text-gold">Excellence</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              When you choose to work with me, you're partnering with a legal 
              professional who combines academic depth with practical expertise 
              to deliver results that protect your interests.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-secondary rounded-xl">
                <div className="font-serif text-3xl font-bold text-accent">3+</div>
                <div className="text-sm text-muted-foreground mt-1">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-secondary rounded-xl">
                <div className="font-serif text-3xl font-bold text-accent">LL.M</div>
                <div className="text-sm text-muted-foreground mt-1">Constitutional Law</div>
              </div>
              <div className="text-center p-4 bg-secondary rounded-xl">
                <div className="font-serif text-3xl font-bold text-accent">PhD</div>
                <div className="text-sm text-muted-foreground mt-1">Pursuing</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Reasons Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card rounded-xl p-5 shadow-soft hover:shadow-card transition-shadow border border-border group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  {reason.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
