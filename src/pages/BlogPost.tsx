import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, Share2, Linkedin, Twitter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sample blog content - in a real app, this would come from a CMS or API
const blogContent: Record<string, {
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
}> = {
  "understanding-legal-opinions": {
    title: "Understanding Legal Opinions: When and Why You Need One",
    category: "Legal Opinions",
    author: "Afreen Nadeem",
    date: "2026-01-10",
    readTime: "6 min read",
    content: `
## What is a Legal Opinion?

A legal opinion is a formal document prepared by a qualified legal professional that provides authoritative guidance on specific legal questions or matters. Unlike casual legal advice, a legal opinion is a considered, researched, and documented analysis that can be relied upon for business decisions, transactions, and regulatory compliance.

## When Do You Need a Legal Opinion?

### 1. Business Transactions
Before entering into significant business transactions—mergers, acquisitions, or major contracts—parties often require legal opinions to confirm the legality and enforceability of the proposed arrangements.

### 2. Regulatory Compliance
When navigating complex regulatory frameworks, a legal opinion can provide clarity on compliance requirements and potential risks associated with non-compliance.

### 3. Investment Decisions
Investors and lenders frequently request legal opinions to assess the legal standing of a company, the validity of its contracts, and potential legal risks before committing capital.

### 4. Dispute Resolution
In pre-litigation scenarios or ongoing disputes, a well-researched legal opinion can help parties understand their legal position and guide settlement negotiations.

## Key Elements of a Strong Legal Opinion

- **Clear Statement of Facts**: A thorough understanding of the relevant facts and circumstances
- **Legal Analysis**: Application of relevant statutes, case law, and legal principles
- **Reasoned Conclusions**: Well-supported conclusions based on the analysis
- **Qualifications**: Any assumptions or limitations of the opinion
- **Professional Standards**: Adherence to ethical and professional standards

## Why Choose Professional Legal Opinion Services?

A professionally prepared legal opinion provides:
- **Credibility**: Carries weight in business and legal contexts
- **Risk Mitigation**: Identifies and addresses potential legal issues proactively
- **Decision Support**: Provides a solid foundation for informed decision-making
- **Documentation**: Creates a record of due diligence

## Conclusion

Legal opinions are invaluable tools for navigating complex legal landscapes. Whether you're a startup founder, an MSME owner, or a corporate executive, having access to well-researched legal opinions can protect your interests and support sound business decisions.

---

*Need a clear, research-backed legal opinion for your business matter? Get in touch to discuss your requirements.*
    `,
  },
  "essential-contracts-for-startups": {
    title: "5 Essential Contracts Every Startup Must Have in 2026",
    category: "Startup Law",
    author: "Afreen Nadeem",
    date: "2026-01-08",
    readTime: "8 min read",
    content: `
## Introduction

Starting a business is exciting, but without proper legal foundations, your startup could be exposed to significant risks. Here are the five essential contracts every startup needs.

## 1. Founder's Agreement

Before your startup takes off, all co-founders must be on the same page regarding:
- Equity distribution and vesting schedules
- Roles and responsibilities
- Decision-making processes
- Exit clauses and buyout provisions
- Intellectual property assignments

## 2. Non-Disclosure Agreement (NDA)

Protect your innovative ideas and confidential information:
- Employee NDAs for team members
- Mutual NDAs for partnerships and collaborations
- Investor NDAs for fundraising discussions

## 3. Employment Contracts

Clear employment terms protect both the startup and employees:
- Compensation and benefits
- Intellectual property ownership
- Non-compete and non-solicitation clauses
- Termination conditions

## 4. Service Agreements

For client-facing startups:
- Scope of services
- Payment terms and conditions
- Liability limitations
- Dispute resolution mechanisms

## 5. Privacy Policy & Terms of Service

Essential for any digital presence:
- Data collection and usage practices
- User rights and responsibilities
- Compliance with DPDP Act 2023

## Conclusion

Investing in proper legal documentation early saves significant time, money, and stress later.

---

*Need help drafting these essential contracts? Contact me for professional legal drafting services tailored to startups.*
    `,
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogContent[slug] : null;

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || '')}`,
      '_blank'
    );
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container-legal text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-gradient py-12 md:py-20">
          <div className="container-legal">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <Link 
                to="/blog" 
                className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
              
              <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
                {post.category}
              </Badge>
              
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-primary-foreground/80">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container-legal">
            <div className="max-w-3xl mx-auto">
              {/* Social Share */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Share2 className="w-4 h-4" />
                  Share:
                </span>
                <button 
                  onClick={shareOnLinkedIn}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button 
                  onClick={shareOnTwitter}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
              </div>

              {/* Article Content */}
              <article className="prose prose-lg max-w-none">
                <div 
                  className="space-y-6 text-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content
                      .replace(/^## (.*$)/gim, '<h2 class="font-serif text-2xl font-bold mt-10 mb-4">$1</h2>')
                      .replace(/^### (.*$)/gim, '<h3 class="font-serif text-xl font-semibold mt-8 mb-3">$1</h3>')
                      .replace(/^- (.*$)/gim, '<li class="ml-4 text-muted-foreground">$1</li>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/^---$/gim, '<hr class="my-10 border-border" />')
                      .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed">')
                  }} 
                />
              </article>

              {/* CTA */}
              <div className="mt-16 p-8 bg-muted rounded-2xl text-center">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Need a Legal Opinion?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get research-backed legal guidance tailored to your specific requirements.
                </p>
                <Link to="/#contact">
                  <Button variant="gold" size="lg">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
