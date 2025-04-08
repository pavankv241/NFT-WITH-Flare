import React from "react";

export default function ShoppingCart({ cart, handlePay, showCart, onClose }) {
  const totalPrice = cart.reduce((sum, pic) => sum + pic.price, 0);

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 p-4 transition-transform duration-300 ${
        showCart ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-xl font-bold">🛒 Shopping Cart</h2>
        <button onClick={onClose} className="text-red-600 font-bold text-lg">
          ✕
        </button>
      </div>
      {cart.length === 0 ? (
        <p className="text-gray-500">No items added.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <img
                  src={item.src}
                  alt={`Pic ${item.id}`}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <span className="flex-1 ml-2">NFT {item.id}</span>
                <span className="font-medium">ETH {item.price}</span>

              </li>
            ))}

          </ul>
          <div className="mt-3 font-semibold">Total: ETH {totalPrice}</div>
          <button
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            onClick={handlePay}
          >
            Pay
          </button>
        </>
      )}
    </div>
  );
}
