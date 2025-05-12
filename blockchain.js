// blockchain.js
import Web3 from 'web3';

const INFURA_PROJECT_ID = 'YOUR_INFURA_PROJECT_ID'; // Replace with your actual Infura Project ID
const INFURA_URL = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`; // You can change 'mainnet' to 'sepolia' or another testnet

const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

export async function getLatestBlock() {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    return blockNumber;
  } catch (error) {
    console.error('Error fetching latest block:', error);
    return null;
  }
}

export async function verifyCertificateHash(hash) {
  try {
    // Placeholder logic for verifying certificate hash
    // Implement your actual verification logic here
    console.log(`Verifying certificate hash: ${hash}`);
    return true; // For now, returning true for testing
  } catch (error) {
    console.error('Error verifying certificate hash:', error);
    return false;
  }
}
