import { motion } from "framer-motion";
import { FileText, Scale, Globe, MessageSquare, BookOpen, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: <FileText className="w-7 h-7" />,
    title: "Legal Drafting & Documentation",
    description: "Precise, structured legal documents tailored to your specific needs.",
    items: [
      "Contract Drafting & Review",
      "Master Service Agreements (MSA)",
      "Memorandum of Understanding (MoU)",
      "Non-Disclosure Agreements (NDA)",
      "Legal Notices & Replies",
    ],
    flagship: false,
  },
  {
    icon: <Scale className="w-7 h-7" />,
    title: "Legal Opinions & Advisory",
    description: "In-depth, research-backed legal analysis to guide your decisions.",
    items: [
      "Written Legal Opinions",
      "Risk & Compliance Opinions",
      "Regulatory Interpretation",
      "Case-law Backed Analysis",
    ],
    flagship: true,
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: "Digital & Business Legal Services",
    description: "Comprehensive legal support for your online and business operations.",
    items: [
      "Website & App Legal Policies",
      "Terms & Conditions",
      "Privacy Policy & Cookie Policy",
      "Startup & MSME Legal Support",
      "Basic Compliance & Due Diligence",
    ],
    flagship: false,
  },
  {
    icon: <MessageSquare className="w-7 h-7" />,
    title: "Online Dispute Resolution",
    description: "Strategic support for resolving disputes efficiently without litigation.",
    items: [
      "Pre-litigation Support",
      "Legal Documentation for ODR",
      "Negotiation Assistance",
      "Settlement Documentation",
    ],
    flagship: false,
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: "Academic & Legal Writing",
    description: "Scholarly legal content and research support for academia and professionals.",
    items: [
      "Research Papers & Articles",
      "Legal Blogs & Content",
      "Study Notes & Materials",
      "Editing & Proofreading",
    ],
    flagship: false,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-secondary/30">
      <div className="container-legal">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="legal-badge">Practice Areas</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Comprehensive Legal{" "}
            <span className="text-gold">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From drafting to advisory, I provide end-to-end legal solutions 
            tailored to businesses, startups, and individuals.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 border ${
                service.flagship
                  ? "border-accent flagship-highlight"
                  : "border-border hover:border-accent/30"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  service.flagship
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                {service.title}
                {service.flagship && (
                  <Star className="w-4 h-4 text-accent fill-accent" />
                )}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-6">
                {service.description}
              </p>

              {/* Items */}
              <ul className="space-y-2 mb-8">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={service.flagship ? "gold" : "navyOutline"}
                className="w-full group"
                asChild
              >
                <a href="#contact">
                  Enquire Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
