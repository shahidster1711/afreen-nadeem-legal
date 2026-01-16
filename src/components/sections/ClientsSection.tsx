import { motion } from "framer-motion";
import { Rocket, Building2, Blocks, Globe, Scale, GraduationCap } from "lucide-react";

const clientTypes = [
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Startups & Founders",
    description: "Legal foundation for your venture",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "MSMEs",
    description: "Compliance & contract support",
  },
  {
    icon: <Blocks className="w-8 h-8" />,
    title: "Tech & Blockchain Projects",
    description: "Digital asset legal expertise",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Website & App Owners",
    description: "Legal policies & terms",
  },
  {
    icon: <Scale className="w-8 h-8" />,
    title: "Law Firms",
    description: "Research & drafting support",
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Students & Researchers",
    description: "Academic legal writing",
  },
];

export const ClientsSection = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-legal">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="legal-badge">Who I Serve</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Tailored Solutions for{" "}
            <span className="text-gold">Every Client</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're just starting out or looking for specialized legal support, 
            I provide services designed to meet your specific needs.
          </p>
        </motion.div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {clientTypes.map((client, index) => (
            <motion.div
              key={client.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card rounded-xl p-6 text-center shadow-soft hover:shadow-card transition-all duration-300 border border-border hover:border-accent/30 group cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                {client.icon}
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {client.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {client.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
