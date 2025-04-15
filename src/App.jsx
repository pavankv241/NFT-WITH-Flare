import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import PictureGallery from "./components/PictureGallery";
import ShoppingCart from "./components/ShoppingCart";
import { TrendingUp } from "lucide-react";
import MintNFTPage from "./components/MintNFTPage";
import { Toaster , toast} from "react-hot-toast";


export default function App() {
  const [availablePics, setAvailablePics] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showMintPage, setShowMintPage] = useState(false);

  const YOUR_RECEIVER_WALLET = import.meta.env.VITE_RECEIVER_WALLET;

  // Load minted NFTs from localStorage when the component mounts
  useEffect(() => {
    const storedPics = JSON.parse(localStorage.getItem("mintedPics"));
    if (storedPics) {
      setAvailablePics(storedPics);
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
      setWalletAddress(null);  // Disconnect
    } else {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setWalletAddress(accounts[0]);
        } catch (err) {
          console.log(err);
          toast.success(" Wallet connection failed.");
        }
      } else {
        toast.success(" Please install MetaMask.");
      }
    }
  };

  const handlePay = async () => {
    if (!walletAddress) return toast.success("Connect your wallet first.");

    const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: YOUR_RECEIVER_WALLET,
        value: ethers.parseEther(totalAmount.toString()),
      });

      await tx.wait();

      const purchasedIds = cart.map((item) => item.id);

      // Removing after Bought
      const updatedAvailablePics = availablePics.filter((img) =>{ return !purchasedIds.includes(img.id)} )

      console.log(updatedAvailablePics)

      setAvailablePics(updatedAvailablePics);

      setCart([]);

      setShowCart(false);

      localStorage.setItem("mintedPics" , JSON.stringify(updatedAvailablePics));

      console.log("Purchased IDs:", purchasedIds);
      console.log("Available Pics:", availablePics.map((img) => img.id));


      toast.success(" NFTs Purchased Successfully!");
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
