import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white pt-12 pb-8 ">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Learn-Z</h2>
          <p className="text-gray-200">
            A comprehensive campus management platform to track events, schedules, assignments, groups, and student interactions — all in one place for a seamless student experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-200">
            <li>
              <Link href="/" className="hover:text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-white">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-white">
                Events
              </Link>
            </li>
            <li>
              <Link href="/find-buddy" className="hover:text-white">
                Find Buddy
              </Link>
            </li>
            <li>
              <Link href="/group" className="hover:text-white">
                Group
              </Link>
            </li>
            <li>
              <Link href="/classroom" className="hover:text-white">
                Classroom
              </Link>
            </li>
            <li>
              <Link href="/setting" className="hover:text-white">
                Settings
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> Kathmandu, Nepal
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> +977-9876543210
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> learn-z@gmail.com
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 mt-2 text-xl text-gray-200">
            <Link href="#">
              <FaFacebook className="hover:text-white transition" />
            </Link>
            <Link href="#">
              <FaInstagram className="hover:text-white transition" />
            </Link>
            <Link href="#">
              <FaTwitter className="hover:text-white transition" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mt-10 border-t border-white/20 text-center text-gray-200 text-xs pt-4">
        &copy; {new Date().getFullYear()} Learn-Z. All rights reserved.
        Built by <span className="text-white font-semibold">Team Malangcode</span>
        .
      </div>
    </footer>
  );
}
