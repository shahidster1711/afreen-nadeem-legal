import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Legal Drafting",
  "Legal Opinions",
  "Contracts & Compliance",
  "Startup Law",
  "Website & App Policies",
  "Academic Insights",
];

const blogPosts = [
  {
    id: 1,
    slug: "understanding-legal-opinions",
    title: "Understanding Legal Opinions: When and Why You Need One",
    excerpt: "A legal opinion provides authoritative guidance on complex legal matters. Learn when businesses should seek formal legal opinions and how they protect your interests.",
    category: "Legal Opinions",
    author: "Afreen Nadeem",
    date: "2026-01-10",
    readTime: "6 min read",
    image: "/placeholder.svg",
    featured: true,
  },
  {
    id: 2,
    slug: "essential-contracts-for-startups",
    title: "5 Essential Contracts Every Startup Must Have in 2026",
    excerpt: "From founder agreements to NDAs, discover the critical contracts that protect your startup from legal disputes and set a foundation for growth.",
    category: "Startup Law",
    author: "Afreen Nadeem",
    date: "2026-01-08",
    readTime: "8 min read",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    slug: "privacy-policy-requirements-india",
    title: "Privacy Policy Requirements for Indian Websites & Apps",
    excerpt: "With DPDP Act 2023 in effect, understand what your website or app needs to comply with India's data protection regulations.",
    category: "Website & App Policies",
    author: "Afreen Nadeem",
    date: "2026-01-05",
    readTime: "7 min read",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    slug: "nda-drafting-best-practices",
    title: "NDA Drafting: Best Practices for Maximum Protection",
    excerpt: "A poorly drafted NDA can leave your confidential information exposed. Learn the essential clauses and common mistakes to avoid.",
    category: "Legal Drafting",
    author: "Afreen Nadeem",
    date: "2026-01-02",
    readTime: "5 min read",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    slug: "msme-compliance-checklist",
    title: "Complete Legal Compliance Checklist for MSMEs in India",
    excerpt: "From registration to annual filings, a comprehensive guide to keeping your MSME legally compliant and avoiding penalties.",
    category: "Contracts & Compliance",
    author: "Afreen Nadeem",
    date: "2025-12-28",
    readTime: "10 min read",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    slug: "constitutional-law-research-methodology",
    title: "Research Methodology in Constitutional Law: An Academic Perspective",
    excerpt: "Exploring effective research methodologies for constitutional law studies and academic legal writing.",
    category: "Academic Insights",
    author: "Afreen Nadeem",
    date: "2025-12-20",
    readTime: "12 min read",
    image: "/placeholder.svg",
  },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient py-16 md:py-24">
          <div className="container-legal">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Legal <span className="text-gold">Insights</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
                Expert analysis, practical guidance, and research-backed insights on Indian law, 
                contracts, compliance, and legal best practices.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-card border-primary-foreground/20"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border bg-card">
          <div className="container-legal">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && activeCategory === "All" && !searchQuery && (
          <section className="py-12 md:py-16">
            <div className="container-legal">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-2xl overflow-hidden shadow-card"
              >
                <div className="aspect-video md:aspect-auto md:h-full bg-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📜</span>
                    </div>
                    <span className="text-muted-foreground text-sm">Featured Article</span>
                  </div>
                </div>
                <div className="p-8">
                  <Badge className="mb-4 bg-accent/10 text-accent border-accent/30">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.date).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <Button variant="gold">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.article>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container-legal">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts
                .filter((post) => !post.featured || activeCategory !== "All" || searchQuery)
                .map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-shadow group"
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">📄</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <Badge variant="outline" className="mb-3 text-xs">
                        {post.category}
                      </Badge>
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-medium text-accent hover:underline"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 hero-gradient">
          <div className="container-legal text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Need a Legal Opinion?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Get research-backed legal opinions and professional drafting services tailored to your needs.
            </p>
            <Link to="/#contact">
              <Button variant="gold" size="lg">
                Get in Touch
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
