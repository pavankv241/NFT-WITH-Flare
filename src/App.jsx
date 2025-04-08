import React, { useState } from "react";
import Navbar from "./components/Navbar";
import PictureGallery from "./components/PictureGallery";
import ShoppingCart from "./components/ShoppingCart";
import { ethers } from "ethers";

const initialPictures = [
  {
    id: 1,
    name: "Sun Flower",
    src: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f",
    price: 0.000001,
  },
  {
    id: 2,
    name: "Tulip",
    src: "https://images.unsplash.com/photo-1538998073820-4dfa76300194",
    price: 0.000001,
  },
  {
    id: 3,
    name: "Dairy",
    src: "https://images.unsplash.com/photo-1546842931-886c185b4c8c",
    price: 0.000001,
  },
  {
    id: 4,
    name: "Lily",
    src: "https://plus.unsplash.com/premium_photo-1676068243733-df1880c2aef8",
    price: 0.000001,
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

  const YOUR_RECEIVER_WALLET = "0x3a86861b069F168577679a31265a2c8fD267340A";

  // This handles the payment
  const handlePay = async () => {
    if (!window.ethereum) {
      alert("🦊 Please install MetaMask to make a payment!");
      return;
    }
  
    try {
      // Request access to wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Calculate total ETH to send
      const totalEth = cart.reduce((sum, item) => sum + item.price, 0);

      const tx = await signer.sendTransaction({
        to: YOUR_RECEIVER_WALLET,
        value: ethers.parseEther(totalEth.toString()),
      });
  
      await tx.wait();
  
      // Clear cart and confirm payment
      const purchasedIds = cart.map((item) => item.id);
      setAvailablePics(availablePics.filter((img) => !purchasedIds.includes(img.id)));
      setCart([]);
      setShowCart(false);
      alert("✅ NFTs Purchased Successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed or rejected!");
    }
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
