import { BookOpen, Github, Linkedin } from 'lucide-react';
import config from '../../config/app.config';

interface FooterProps {
  setFooterPage?: (page: string | null) => void;
}

export function Footer({ setFooterPage }: FooterProps) {
  const handleNav = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (setFooterPage) {
      setFooterPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* // Logo right here */}
              <div className="bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-2 rounded-lg">
                <BookOpen className="size-5 text-white" aria-hidden="true" />
              </div>
              {/* // app title from config */}
              <span className="text-xl text-white">{config.app.name}</span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Your AI-powered learning companion to master new skills efficiently and effectively.
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'features')}
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'pricing')}
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'faq')}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'roadmap')}
                  className="hover:text-white transition-colors"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'about')}
                  className="hover:text-white transition-colors"
                >
                  about us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'blog')}
                  className="hover:text-white transition-colors"
                >
                  blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'career')}
                  className="hover:text-white transition-colors"
                >
                  career
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'contact')}
                  className="hover:text-white transition-colors"
                >
                  contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://polyformproject.org/licenses/noncommercial/1.0.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  License (PolyForm NC 1.0.0)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'data-protection')}
                  className="hover:text-white transition-colors"
                >
                  data protection
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'legal-notice')}
                  className="hover:text-white transition-colors"
                >
                  legal notice
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'imprint')}
                  className="hover:text-white transition-colors"
                >
                  imprint
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNav(e, 'cookie-policy')}
                  className="hover:text-white transition-colors"
                >
                  cookie policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              © 2025 {config.app.name}. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-600">
              Licensed under{' '}
              <a
                href="https://polyformproject.org/licenses/noncommercial/1.0.0"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 underline decoration-dotted"
              >
                PolyForm Noncommercial 1.0.0
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Created by
              </span>
              <a
                href="https://malick.wtf"
                className="text-sm font-bold bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="link to portfolio of malick"
              >
                malick
              </a>
            </div>
            <div>
              <a href="https://github.com/yaaintmal" className="hover:text-white transition-colors">
                <Github className="size-5" />
              </a>
            </div>
            <div>
              <a
                href="https://www.linkedin.com/in/pierre-s-263850213"
                className="hover:text-white transition-colors"
              >
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
