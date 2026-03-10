'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faEnvelope, faPhone, faComments } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Customer Support</h1>
      <p className="mt-1 text-sm text-slate-600">We are here to help with orders, returns, and customisation.</p>

      <div className="mt-6 sm:mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="border border-pink-200/80 shadow-sm hover-lift-3d transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-pink-600" />
              Phone
            </CardTitle>
            <CardDescription>Mon to Sat, 9 AM to 6 PM IST</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="tel:+911234567890" className="text-slate-800 font-medium hover:text-pink-600 transition-colors">+91 123 456 7890</a>
          </CardContent>
        </Card>
        <Card className="border border-pink-200/80 shadow-sm hover-lift-3d transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-pink-600" />
              Email
            </CardTitle>
            <CardDescription>We reply within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="mailto:support@gondget.com" className="text-slate-800 font-medium hover:text-pink-600 transition-colors break-all">support@gondget.com</a>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 sm:mt-8 border border-pink-200/80 shadow-sm hover-lift-3d transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faComments} className="h-5 w-5 text-pink-600" />
            FAQ
          </CardTitle>
          <CardDescription>Common questions about orders, shipping, and returns.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-3">
          <p><strong className="text-slate-800">Delivery time?</strong> 5 to 7 business days for most orders.</p>
          <p><strong className="text-slate-800">Returns?</strong> Uncustomised items can be returned within 7 days.</p>
          <p><strong className="text-slate-800">Customisation?</strong> Share your design or text at checkout or via email.</p>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button asChild className="gap-2 bg-pink-600 hover:bg-pink-700 hover-lift-3d transition-all duration-300">
          <Link href="/contact">
            <FontAwesomeIcon icon={faHeadphones} className="h-4 w-4" />
            Full contact details
          </Link>
        </Button>
      </div>
    </div>
  );
}
