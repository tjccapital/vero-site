"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/logo";
import { Menu, X, ChevronDown, ChevronUp, CreditCard, Store, Users, Play, BookOpen, Mail } from "lucide-react";

const solutionItems = [
  {
    icon: CreditCard,
    title: "Card Issuers",
    description: "Deliver digital receipts to cardholders and reduce friendly fraud.",
    href: "/#issuers",
    image: "/issuer-dashboard.png",
  },
  {
    icon: Store,
    title: "Merchants",
    description: "Free plugin for your POS. Send receipts in minutes.",
    href: "/#merchants",
    image: "/merchant-dashboard.png",
  },
  {
    icon: Users,
    title: "Consumers",
    description: "Your receipts, automatically in your card app.",
    href: "/#consumers",
    image: "/consumer-app.png",
  },
];

const resourceItems = [
  {
    icon: Play,
    title: "Demo",
    description: "See Vero in action with an interactive demo.",
    href: "/demo",
  },
  {
    icon: BookOpen,
    title: "Docs",
    description: "API reference and integration guides.",
    href: "https://vero-80b6ce5c.mintlify.app/api-reference/introduction",
    external: true,
  },
  {
    icon: Mail,
    title: "Contact",
    description: "Get in touch with our team.",
    href: "/contact",
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only apply hide/show on mobile (check window width)
      if (window.innerWidth >= 768) {
        setIsVisible(true);
        return;
      }

      // Show navbar when at the top
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleMobileSection = (section: string) => {
    setMobileSection(mobileSection === section ? null : section);
  };

  const handleSolutionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isMobile: boolean = false) => {
    e.preventDefault();
    const hash = href.replace("/#", "");

    // Update URL hash
    window.history.pushState(null, "", `/#${hash}`);

    // Dispatch hashchange event to trigger tab switch
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    if (isMobile) {
      // Close menu first to restore body scroll
      setIsOpen(false);
      // Wait for menu to close and overflow to be restored, then scroll
      setTimeout(() => {
        const section = document.getElementById("integration");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    } else {
      // Desktop: scroll immediately
      const section = document.getElementById("integration");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white md:bg-white/80 md:backdrop-blur-lg border-b border-gray-100 transition-transform duration-300 ${!isVisible ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-gray-900">
              <Logo className="h-6" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Product - Direct Link */}
            <a href="/product" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Product
            </a>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Solutions
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "solutions" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "solutions" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="bg-white border border-gray-200 shadow-lg p-4 w-[400px]">
                    <div className="space-y-1">
                      {solutionItems.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          onClick={(e) => handleSolutionClick(e, item.href)}
                          className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-primary-50 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-primary-900" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "resources" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="bg-white border border-gray-200 shadow-lg p-4 w-[400px]">
                    <div className="space-y-1">
                      {resourceItems.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-primary-50 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-primary-900" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                              {item.external && (
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-2">
            <a href="/contact" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
            <a
              href="https://vero-80b6ce5c.mintlify.app/api-reference/introduction"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-900 hover:bg-primary-800 transition-colors"
            >
              Get started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Full Screen Overlay */}
      {isOpen && (
        <div className="md:hidden absolute left-0 right-0 top-16 bottom-0 h-[calc(100vh-4rem)] bg-white overflow-y-auto border-t border-gray-100">
          <div className="px-4 py-6">
            {/* CTA Buttons */}
            <div className="flex gap-3 mb-6">
              <a href="/contact" onClick={() => setIsOpen(false)} className="flex-1 text-center py-3 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                Contact
              </a>
              <a href="https://vero-80b6ce5c.mintlify.app/api-reference/introduction" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 text-sm font-medium text-white bg-primary-900 hover:bg-primary-800 transition-colors">
                Get started
              </a>
            </div>

            {/* Product Link */}
            <a
              href="/product"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between py-4 border-b border-gray-100 text-gray-900 font-medium"
            >
              Product
            </a>

            {/* Solutions Section */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleMobileSection('solutions')}
                className="flex items-center justify-between w-full py-4 text-gray-900 font-medium"
              >
                Solutions
                {mobileSection === 'solutions' ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {mobileSection === 'solutions' && (
                <div className="pb-4 space-y-2">
                  {solutionItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      onClick={(e) => handleSolutionClick(e, item.href, true)}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white flex items-center justify-center border border-gray-200">
                        <item.icon className="w-5 h-5 text-primary-900" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Section */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleMobileSection('resources')}
                className="flex items-center justify-between w-full py-4 text-gray-900 font-medium"
              >
                Resources
                {mobileSection === 'resources' ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {mobileSection === 'resources' && (
                <div className="pb-4 space-y-2">
                  {resourceItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white flex items-center justify-center border border-gray-200">
                        <item.icon className="w-5 h-5 text-primary-900" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
