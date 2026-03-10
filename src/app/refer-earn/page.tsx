'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gift, Copy, Share2, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ReferEarnPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'GONDGET10';
  const referralLink = `https://gondget.com/register?ref=${referralCode}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">Refer & Earn</h1>
      <p className="mt-1 text-sm text-muted-foreground">Share your link. Friend gets 10% off first order, you get ₹100 in wallet.</p>

      <Card className="mt-6 sm:mt-8 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Your referral link
          </CardTitle>
          <CardDescription>Share with friends. When they sign up and place an order, you both win.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input readOnly value={referralLink} className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={handleCopy} title="Copy link">
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="gap-2" asChild>
              <Link href="/login">Login to get your link</Link>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/products">Shop now</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 sm:mt-8 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium">How it works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. Share your unique link with friends.</p>
          <p>2. They sign up and place their first order (min ₹499).</p>
          <p>3. They get 10% off; you get ₹100 credited to your wallet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
