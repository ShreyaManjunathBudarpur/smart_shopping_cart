import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "When will the product be available?",
      answer: "We're planning to launch in Q2 2023. By joining our waitlist, you'll be among the first to know when we're ready to launch and will receive priority access."
    },
    {
      question: "How much will it cost?",
      answer: "We'll have multiple pricing tiers to accommodate teams of all sizes. Waitlist members will receive a special 30% discount on their first year of subscription."
    },
    {
      question: "What makes your product different?",
      answer: "Our platform combines the best aspects of project management, communication, and automation in one seamless experience. We've built it based on years of research into how teams actually work, not how software thinks they should work."
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">FAQ</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-gray-900 py-3">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-500">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
