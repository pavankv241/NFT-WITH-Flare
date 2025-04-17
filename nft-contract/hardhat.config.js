require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.28",
  networks: {
    bnbTestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      accounts: ["be9ee3b499bf3a95d1608953c001d4e2b7e5f9f51317ec059045b733c9f24e40"],
      chainId: 97
    }
  }
};
