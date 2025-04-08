import React from "react";
import { ShoppingCart } from "lucide-react";

export default function Navbar({ onCartClick, cartCount }) {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">🖼️ NFT Market Place</h1>
      <button
        onClick={onCartClick}
        className="relative flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
      >
        <ShoppingCart className="w-6 h-6" />
        Cart
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
}
