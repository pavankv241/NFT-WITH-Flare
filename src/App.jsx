import React, { useState } from "react";
import Navbar from "./components/Navbar";
import PictureGallery from "./components/PictureGallery";
import ShoppingCart from "./components/ShoppingCart";

const initialPictures = [
  {
    id: 1,
    name: "Rose",
    src: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f",
    price: 0.01,
  },
  {
    id: 2,
    name: "Tulip",
    src: "https://images.unsplash.com/photo-1538998073820-4dfa76300194",
    price: 0.015,
  },
  {
    id: 3,
    name: "Sunflower",
    src: "https://images.unsplash.com/photo-1546842931-886c185b4c8c",
    price: 0.02,
  },
  {
    id: 4,
    name: "Lily",
    src: "https://plus.unsplash.com/premium_photo-1676068243733-df1880c2aef8",
    price: 0.025,
  },
];


export default function App() {
  const [availablePics, setAvailablePics] = useState(initialPictures);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (pic) => {
    if (!cart.find((item) => item.id === pic.id)) {
      setCart([...cart, pic]);
    }
  };

  const handlePay = () => {
    const purchasedIds = cart.map((item) => item.id);
    setAvailablePics(availablePics.filter((img) => !purchasedIds.includes(img.id)));
    setCart([]);
    setShowCart(false);
    alert("✅ NFTs Purchased Successfully!");
  };  

  return (
    <div className="relative">
      <Navbar onCartClick={() => setShowCart(true)} cartCount={cart.length} />

      <div className="p-6">
        <PictureGallery pictures={availablePics} addToCart={addToCart} />
      </div>

      <ShoppingCart
        cart={cart}
        handlePay={handlePay}
        showCart={showCart}
        onClose={() => setShowCart(false)}
      />
    </div>
  );
}
