import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Sparkles,
  TrendingUp,
  Target,
  Users,
  Brain,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Career Guidance",
      description: "Get personalized career recommendations based on your skills, interests, and market trends.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Skills Gap Analysis",
      description: "Identify skill gaps and receive targeted learning paths to achieve your career goals.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Market Insights",
      description: "Stay ahead with real-time job market trends and salary benchmarks.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Job Matching",
      description: "Find opportunities that truly match your profile and career aspirations.",
    },
  ];

  const stats = [
    { value: "70%", label: "Students Struggle with Career Direction" },
    { value: "85%", label: "Employers Can't Find Right Talent" },
    { value: "10x", label: "Cost of Traditional Career Counseling" },
  ];

  const benefits = [
    "Personalized career roadmaps tailored to your goals",
    "AI-driven job recommendations matching your profile",
    "Skills development tracking and certification",
    "Direct connection to opportunities",
    "Industry expert insights and mentorship",
    "Affordable and accessible for everyone",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Solving the Career Confusion Crisis
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Navigate Your Career with{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                AI-Powered Clarity
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands discovering their perfect career path. Get personalized guidance,
              skill development plans, and direct access to opportunities that match your potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="hero" asChild>
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Career Guidance Reimagined
            </h2>
            <p className="text-lg text-muted-foreground">
              Traditional career counseling is expensive and outdated. We're revolutionizing
              how people discover and navigate their professional journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Why Choose CareerPath AI?
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to take control of your career journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto overflow-hidden border-2 border-primary/20">
            <CardContent className="p-12 text-center space-y-6 relative">
              <div className="absolute inset-0 bg-gradient-hero opacity-5" />
              <div className="relative space-y-6">
                <Users className="w-16 h-16 mx-auto text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Ready to Find Your Path?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of professionals who've discovered their ideal career with our AI-powered platform.
                  Get started today, completely free.
                </p>
                <Button size="lg" variant="hero" asChild>
                  <Link to="/auth">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 CareerPath AI. Solving the career confusion crisis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
