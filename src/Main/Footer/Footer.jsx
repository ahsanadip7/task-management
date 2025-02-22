import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        
        {/* Left - Brand Name */}
        <h2 className="text-lg font-semibold">Task Manager</h2>

        {/* Middle - Quick Links */}
        <ul className="flex gap-5 text-sm mt-2 md:mt-0">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="/about" className="hover:underline">About</a></li>
          <li><a href="/contact" className="hover:underline">Contact</a></li>
        </ul>

        {/* Right - Social Icons */}
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-xl hover:text-gray-400 transition" />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-xl hover:text-gray-400 transition" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-xl hover:text-gray-400 transition" />
          </a>
        </div>

      </div>

      {/* Bottom text */}
      <div className="text-center text-xs text-gray-400 mt-4">
        &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
