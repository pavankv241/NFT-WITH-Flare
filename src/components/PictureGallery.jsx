import React from "react";

export default function PictureGallery({ pictures, addToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pictures.map((pic) => (
        <div key={pic.id} className="border rounded-2xl shadow-lg p-4 space-y-4">
        <img src={pic.src} alt={pic.name} className="rounded-xl" />
        <div className="text-center font-bold">{pic.name}</div> {/* Add this line */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Ξ{pic.price}</span>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
            onClick={() => addToCart(pic)}
          >
            Buy
          </button>
        </div>
      </div>
      ))}
    </div>
  );
}
