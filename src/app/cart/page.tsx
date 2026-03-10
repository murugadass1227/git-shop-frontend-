import { CartClient } from './CartClient';

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Your Cart</h1>
      <CartClient />
    </div>
  );
}
