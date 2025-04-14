require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/EH0YqqZKDFerFHCBkSo4a15uusnCGdpx",
      accounts: ["be9ee3b499bf3a95d1608953c001d4e2b7e5f9f51317ec059045b733c9f24e40"],
    },
  },
};
