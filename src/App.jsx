import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import PictureGallery from "./components/PictureGallery";
import ShoppingCart from "./components/ShoppingCart";
import { TrendingUp } from "lucide-react";
import MintNFTPage from "./components/MintNFTPage";
import { Toaster , toast} from "react-hot-toast";
import TronWeb from "tronweb";
//import {fetchPrices} from "./utils/fetchPrices";
import xrpl from "xrpl";


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


  const POLYGON_AMOY_CHAIN_ID = "0x13882"; // 80002 in hex
  const handleWalletToggle = async () => {
      if (walletAddress) {
        setWalletAddress(null);
        toast.success("🔌 Wallet Disconnected");
        return;
      }
    
      if (!window.ethereum) {
        toast.error(" MetaMask is not available.");
        return;
      }
    
      try {
        //  switching to Amoy
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: POLYGON_AMOY_CHAIN_ID }],
        });
      } catch (switchError) {
        // If not added, try to add Amoy
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: POLYGON_AMOY_CHAIN_ID,
                chainName: "Polygon Amoy Testnet",
                rpcUrls: ["https://rpc-amoy.polygon.technology"],
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://www.oklink.com/amoy"],
              }],
            });
          } catch (addError) {
            console.error(" Failed to add Polygon Amoy:", addError);
            toast.error(" Failed to add Polygon Amoy network.");
            return;
          }
        } else {
          console.error(" Failed to switch to Amoy:", switchError);
          toast.error(" Failed to switch network.");
          return;
        }
      }
    
      // Connect wallet
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];
        setWalletAddress(address);
        toast.success(` Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
      } catch (err) {
        console.error(" Wallet connection failed:", err);
        toast.error(" Wallet connection failed.");
      }
    };

  const handlePay = async () => {
      if (!walletAddress) return toast.error("Connect your wallet first.");
      const totalAmount = cart.reduce((acc, item) => acc + item.price, 0); // Total cart amount

      try {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

        // Ensure Polygon Amoy network
        if (currentChainId !== POLYGON_AMOY_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: POLYGON_AMOY_CHAIN_ID }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: POLYGON_AMOY_CHAIN_ID,
                  chainName: 'Polygon Amoy Testnet',
                  rpcUrls: ['https://rpc-amoy.polygon.technology'],
                  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                  blockExplorerUrls: ['https://www.oklink.com/amoy'],
                }],
              });
            } else {
              console.error("Network switch failed", switchError);
              toast.error("Failed to switch to Polygon Amoy.");
              return;
            }
          }
        }

        // Ethers.js signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Send payments to individual NFT creators
        for (const item of cart) {
          if (!item.creator) {
            console.warn(` Creator address missing for item: ${item.name}`);
            continue;
          }

          const valueInWei = ethers.parseEther(totalAmount.toString());

          const tx = await signer.sendTransaction({
            to: item.creator,
            value: valueInWei,
          });

          await tx.wait();
          console.log(` Payment sent to ${item.creator} for ${item.name}`);
        }

        //Post-payment cleanup
        const purchasedIds = cart.map((item) => item.id);
        const updatedAvailablePics = availablePics.filter((img) => !purchasedIds.includes(img.id));

        setAvailablePics(updatedAvailablePics);
        setCart([]);
        setShowCart(false);
        localStorage.setItem("mintedPics", JSON.stringify(updatedAvailablePics));

        toast.success("NFTs Purchased and Creators Paid Successfully");
      } catch (err) {
        console.error(" handlePay Error:", err);
        toast.error(" Transaction Failed");
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
