import { Brain, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="size-5 text-white" />
              </div>
              <span className="text-xl text-white">LearnAI</span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Deine persönliche KI-gestützte Lernplattform für individuelles und effektives Lernen.
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">Produkt</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Preise
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Unternehmen</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Über uns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Karriere
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  AGB
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Impressum
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie-Richtlinie
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © 2025 LearnAI. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <Twitter className="size-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Linkedin className="size-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Github className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
