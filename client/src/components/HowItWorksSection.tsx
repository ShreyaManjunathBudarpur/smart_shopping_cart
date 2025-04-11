export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Sign up",
      description: "Create your account and set up your team in just a few clicks."
    },
    {
      number: 2,
      title: "Connect your tools",
      description: "Integrate with the software you already use and love."
    },
    {
      number: 3,
      title: "Transform your workflow",
      description: "Watch your productivity soar as you automate and optimize your processes."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple steps to transform your workflow
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Get started in minutes and see results immediately.
          </p>
        </div>

        <div className="relative">
          {/* Steps */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className={`relative ${index > 0 ? 'mt-10 lg:mt-0' : ''}`}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-5 text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{step.title}</h3>
                  <p className="text-base text-gray-500 text-center">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Connecting lines for desktop */}
          <div className="hidden lg:block absolute top-12 left-0 w-full">
            <div className="h-0.5 bg-gray-200 w-full relative">
              <div className="absolute h-2.5 w-2.5 rounded-full bg-primary -top-1 left-1/3 transform -translate-x-1/2"></div>
              <div className="absolute h-2.5 w-2.5 rounded-full bg-primary -top-1 left-2/3 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
