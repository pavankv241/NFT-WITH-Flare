import React, { useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import config from "../utils/config.js"


export default function MintNFTPage({ walletAddress, onBack, onAddMintedPic }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [minting, setMinting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [network, setNetwork] = useState("sepolia");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleMint = async () => {
    if (!file || !walletAddress || !price) {
      toast.success("Please connect your wallet, upload a file, and enter price.");
      return;
    }
  
    try {
      setMinting(true);
  
      // 1. Upload to IPFS manually via fetch
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pinataMetadata", JSON.stringify({ name: name || "Minted NFT" }));
      formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
  
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: formData,
      });
  
      if (!res.ok) throw new Error("Upload to IPFS failed");
  
      const result = await res.json();
      console.log(result);
      const ipfsHash = result.IpfsHash;
  
      // Ensure IPFS URL is a string
      const ipfsUrl = String(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      console.log("Uploaded IPFS URL:", ipfsUrl); // Log the URL
  
      // 2. Connect to smart contract & Send minting fee
      /*if (network === "bnbTestnet") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x61" }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: "0x61",
                chainName: "BNB Smart Chain Testnet",
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                nativeCurrency: {
                  name: "BNB",
                  symbol: "tBNB",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://testnet.bscscan.com"],
              }],
            });
          } else {
            throw switchError;
          }
        }
      } else if (network === "sepolia") {*/
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: "0xaa36a7",
                chainName: "Ethereum Sepolia Testnet",
                rpcUrls: ["https://eth-sepolia.g.alchemy.com/v2/EH0YqqZKDFerFHCBkSo4a15uusnCGdpx"],
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              }],
            });
          } else {
            throw switchError;
          }
        }

      // Use BrowserProvider instead of Web3Provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      const selectedAddress = network === "bnbTestnet" ? config.BNB_CONTRACT_ADDRESS : config.SEPOLIA_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(selectedAddress, config.ABI, signer);
  
      // Explicitly convert ipfsUrl to string here
      const tx1 = await contract.mintNFT(walletAddress, String(ipfsUrl), { gasLimit: 500000 });
      console.log("Minting transaction:", tx1);
  
      const receipt = await tx1.wait();
      console.log("Minting receipt:", receipt);
  
      const tx = await signer.sendTransaction({
        to: import.meta.env.VITE_RECEIVER_WALLET,
        value: ethers.parseEther("0.0001"),
      });
      await tx.wait();
      console.log("Fee transaction completed:", tx);
  
      const nftDetails = {
        id: Date.now(),
        name: name || "Minted NFT",
        description,
        src: ipfsUrl,
        price: parseFloat(price),
        creator: walletAddress
      };
  
      onAddMintedPic(nftDetails);
  
      toast.success("NFT minted and fee paid!");
    } catch (err) {
      console.error("Minting error:", err);
      toast.error("Minting failed.");
    } finally {
      setMinting(false);
    }
  };
  


  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Mint Your NFT</h2>

      <input
        type="text"
        className="w-full mb-3 px-4 py-2 border rounded"
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="NFT Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-3 px-4 py-2 border rounded"
      />

      <input
        type="number"
        className="w-full mb-3 px-4 py-2 border rounded"
        onChange={(e) => setPrice(e.target.value)}
        value={price}
        placeholder="NFT Price in ETH"
        step="0.00001"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="w-full mb-4 rounded" />
      )}

      {/* Network Selector */}
      <select 
        className="w-full mb-3 px-4 py-2 border rounded"
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
      >
        <option value="sepolia">Ethereum Sepolia</option>
        {/*<option value="bnbTestnet">BNB Testnet</option>*/}
      </select>

    {/* Button Row */}
    <div className="flex justify-between">
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-1/2 mr-2"
        onClick={onBack}
      >
        Back
      </button>

      <button
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-1/2 ml-2"
        onClick={handleMint}
        disabled={minting}
      >
        {minting ? "Minting..." : "Mint & Pay"}
      </button>
    </div>

    </div>
  );
}
