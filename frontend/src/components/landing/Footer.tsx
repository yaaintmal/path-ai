import LogoLoop from '../LogoLoop';
import { Github, Linkedin } from 'lucide-react';

const socialLogos = [
  { node: <Github />, title: 'GitHub', href: 'https://github.com' },
  { node: <Linkedin />, title: 'LinkedIn', href: 'https://linkedin.com' },
];

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black border-t border-gray-200 dark:border-gray-800">
      {/* Logo Loop Section */}
      <div className="py-8 sm:py-12 md:py-16 bg-white dark:bg-gray-950">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Folge uns auf sozialen Medien
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Bleibe in Kontakt und erhalte die neuesten Updates
          </p>
        </div>

        <div style={{ height: '80px', position: 'relative' }}>
          <LogoLoop
            logos={socialLogos}
            speed={120}
            direction="left"
            logoHeight={40}
            gap={40}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="rgba(255, 255, 255, 0)"
            ariaLabel="Social media partners"
          />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-base sm:text-lg mb-4">PathAI</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              KI-gestützte Lernplattform für moderne Bildung
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Produkt</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#features"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                >
                  Wie es funktioniert
                </a>
              </li>
              <li>
                <a
                  href="#gamification"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                >
                  Gamification
                </a>
              </li>
              <li>
                <a
                  href="#templates"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                >
                  Templates
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Unternehmen</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="/changelog"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                >
                  Über uns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Direkte Links</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 PathAI. Alle Rechte vorbehalten.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-amber-600 transition-colors">
                Datenschutz
              </a>
              <a href="#" className="hover:text-amber-600 transition-colors">
                Nutzungsbedingungen
              </a>
              <a href="#" className="hover:text-amber-600 transition-colors">
                Impressum
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
