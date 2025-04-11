import { Facebook, Instagram, Twitter, Github } from "lucide-react";

export default function Footer() {
  const links = [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Contact", href: "#" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-6 w-6" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="h-6 w-6" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="h-6 w-6" />, href: "#" },
    { name: "GitHub", icon: <Github className="h-6 w-6" />, href: "#" }
  ];

  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          {links.map((link, index) => (
            <div key={index} className="px-5 py-2">
              <a href={link.href} className="text-base text-gray-400 hover:text-gray-300">
                {link.name}
              </a>
            </div>
          ))}
        </nav>
        
        <div className="mt-8 flex justify-center space-x-6">
          {socialLinks.map((link, index) => (
            <a key={index} href={link.href} className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">{link.name}</span>
              {link.icon}
            </a>
          ))}
        </div>
        
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; 2023 ProductName, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
