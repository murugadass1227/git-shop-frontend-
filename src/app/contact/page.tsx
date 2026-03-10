'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Contact Us</h1>
      <p className="mt-2 text-sm sm:text-base text-slate-600">Reach out for bulk orders, customisation or support.</p>
      <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        <div className="flex items-start gap-3 sm:gap-4 rounded-xl border border-pink-200/80 bg-white p-3 sm:p-4 hover-lift-3d transition-all duration-300 shadow-sm">
          <FontAwesomeIcon icon={faPhone} className="h-5 w-5 shrink-0 text-pink-600 mt-0.5" />
          <div className="min-w-0">
            <p className="font-medium text-slate-800 text-sm sm:text-base">Phone</p>
            <a href="tel:+911234567890" className="text-slate-600 hover:text-pink-600 text-sm sm:text-base break-all transition-colors">+91 123 456 7890</a>
          </div>
        </div>
        <div className="flex items-start gap-3 sm:gap-4 rounded-xl border border-pink-200/80 bg-white p-3 sm:p-4 hover-lift-3d transition-all duration-300 shadow-sm">
          <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 shrink-0 text-pink-600 mt-0.5" />
          <div className="min-w-0">
            <p className="font-medium text-slate-800 text-sm sm:text-base">Email</p>
            <a href="mailto:hello@gondget.com" className="text-slate-600 hover:text-pink-600 text-sm sm:text-base break-all transition-colors">hello@gondget.com</a>
          </div>
        </div>
        <div className="flex items-start gap-3 sm:gap-4 rounded-xl border border-pink-200/80 bg-white p-3 sm:p-4 hover-lift-3d transition-all duration-300 shadow-sm">
          <FontAwesomeIcon icon={faLocationDot} className="h-5 w-5 shrink-0 text-pink-600 mt-0.5" />
          <div className="min-w-0">
            <p className="font-medium text-slate-800 text-sm sm:text-base">Address</p>
            <p className="text-slate-600 text-sm sm:text-base">Gondget, Customized Gifts, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}
