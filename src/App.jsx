import React, { useState, useEffect } from "react";
//import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import PictureGallery from "./components/PictureGallery";
import ShoppingCart from "./components/ShoppingCart";
import { TrendingUp } from "lucide-react";
import MintNFTPage from "./components/MintNFTPage";
import { Toaster , toast} from "react-hot-toast";
import TronWeb from "tronweb";
//import {fetchPrices} from "./utils/fetchPrices";

export default function App() {
  const [availablePics, setAvailablePics] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showMintPage, setShowMintPage] = useState(false);

  const YOUR_RECEIVER_WALLET = import.meta.env.VITE_RECEIVER_WALLET;
  const TRON_RECEIVER = import.meta.env.VITE_TRON_ADDRESS

  // Load minted NFTs from localStorage when the component mounts
  useEffect(() => {
    const storedPics = JSON.parse(localStorage.getItem("mintedPics"));
    if (storedPics) {

    const uniquePics = storedPics.filter((pic , index ,self) => 
      index === self.findIndex((p) => p.src === pic.src)
    );

    const filtered = uniquePics.filter(pic => pic.price <= 100);

      localStorage.setItem("mintedPics" , JSON.stringify(filtered));
      setAvailablePics(filtered);
    }
  }, []);

  const addToCart = (pic) => {
    if (!cart.find((item) => item.id === pic.id)) {
      setCart([...cart, pic]);
    }
  };

  const handleAddMintedPic = (newPic) => {
    const updatedPics = [...availablePics, newPic];
    setAvailablePics(updatedPics);
    localStorage.setItem("mintedPics", JSON.stringify(updatedPics));  // Save to localStorage
  };

  const removeFromCart = (picId) => {
    setCart(cart.filter((item) => item.id !== picId));
  };

  const handleWalletToggle = async () => {
    if (walletAddress) {
      setWalletAddress(null); // Disconnect
      toast.success("🔌 Wallet Disconnected");
    } else {
      if (window.tronWeb && window.tronLink) {
        try {
          // Request account access
          await window.tronLink.request({ method: "tron_requestAccounts" });
  
          // Wait until tronWeb is ready
          const waitForReady = async () => {
            return new Promise((resolve) => {
              const check = () => {
                if (window.tronWeb.ready && window.tronWeb.defaultAddress.base58) {
                  resolve(window.tronWeb.defaultAddress.base58);
                } else {
                  setTimeout(check, 200); // Retry after 200ms
                }
              };
              check();
            });
          };
  
          const address = await waitForReady();
          console.log("address",address);
          setWalletAddress(address);
          toast.success(`Connected to TronLink: ${address.slice(0, 6)}...`);
        } catch (err) {
          console.error(err);
          toast.error("❌ TronLink connection failed");
        }
      } else {
        toast.error("❌ Please install the TronLink extension");
      }
    }
  };
  


  const handlePay = async () => {
    if (!walletAddress) return toast.success("Connect your wallet first.");
  
    const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);
    try {
      // Wait for TronWeb to be ready
      const waitForReady = async () => {
        return new Promise((resolve, reject) => {
          const check = () => {
            if (window.tronWeb && window.tronWeb.ready && window.tronWeb.defaultAddress.base58) {
              resolve();  // If TronLink is ready, resolve the promise
            } else {
              setTimeout(check, 200);  // Otherwise, check every 200ms
            }
          };
          check();  // Start checking for readiness
        });
      };
  
      await waitForReady();
  
      // Send payment to the defined TRON_RECEIVER
      const amountInSun = window.tronWeb.toSun(totalAmount);  // Convert total amount to SUN (smallest TRX unit)
      console.log("Amount In Sun", amountInSun);
  
      const tx = await window.tronWeb.trx.sendTransaction(TRON_RECEIVER, amountInSun);
      console.log(`Payment sent to ${TRON_RECEIVER}`, tx);
  
      // Handle post-payment steps
      const purchasedIds = cart.map((item) => item.id);
      const updatedAvailablePics = availablePics.filter((img) => !purchasedIds.includes(img.id));
  
      setAvailablePics(updatedAvailablePics);
      setCart([]);
      setShowCart(false);
  
      // Save the updated available pics to local storage
      localStorage.setItem("mintedPics", JSON.stringify(updatedAvailablePics));
  
      toast.success("✅ NFTs Purchased Successfully with TRX");
    } catch (err) {
      console.error(err);
      toast.error("❌ Transaction Failed");
    }
  };

  return (
    <div className="relative">
      <Toaster position="top-right" />
      <Navbar
        onCartClick={() => setShowCart(true)}
        cartCount={cart.length}
        walletAddress={walletAddress}
        onWalletToggle={handleWalletToggle}
        onMintClick={() => setShowMintPage(true)}
      />

      <div className="p-6">
        {showMintPage ? (
          <MintNFTPage
            walletAddress={walletAddress}
            onBack={() => setShowMintPage(false)}
            onAddMintedPic={handleAddMintedPic}
          />
        ) : (
          <>
            <PictureGallery pictures={availablePics} addToCart={addToCart} />
          </>
        )}
      </div>

      <ShoppingCart
        cart={cart}
        handlePay={handlePay}
        showCart={showCart}
        onClose={() => setShowCart(false)}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}
