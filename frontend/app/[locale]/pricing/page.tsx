"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "@/src/i18n/routing";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container px-4 md:px-8 mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Invest in your education without breaking the bank. Choose the plan that fits your study habits.
            </p>
        </div>

        <div className="container px-4 md:px-8 mx-auto grid md:grid-cols-3 gap-8 max-w-6xl">
            {/* Free Plan */}
            <PricingCard 
                title="Starter" 
                price="€0" 
                description="Perfect for trying out the platform."
                features={[
                    "3 Document uploads / month",
                    "Basic Quiz generation",
                    "Limited Chat history",
                    "Community Support"
                ]}
                buttonText="Get Started Free"
                buttonVariant="outline"
                href="/login"
            />

            {/* Pro Plan */}
            <PricingCard 
                title="Pro Student" 
                price="€9.99" 
                period="/month"
                description="For serious students who want top grades."
                features={[
                    "Unlimited Document uploads",
                    "Advanced Quiz & Flashcards",
                    "Priority AI Chat (Faster & Smarter)",
                    "Personalized Study Planner",
                    "Progress Analytics Dashboard"
                ]}
                buttonText="Upgrade to Pro"
                buttonVariant="default"
                popular
                href="/login?plan=pro"
            />

            {/* Team Plan */}
            <PricingCard 
                title="Schools & Teams" 
                price="Custom" 
                description="For study groups or classrooms."
                features={[
                    "Everything in Pro",
                    "Collaborative Workspaces",
                    "Teacher Dashboard",
                    "Bulk License Management",
                    "Dedicated Support"
                ]}
                buttonText="Contact Sales"
                buttonVariant="outline"
                href="mailto:sales@smarternotharder.com"
            />
        </div>
      </main>
    </div>
  );
}

function PricingCard({ 
    title, 
    price, 
    period = "", 
    description, 
    features, 
    buttonText, 
    buttonVariant = "outline", 
    popular = false,
    href
}: any) {
    return (
        <div className={`relative rounded-2xl p-8 border flex flex-col ${popular ? 'border-primary shadow-lg bg-primary/5 ring-1 ring-primary' : 'bg-card shadow-sm'}`}>
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                </div>
            )}
            
            <div className="mb-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <div className="mt-4 flex items-baseline text-muted-foreground">
                    <span className="text-4xl font-extrabold text-foreground tracking-tight">{price}</span>
                    <span className="ml-1 text-sm font-medium">{period}</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{description}</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Link href={href} className="w-full">
                <Button variant={buttonVariant} className="w-full rounded-full h-11" size="lg">
                    {buttonText}
                </Button>
            </Link>
        </div>
    )
}

