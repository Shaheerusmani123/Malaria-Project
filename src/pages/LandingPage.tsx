import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Zap, 
  Target, 
  Microscope, 
  Upload, 
  Cpu, 
  CheckCircle2,
  ArrowRight,
  Users,
  BarChart3,
  Clock,
  Heart
} from "lucide-react";
import heroImage from "@/assets/hero-blood-cells.jpg";

const LandingPage = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get diagnosis in under 30 seconds with our optimized AI pipeline",
    },
    {
      icon: Target,
      title: "High Accuracy",
      description: "99.2% accuracy validated on 10,000+ clinical samples",
    },
    {
      icon: Microscope,
      title: "Deep Analysis",
      description: "Detailed parasite detection with visual annotations and staging",
    },
  ];

  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Upload blood smear image in JPG, PNG, or TIFF format",
    },
    {
      icon: Cpu,
      title: "Analyze",
      description: "AI processes and detects malaria parasites instantly",
    },
    {
      icon: CheckCircle2,
      title: "Results",
      description: "Get instant diagnosis with confidence score and recommendations",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Images Analyzed", icon: BarChart3 },
    { value: "99.2%", label: "Accuracy Rate", icon: Target },
    { value: "<30s", label: "Processing Time", icon: Clock },
    { value: "5,000+", label: "Lives Impacted", icon: Heart },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImage} 
              alt="Blood cells microscopy" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          </div>

          <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="medical" className="mb-6 px-4 py-1.5">
                <Cpu className="h-3.5 w-3.5 mr-1.5" />
                AI-Powered Diagnostics
              </Badge>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                AI-Powered{" "}
                <span className="text-gradient-medical">Malaria Detection</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Fast, accurate, and reliable diagnosis using advanced computer vision. 
                Upload blood smear images and get instant AI-powered analysis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/detect">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Start Detection
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="heroSecondary" size="xl" className="w-full sm:w-auto">
                    Learn How It Works
                  </Button>
                </Link>
              </div>

              {/* Supported Formats */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {["JPG", "PNG", "TIFF"].map((format) => (
                  <Badge key={format} variant="outline" className="text-xs">
                    {format} Supported
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  Max 10MB
                </Badge>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-muted/50 to-transparent" />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Why Choose MalariaAI?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                State-of-the-art deep learning model trained on thousands of clinical samples
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, i) => (
                <Card key={i} variant="feature" className="p-6 text-center hover-lift">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl medical-gradient shadow-glow">
                      <feature.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get accurate malaria detection results in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, i) => (
                <div key={i} className="relative text-center">
                  {/* Connector Line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-primary/20" />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border-2 border-primary mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {i + 1}
                    </span>
                    <h3 className="font-display text-lg font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 medical-gradient">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary-foreground/80" />
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card variant="elevated" className="max-w-4xl mx-auto p-8 md:p-12 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Ready to Start Analyzing?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Upload your first blood smear image and experience the power of AI-assisted malaria detection.
              </p>
              <Link to="/detect">
                <Button variant="hero" size="xl">
                  Start Free Detection
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
