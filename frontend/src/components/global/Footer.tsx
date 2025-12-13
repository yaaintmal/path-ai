import { Brain, Github, Twitter, Linkedin } from 'lucide-react';
import config from '../../config/app.config';

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
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
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
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  about us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  career
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  data protection
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  legal notice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  imprint
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  cookie policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © 2025 {config.app.name}. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/pierre-s-263850213"
              className="hover:text-white transition-colors"
            >
              <Linkedin className="size-5" />
            </a>
            <a href="https://github.com/yaaintmal" className="hover:text-white transition-colors">
              <Github className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
