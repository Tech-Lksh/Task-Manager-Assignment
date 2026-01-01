import { Linkedin, Github, Instagram, Code2, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/lokesh-pardhi-2200fgh/",
      color: "hover:text-blue-400"
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/Tech-Lksh",
      color: "hover:text-gray-300"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/lo_keshhh/",
      color: "hover:text-pink-400"
    },
    {
      name: "LeetCode",
      icon: Code2,
      url: "https://leetcode.com/u/4XtbQPAK3c/",
      color: "hover:text-yellow-400"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Brand & Copyright */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TM</span>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Task Manager
                </h3>
              </div>
              <p className="text-gray-400 text-sm">
                © {currentYear} Task Manager | Built with <Heart className="inline h-4 w-4 text-red-500" /> by Lokesh Pardhi
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${link.color} transition-colors duration-200`}
                  aria-label={`Visit ${link.name}`}
                  title={link.name}
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <p className="mb-4 md:mb-0">
                Efficient task management for productive teams
              </p>
              <div className="flex items-center space-x-4">
                <a href="" className="hover:text-gray-300 transition-colors">
                  Privacy Policy
                </a>
                <a href="" className="hover:text-gray-300 transition-colors">
                  Terms of Service
                </a>
                <a href="" className="hover:text-gray-300 transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Version (Simplified) */}
          <div className="md:hidden mt-6 text-center">
            <p className="text-xs text-gray-500">
              v1.0.0 • Made with modern web technologies
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}