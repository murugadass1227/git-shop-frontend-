'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FranchisePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">Franchise Enquiry</h1>
      <p className="mt-1 text-sm text-muted-foreground">Interested in partnering with us? Share your details and we will get in touch.</p>

      <Card className="mt-6 sm:mt-8 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Why partner with us
          </CardTitle>
          <CardDescription>Join a trusted brand in personalised gifting. We support with inventory, training, and marketing.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-1">
            <li>Proven product range and quality</li>
            <li>Training and operational support</li>
            <li>Marketing and brand materials</li>
            <li>Flexible investment options</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6 sm:mt-8 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium">Submit enquiry</CardTitle>
          <CardDescription>We will contact you within 2–3 business days.</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="py-6 text-center text-muted-foreground text-sm">
              <p className="font-medium text-foreground">Thank you!</p>
              <p className="mt-1">We have received your enquiry and will get back to you soon.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="franchise-name">Name</Label>
                  <Input id="franchise-name" placeholder="Your name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="franchise-phone">Phone</Label>
                  <Input id="franchise-phone" type="tel" placeholder="+91 98765 43210" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="franchise-email">Email</Label>
                <Input id="franchise-email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="franchise-city">City / Area of interest</Label>
                <Input id="franchise-city" placeholder="e.g. Mumbai, Pune" required />
              </div>
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" />
                Submit enquiry
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
