import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaCcDiscover,
} from 'react-icons/fa';

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* SOCIAL MEDIA */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 mb-4">Social Media</h3>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#E4405F] hover:border-[#E4405F] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#BD081C] hover:border-[#BD081C] transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterestP className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#FF0000] hover:border-[#FF0000] transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 mb-4">Customer Support</h3>
            <p className="text-sm text-slate-700">
              <span className="font-bold">IND:</span> (+91) 8010 99 7070
              <span className="block text-slate-600 text-xs mt-0.5">10 AM - 7 PM</span>
            </p>
            <a
              href="mailto:support@gondget.com"
              className="mt-2 block text-sm text-slate-700 hover:text-violet-600 transition-colors"
            >
              support@gondget.com
            </a>
          </div>

          {/* WE ACCEPT */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 mb-4">We Accept</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-9 w-14 items-center justify-center rounded border border-slate-200 bg-white px-1.5" title="Visa">
                <FaCcVisa className="h-6 w-auto text-slate-800" />
              </span>
              <span className="inline-flex h-9 w-14 items-center justify-center rounded border border-slate-200 bg-white px-1.5" title="Mastercard">
                <FaCcMastercard className="h-6 w-auto text-slate-800" />
              </span>
              <span className="inline-flex h-9 w-14 items-center justify-center rounded border border-slate-200 bg-white px-1.5" title="PayPal">
                <FaCcPaypal className="h-5 w-auto text-[#003087]" />
              </span>
              <span className="inline-flex h-9 w-14 items-center justify-center rounded border border-slate-200 bg-white px-1.5" title="American Express">
                <FaCcAmex className="h-5 w-auto text-[#006FCF]" />
              </span>
              <span className="inline-flex h-9 w-14 items-center justify-center rounded border border-slate-200 bg-white px-1.5" title="Discover">
                <FaCcDiscover className="h-5 w-auto text-slate-800" />
              </span>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 mb-4">Copyright</h3>
            <p className="text-sm text-slate-700">
              © Copyright 2012-{currentYear} Gondget.com.
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Send Gifts To India ® All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
