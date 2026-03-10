'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) setSearched(true);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">Track Your Order</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter your order ID to see status and delivery details.</p>

      <Card className="mt-6 sm:mt-8 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faTruck} className="h-5 w-5 text-primary" />
            Find your order
          </CardTitle>
          <CardDescription>Order ID is in your confirmation email or in Account → Orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="e.g. ORD-12345"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setSearched(false); }}
              className="max-w-xs"
            />
            <Button type="submit" className="gap-2 bg-pink-600 hover:bg-pink-700 hover-lift-3d transition-all duration-300">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
              Track
            </Button>
          </form>
          {searched && orderId.trim() && (
            <div className="mt-4 p-4 rounded-lg bg-pink-50/80 border border-pink-200 text-sm text-slate-600">
              No order found with this ID, or you are not logged in. <Link href="/login" className="text-pink-600 font-medium hover:underline">Login</Link> to see your orders, or <Link href="/account" className="text-pink-600 font-medium hover:underline">view account</Link>.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" asChild className="border-pink-200 text-pink-600 hover:bg-pink-50 hover-lift-3d transition-all duration-300">
          <Link href="/account">My orders</Link>
        </Button>
        <Button variant="outline" asChild className="border-pink-200 text-pink-600 hover:bg-pink-50 hover-lift-3d transition-all duration-300">
          <Link href="/contact">Contact support</Link>
        </Button>
      </div>
    </div>
  );
}
