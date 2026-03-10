'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faPlus, faArrowUpFromBracket, faArrowDownLong } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WalletPage() {
  const balance = 0;
  const transactions: { id: string; type: 'credit' | 'debit'; label: string; amount: number; date: string }[] = [];

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Wallet</h1>
      <p className="mt-1 text-sm text-slate-600">Manage your gift wallet balance and transactions.</p>

      <Card className="mt-6 sm:mt-8 border border-pink-200/80 shadow-sm hover-lift-3d transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faWallet} className="h-5 w-5 text-pink-600" />
            Available Balance
          </CardTitle>
          <CardDescription>Use wallet balance at checkout for faster payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-3xl sm:text-4xl font-bold text-pink-600">₹{balance.toLocaleString('en-IN')}</p>
          <Button asChild className="gap-2 bg-pink-600 hover:bg-pink-700 hover-lift-3d transition-all duration-300">
            <Link href="/login">
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              Add Money
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 sm:mt-8 border border-pink-200/80 shadow-sm hover-lift-3d transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
          <CardDescription>Your latest wallet activity.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="py-8 text-center text-slate-600 text-sm">
              <FontAwesomeIcon icon={faArrowUpFromBracket} className="mx-auto h-10 w-10 text-pink-400 mb-2" />
              <p>No transactions yet.</p>
              <p className="mt-1">Add money or use wallet at checkout to see activity here.</p>
              <Button variant="outline" className="mt-4 border-pink-200 text-pink-600 hover:bg-pink-50 hover-lift-3d transition-all duration-300" asChild>
                <Link href="/products">Shop gifts</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-pink-200">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    {tx.type === 'credit' ? (
                      <FontAwesomeIcon icon={faArrowDownLong} className="h-5 w-5 text-green-600" />
                    ) : (
                      <FontAwesomeIcon icon={faArrowUpFromBracket} className="h-5 w-5 text-slate-500" />
                    )}
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{tx.label}</p>
                      <p className="text-xs text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <span className={tx.type === 'credit' ? 'text-green-600 font-medium' : 'text-slate-800'}>
                    {tx.type === 'credit' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
