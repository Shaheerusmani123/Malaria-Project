import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Upload,
  Cpu,
  Eye,
  BarChart3,
  Shield,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AboutPage = () => {
  const metrics = [
    { label: "Sensitivity", value: "99.1%", description: "True positive rate" },
    { label: "Specificity", value: "99.3%", description: "True negative rate" },
    { label: "Precision", value: "98.7%", description: "Positive predictive value" },
    { label: "F1 Score", value: "98.9%", description: "Harmonic mean of precision & recall" },
  ];

  const processSteps = [
    {
      icon: Upload,
      title: "Image Input",
      description: "Blood smear image is uploaded in supported format (JPG, PNG, TIFF)",
    },
    {
      icon: Eye,
      title: "Preprocessing",
      description: "Image is normalized, enhanced, and prepared for analysis",
    },
    {
      icon: Brain,
      title: "Detection",
      description: "Deep learning model identifies potential parasite regions",
    },
    {
      icon: Cpu,
      title: "Classification",
      description: "Each detection is classified and parasite stage identified",
    },
    {
      icon: BarChart3,
      title: "Analysis",
      description: "Results compiled with confidence scores and recommendations",
    },
  ];

  const faqs = [
    {
      question: "What image quality is needed for accurate detection?",
      answer: "For best results, use high-resolution microscopy images (1000x magnification recommended) with proper Giemsa or Wright staining. Images should be well-focused and properly exposed. Low-quality or blurry images may result in lower confidence scores or uncertain results.",
    },
    {
      question: "How accurate is the AI detection?",
      answer: "Our model achieves 99.2% accuracy on validated test datasets containing over 10,000 clinical samples. However, accuracy may vary based on image quality and staining techniques. Always confirm results with traditional microscopy examination.",
    },
    {
      question: "Can it detect all malaria species?",
      answer: "The model is primarily trained on Plasmodium falciparum, the most common and deadly malaria parasite. It can also detect P. vivax, P. malariae, and P. ovale, though with slightly lower accuracy. Species identification is provided when confidence is high.",
    },
    {
      question: "Is patient data stored or uploaded?",
      answer: "No. All analysis is performed client-side (in your browser) and patient information is stored only in your browser's local storage. No data is transmitted to external servers unless you explicitly choose to export or share.",
    },
    {
      question: "Can this replace manual microscopy?",
      answer: "No. This tool is designed to assist healthcare professionals, not replace them. It should be used as a screening aid and all positive or uncertain results should be confirmed by trained microscopists.",
    },
    {
      question: "What are the system requirements?",
      answer: "The application runs in any modern web browser (Chrome, Firefox, Safari, Edge). For optimal performance, we recommend a device with at least 4GB RAM. No installation or special software is required.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold">About MalariaAI</h1>
                <p className="text-muted-foreground mt-2">
                  Understanding our AI-powered malaria detection system
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Model Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl medical-gradient">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">Our AI Model</h2>
                  <p className="text-muted-foreground">Advanced deep learning for parasite detection</p>
                </div>
              </div>

              <Card variant="elevated" className="p-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    MalariaAI uses a state-of-the-art convolutional neural network (CNN) architecture 
                    specifically designed for medical image analysis. The model has been trained on 
                    over 27,000 annotated blood smear images from multiple clinical sources.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="medical">Deep Learning</Badge>
                    <Badge variant="outline">Computer Vision</Badge>
                    <Badge variant="outline">Object Detection</Badge>
                    <Badge variant="outline">Image Classification</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Detection Process */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-2xl font-bold mb-8 text-center">
                Detection Process
              </h2>

              <div className="space-y-4">
                {processSteps.map((step, i) => (
                  <Card key={i} variant="elevated" className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {i + 1}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Accuracy Metrics */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-2xl font-bold mb-8 text-center">
                Validation Metrics
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                  <Card key={i} variant="elevated" className="p-6 text-center">
                    <div className="text-3xl font-bold font-display text-primary mb-1">
                      {metric.value}
                    </div>
                    <div className="font-medium">{metric.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {metric.description}
                    </div>
                  </Card>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Metrics validated on a held-out test set of 10,000+ clinical samples
              </p>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-warning" />
                <h2 className="font-display text-2xl font-bold">Important Limitations</h2>
              </div>

              <Card variant="warning" className="p-6">
                <ul className="space-y-3">
                  {[
                    "This tool is designed to assist, not replace, trained healthcare professionals",
                    "Image quality significantly impacts detection accuracy",
                    "Results should always be confirmed with traditional microscopy",
                    "The model may not detect all malaria species with equal accuracy",
                    "Not validated for pediatric samples or co-infections",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-warning mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold">Frequently Asked Questions</h2>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card variant="elevated" className="max-w-4xl mx-auto p-8 md:p-12 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Ready to Try It?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Experience AI-powered malaria detection with your own blood smear images.
              </p>
              <Link to="/detect">
                <Button variant="hero" size="xl">
                  Start Detection
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

export default AboutPage;
