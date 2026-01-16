import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is a legal opinion and when do I need one?",
    answer:
      "A legal opinion is a formal, written document prepared by a qualified legal professional that provides authoritative guidance on specific legal questions. You typically need one before major business transactions, regulatory compliance decisions, investment activities, or when facing complex legal situations that require documented professional analysis.",
  },
  {
    question: "Do you provide freelance legal services remotely?",
    answer:
      "Yes, I offer comprehensive remote legal services across India and internationally. All consultations, document reviews, and deliveries can be conducted digitally through secure channels. This enables efficient collaboration regardless of your location.",
  },
  {
    question: "How is confidentiality maintained?",
    answer:
      "Confidentiality is paramount in all legal engagements. All communications and documents are treated with strict professional confidentiality. I follow established legal ethics and data protection practices, using secure file sharing and encrypted communications for sensitive materials.",
  },
  {
    question: "What is the typical turnaround time for legal drafting?",
    answer:
      "Turnaround times vary based on complexity: Simple contracts (NDAs, basic agreements) typically take 2-3 business days. Complex contracts and legal opinions require 5-7 business days. Urgent requests can be accommodated with priority processing within 24-48 hours at an additional fee.",
  },
  {
    question: "Do you work with startups and MSMEs?",
    answer:
      "Absolutely! I specialize in supporting startups, MSMEs, and growing businesses. I understand the unique challenges and budget constraints these organizations face, offering flexible engagement models and practical legal solutions tailored to their stage of growth.",
  },
  {
    question: "Are services available pan-India and internationally?",
    answer:
      "Yes, I provide legal drafting, opinions, and research services across India and to international clients. For matters involving Indian law, I can assist clients globally. Cross-border matters are handled in collaboration with local counsel where required.",
  },
  {
    question: "What types of contracts can you draft?",
    answer:
      "I draft a wide range of commercial contracts including: Non-Disclosure Agreements (NDAs), Master Service Agreements (MSAs), Memorandums of Understanding (MoUs), Employment & Consultant Agreements, Terms of Service, Privacy Policies, Partnership Agreements, and various other business documentation.",
  },
  {
    question: "How do I get started with a consultation?",
    answer:
      "Simply fill out the enquiry form on this website with your requirement details, or send an email with a brief description of your legal need. I'll respond within 24 hours to discuss scope, timeline, and engagement terms before proceeding.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="section-padding bg-muted/30">
      <div className="container-legal">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
            <HelpCircle className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">
              Frequently Asked Questions
            </span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Have Questions? <span className="text-gold">I Have Answers</span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Find answers to common questions about legal services, processes, and engagement terms.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 border border-border shadow-soft"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-accent py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
