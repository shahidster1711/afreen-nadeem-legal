import { Scale, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-legal py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Scale className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Afreen Nadeem</h3>
                <p className="text-primary-foreground/70 text-sm">
                  Legal Professional
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed max-w-md mb-6">
              Providing research-driven legal drafting, opinions, and documentation 
              services to businesses and individuals across India and internationally.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-primary-foreground/10 rounded-full text-xs font-medium">
                B.A., LL.B
              </span>
              <span className="px-3 py-1 bg-primary-foreground/10 rounded-full text-xs font-medium">
                LL.M Constitutional Law
              </span>
              <span className="px-3 py-1 bg-primary-foreground/10 rounded-full text-xs font-medium">
                PhD (Pursuing)
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "About", href: "#about" },
                { name: "Services", href: "#services" },
                { name: "Why Choose Me", href: "#why-choose" },
                { name: "Process", href: "#process" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:afreen03121999@gmail.com"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Mail className="w-5 h-5 shrink-0" />
                  <span className="text-sm">afreen03121999@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+917063919480"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Phone className="w-5 h-5 shrink-0" />
                  <span className="text-sm">+91 7063919480</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm">
                  Bengaluru, India
                  <br />
                  <span className="text-primary-foreground/50">
                    Remote consultations available
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/50 text-center md:text-left">
              © {currentYear} Afreen Nadeem. All rights reserved.
            </p>
            <p className="text-xs text-primary-foreground/40 text-center md:text-right max-w-xl">
              <strong>Disclaimer:</strong> This website is for informational purposes only 
              and does not constitute legal solicitation. For specific legal advice, please 
              schedule a consultation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
