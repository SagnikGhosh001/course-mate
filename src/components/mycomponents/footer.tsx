// components/Footer.jsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-4">CourseMate</h3>
          <p className="text-sm">Empowering learners worldwide through accessible education.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-teal-400 transition-colors duration-200">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-teal-400 transition-colors duration-200">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-teal-400 transition-colors duration-200">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/tech" className="hover:text-teal-400 transition-colors duration-200">
                Technology
              </Link>
            </li>
            <li>
              <Link href="/business" className="hover:text-teal-400 transition-colors duration-200">
                Business
              </Link>
            </li>
            <li>
              <Link href="/design" className="hover:text-teal-400 transition-colors duration-200">
                Design
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/blog" className="hover:text-teal-400 transition-colors duration-200">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/twitter" className="hover:text-teal-400 transition-colors duration-200">
                Twitter
              </Link>
            </li>
            <li>
              <Link href="/facebook" className="hover:text-teal-400 transition-colors duration-200">
                Facebook
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}