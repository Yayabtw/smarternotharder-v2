"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { ArrowRight, BookOpen, Brain, Zap, Clock, CheckCircle2, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
            
            <div className="container px-4 md:px-8 mx-auto text-center">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground mb-6 backdrop-blur-sm bg-background/50">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    New: Flashcards & Study Planner
                </div>
                
                <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
                    Master your coursework <br />
                    <span className="text-primary">in record time.</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    Stop drowning in PDFs. SmarterNotHarder turns your course materials into concise summaries, interactive quizzes, and personalized study plans instantly.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/login">
                        <Button size="lg" className="h-12 px-8 text-base rounded-full">
                            Start Learning Free
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="/pricing">
                         <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm">
                            View Pricing
                        </Button>
                    </Link>
                </div>
                
                <div className="mt-12 text-sm text-muted-foreground">
                    <p>Trusted by students from top universities worldwide.</p>
                </div>
            </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-muted/30">
            <div className="container px-4 md:px-8 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to excel</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Our AI analyzes your documents to create a comprehensive learning ecosystem tailored just for you.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Brain className="w-8 h-8 text-primary" />}
                        title="Smart Analysis"
                        description="Upload any PDF. Get key concepts, difficulty breakdown, and structured summaries in seconds."
                    />
                    <FeatureCard 
                        icon={<Zap className="w-8 h-8 text-primary" />}
                        title="Instant Quizzes"
                        description="Test your knowledge immediately with AI-generated multiple choice and true/false questions."
                    />
                    <FeatureCard 
                        icon={<Clock className="w-8 h-8 text-primary" />}
                        title="Adaptive Planning"
                        description="Get a personalized study schedule based on your exam dates and available hours."
                    />
                </div>
            </div>
        </section>

        {/* Social Proof / Use Cases */}
        <section className="py-24">
             <div className="container px-4 md:px-8 mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Your personal study coach, <br/> available 24/7.
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Chat with your documents as if you were talking to a professor. Ask for clarifications, examples, or help solving exercises. The platform adapts to your language and learning style.
                    </p>
                    <ul className="space-y-3">
                        <CheckItem text="Understand complex topics instantly" />
                        <CheckItem text="Get tailored explanations" />
                        <CheckItem text="Available in 4 languages" />
                    </ul>
                    <Link href="/login">
                         <Button size="lg" className="mt-4 rounded-full">Try Chat Assistant</Button>
                    </Link>
                </div>
                <div className="flex-1 bg-muted rounded-2xl p-8 aspect-square flex items-center justify-center border shadow-sm relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                     {/* Abstract representation of chat or dashboard */}
                     <div className="relative bg-background rounded-xl border shadow-lg p-6 w-full max-w-sm transform transition-transform group-hover:scale-105 duration-500">
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Brain className="w-4 h-4 text-primary" />
                                </div>
                                <div className="bg-muted rounded-lg p-3 text-sm">
                                    Based on your document, the concept of Variance is crucial for PCA. Would you like a simplified example?
                                </div>
                            </div>
                             <div className="flex gap-3 items-start justify-end">
                                <div className="bg-primary text-primary-foreground rounded-lg p-3 text-sm">
                                    Yes, please explain it like I'm 5.
                                </div>
                                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />
                            </div>
                        </div>
                     </div>
                </div>
             </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="container px-4 md:px-8 mx-auto text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                    Ready to upgrade your grades?
                </h2>
                <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                    Join thousands of students studying smarter, not harder. No credit card required for the free tier.
                </p>
                <Link href="/login">
                    <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                        Get Started for Free
                    </Button>
                </Link>
            </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-background">
        <div className="container px-4 md:px-8 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-lg">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>SmarterNotHarder</span>
            </div>
            <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} SmarterNotHarder Inc. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-foreground">Privacy</Link>
                <Link href="#" className="hover:text-foreground">Terms</Link>
                <Link href="#" className="hover:text-foreground">Twitter</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
            <div className="mb-4 p-3 bg-primary/5 rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function CheckItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <span>{text}</span>
        </li>
    )
}
