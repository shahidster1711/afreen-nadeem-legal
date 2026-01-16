import { motion } from "framer-motion";
import { MessageSquare, Search, FileText, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Share Your Requirement",
    description:
      "Reach out with your legal need. I'll understand your situation and objectives through a brief consultation.",
  },
  {
    number: "02",
    icon: <Search className="w-6 h-6" />,
    title: "Assessment & Scope",
    description:
      "I'll analyze your requirement, confirm the scope of work, timeline, and provide a transparent quote.",
  },
  {
    number: "03",
    icon: <FileText className="w-6 h-6" />,
    title: "Drafting & Research",
    description:
      "Thorough research-backed work begins. I draft, analyze, or provide opinion based on your specific needs.",
  },
  {
    number: "04",
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Delivery & Clarifications",
    description:
      "Final deliverables with clear explanations. I remain available for any questions or revisions needed.",
  },
];

export const ProcessSection = () => {
  return (
    <section id="process" className="section-padding bg-background">
      <div className="container-legal">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="legal-badge">How It Works</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Simple, Transparent{" "}
            <span className="text-gold">Process</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Working with me is straightforward. Here's how we'll collaborate 
            to address your legal needs effectively.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-elevated transition-shadow relative z-10">
                  {/* Number Badge */}
                  <div className="absolute -top-4 left-8 w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-sm font-bold text-accent-foreground shadow-gold">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 mt-2">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
