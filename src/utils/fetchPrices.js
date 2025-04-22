/*import { Web3 } from "web3";

const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";
const CONTRACT_ADDRESS = "0x5fe17ae60359e1804d735E7f28C9C4f2B59773f7";

const ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "int8",
                "name": "decimals",
                "type": "int8"
            },
            {
                "indexed": false,
                "internalType": "uint64",
                "name": "timestamp",
                "type": "uint64"
            }
        ],
        "name": "TrxPriceFetched",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "TRX_USD_FEED_ID",
        "outputs": [
            {
                "internalType": "bytes21",
                "name": "",
                "type": "bytes21"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "feedIds",
        "outputs": [
            {
                "internalType": "bytes21",
                "name": "",
                "type": "bytes21"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ftsoV2",
        "outputs": [
            {
                "internalType": "contract FtsoV2Interface",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getStoredTrxPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "int8",
                "name": "decimals",
                "type": "int8"
            },
            {
                "internalType": "uint64",
                "name": "timestamp",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTrxUsdPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "int8",
                "name": "decimals",
                "type": "int8"
            },
            {
                "internalType": "uint64",
                "name": "timestamp",
                "type": "uint64"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "latestDecimals",
        "outputs": [
            {
                "internalType": "int8",
                "name": "",
                "type": "int8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "latestPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "latestTimestamp",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export async function fetchTrxPriceFromOracle() {
    const web3 = new Web3(RPC_URL);
    const base_url = "https://coston2-explorer.flare.network/api";
    // Fetch ABI
    const params = `?module=contract&action=getabi&address=${CONTRACT_ADDRESS}`;
    console.log("Error 1")
    const response = await fetch(base_url + params);
    console.log("Error 2")
    const abi = JSON.parse((await response.json())["result"]);
    console.log("This is ABI", abi);
    console.log("Error 3")
    const registry = new web3.eth.Contract(abi , CONTRACT_ADDRESS);
    console.log("Error 4")
    const res = await registry.methods.getTrxUsdPrice().call();
    console.log("result", res);




    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    console.log("contract here" , contract);
    try {
       
      const tx = await contract.methods.getTrxUsdPrice().call();
      
      const { price, decimals } = await contract.methods.getStoredTrxPrice().call();
      console.log("error 3");
      const trxUsd = Number(price) / 10 ** Number(decimals);
      console.log("error 3");
      console.log(`Fetched TRX/USD price: ${trxUsd}`);
      return trxUsd;
    } catch (err) {
      console.error("Error fetching TRX price:", err);
      return null;
    }
  }

export const fetchEthPriceFromCoingecko = async () => {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await res.json();
    return data.ethereum.usd;
  };*/
