import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

export default function CallToAction() {
  const benefits = [
    "Priority access when we launch",
    "30% discount on your first year",
    "Exclusive features and beta testing",
    "Direct access to our product team"
  ];

  return (
    <section className="relative py-24 bg-gradient-to-r from-primary to-primary/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to transform your workflow?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Join thousands of teams who've already simplified their processes, increased productivity, and achieved better results with ProductName.
            </p>
            <div className="mt-8">
              <a href="#waitlist">
                <Button 
                  variant="secondary" 
                  className="text-primary bg-white hover:bg-primary-foreground"
                >
                  Join Waitlist
                </Button>
              </a>
            </div>
          </div>
          
          <div className="mt-12 lg:mt-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8 sm:p-10">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-white">Early access benefits</h3>
                  </div>
                </div>
                <div className="mt-8">
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckIcon className="h-6 w-6 text-primary-foreground/60" />
                        </div>
                        <p className="ml-3 text-base text-white">{benefit}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 transform translate-y-1/2">
        <svg width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true" className="text-primary opacity-10">
          <defs>
            <pattern id="squares-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#squares-pattern)" />
        </svg>
      </div>
    </section>
  );
}
