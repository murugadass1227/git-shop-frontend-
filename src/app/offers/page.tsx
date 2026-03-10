'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faPercent } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const offers = [
  { code: 'WELCOME10', title: '10% off first order', desc: 'Min order ₹499. New users only.', valid: 'Valid till Dec 2025' },
  { code: 'GIFT20', title: '20% off personalised gifts', desc: 'On customised mugs, frames & crystals.', valid: 'Valid till Dec 2025' },
  { code: 'BULK15', title: '15% off bulk orders', desc: 'On orders of 10+ items.', valid: 'Valid till Dec 2025' },
];

export default function OffersPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Offers</h1>
      <p className="mt-1 text-sm text-slate-600">Active coupons and deals. Apply at checkout.</p>

      <div className="mt-6 sm:mt-8 space-y-4">
        {offers.map((offer) => (
          <Card key={offer.code} className="border border-pink-200/80 shadow-sm hover-lift-3d transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faTag} className="h-5 w-5 text-pink-600" />
                {offer.title}
              </CardTitle>
              <CardDescription>{offer.desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                <span className="font-mono font-semibold text-pink-600 bg-pink-100 px-2 py-0.5 rounded">{offer.code}</span>
                <span className="text-slate-500 ml-2">{offer.valid}</span>
              </p>
              <Button asChild variant="outline" size="sm" className="border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover-lift-3d transition-all duration-300">
                <Link href="/products">Shop & use code</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 sm:mt-8 border-dashed border-pink-200 bg-pink-50/30 hover-lift-3d transition-all duration-300">
        <CardContent className="py-6 text-center text-sm text-slate-600">
          <FontAwesomeIcon icon={faPercent} className="mx-auto h-8 w-8 text-pink-400 mb-2" />
          <p>More offers on festivals and flash sales. Stay tuned.</p>
          <Button variant="link" className="mt-2 text-pink-600 hover:text-pink-700" asChild>
            <Link href="/products">Browse products</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
