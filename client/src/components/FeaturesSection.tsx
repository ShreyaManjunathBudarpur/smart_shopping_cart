import { ClipboardCheck, Lock, MessageCircle } from "lucide-react";

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="relative group">
    <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group-hover:border-primary/30">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-base text-gray-500">{description}</p>
    </div>
  </div>
);

export default function FeaturesSection() {
  const features = [
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Seamless Integration",
      description: "Connect with your favorite tools and apps without any hassle. Our platform works where you work."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Advanced Security",
      description: "Enterprise-grade security features that keep your data safe and give you complete peace of mind."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time, no matter where they are located around the world."
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides powerful tools that help you work smarter, not harder.
          </p>
        </div>

        <div className="mt-12">
          <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {features.map((feature, index) => (
              <Feature 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
