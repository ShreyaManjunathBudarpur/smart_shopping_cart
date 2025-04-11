import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <motion.h1 
              className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="block">A better way to</span>
              <span className="block text-primary">manage your workflow</span>
            </motion.h1>

            <motion.p 
              className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              ProductName helps you streamline your process, collaborate effectively, and deliver exceptional results—all from one powerful platform.
            </motion.p>

            <motion.div 
              className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-base font-medium text-gray-700">
                Sign up for our waitlist for early access.
              </p>
              <div className="mt-3">
                <a href="#waitlist">
                  <Button 
                    className="inline-flex items-center justify-center transition-all transform hover:scale-105"
                    size="lg"
                  >
                    Join Waitlist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                <img 
                  className="w-full" 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Dashboard preview" 
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                <button type="button" className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <svg className="h-20 w-20 text-primary" fill="currentColor" viewBox="0 0 84 84">
                    <circle opacity="0.8" cx="42" cy="42" r="42" fill="white" />
                    <path d="M55 41.5L36 55V28L55 41.5Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
