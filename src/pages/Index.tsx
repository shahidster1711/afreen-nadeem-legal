import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Afreen Nadeem | Legal Drafting, Opinions & Research Services India</title>
        <meta name="description" content="Expert legal drafting, legal opinions, and research-backed legal solutions by Afreen Nadeem (LL.M Constitutional Law). Serving startups, MSMEs & businesses across India." />
        <meta name="keywords" content="legal opinion lawyer India, freelance legal drafting services, contract drafting consultant, legal policy drafting, research-based legal advice, legal documentation, NDA drafting, startup legal services" />
        <link rel="canonical" href="https://afreenlegalopinionsin.lovable.app" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://afreenlegalopinionsin.lovable.app" />
        <meta property="og:title" content="Afreen Nadeem | Legal Drafting & Opinions India" />
        <meta property="og:description" content="Expert legal drafting, legal opinions, and research-backed legal solutions for startups, MSMEs, and businesses across India." />
        <meta property="og:image" content="https://afreenlegalopinionsin.lovable.app/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Afreen Nadeem | Legal Consultant" />
        <meta name="twitter:description" content="Expert legal drafting, opinions, and research-backed solutions for businesses." />
        <meta name="twitter:image" content="https://afreenlegalopinionsin.lovable.app/og-image.png" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <section aria-labelledby="about-heading">
            <AboutSection />
          </section>
          <section aria-labelledby="services-heading">
            <ServicesSection />
          </section>
          <WhyChooseSection />
          <ClientsSection />
          <ProcessSection />
          <section aria-labelledby="faq-heading">
            <FAQSection />
          </section>
          <section aria-labelledby="contact-heading">
            <ContactSection />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
