import { ShoppingCart, Tag, Truck, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      title: "Scan QR Code",
      description: "Scan the QR code on the shopping trolley to access the Smart Shopping Cart application."
    },
    {
      icon: <Tag className="h-10 w-10 text-primary" />,
      title: "Set Your Budget",
      description: "Enter your shopping budget before you start adding items to your cart."
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Scan Products",
      description: "Use the LCD screen on your trolley to scan product barcodes as you shop."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Easy Checkout",
      description: "Complete your shopping with hassle-free payment directly from the app."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How Smart Shopping Cart Works
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
            Our innovative shopping solution keeps you on budget and saves time at checkout
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="px-8 py-3 text-lg">
            Start Shopping
          </Button>
        </div>
      </div>
    </section>
  );
}
