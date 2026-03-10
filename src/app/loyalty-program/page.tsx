'use client';

import Link from 'next/link';
import { Star, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoyaltyProgramPage() {
  const points = 0;
  const tier = 'Bronze';

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">Loyalty Program</h1>
      <p className="mt-1 text-sm text-muted-foreground">Earn points on every order and unlock rewards.</p>

      <Card className="mt-6 sm:mt-8 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Your points
          </CardTitle>
          <CardDescription>1 order = 10 points. 100 points = Rs 50 off.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-3xl font-bold text-foreground">{points} pts</p>
          <p className="text-sm text-muted-foreground">Tier: <span className="font-medium text-foreground">{tier}</span></p>
          <Button asChild className="gap-2">
            <Link href="/products">Start earning <ChevronRight className="h-4 w-4" /></Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 sm:mt-8 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium">Tiers</CardTitle>
          <CardDescription>Bronze to Silver (500 pts), Gold (2000 pts), Platinum (5000 pts).</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Higher tiers get exclusive discounts, early access to sales, and free shipping.
        </CardContent>
      </Card>
    </div>
  );
}
