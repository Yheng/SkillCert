import { ethers } from 'ethers';

// Contract configuration
let CONTRACT_ADDRESS = null;
let CONTRACT_ABI = null;

// Load contract address and ABI dynamically
const loadContractData = async () => {
  try {
    const contractAddress = await import('../contracts/contract-address.json');
    const contractABI = await import('../contracts/SkillCert.json');
    
    CONTRACT_ADDRESS = contractAddress.SkillCert;
    CONTRACT_ABI = contractABI.abi;
    
    return true;
  } catch (error) {
    console.warn('Contract artifacts not found. Deploy contract first.');
    return false;
  }
};

// Initialize contract data
loadContractData();

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
  }

  /**
   * Connect to MetaMask or local Hardhat network
   */
  async connectWallet() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        
        // Check if we're on the correct network (Hardhat local)
        const network = await this.provider.getNetwork();
        if (network.chainId !== 1337) {
          throw new Error('Please connect to Hardhat local network (Chain ID: 1337)');
        }
        
        this.isConnected = true;
        
        if (CONTRACT_ADDRESS && CONTRACT_ABI) {
          this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
        }
        
        const address = await this.signer.getAddress();
        console.log('Connected to wallet:', address);
        
        return { success: true, address };
      } else {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Connect to local Hardhat network directly
   */
  async connectToLocalNode() {
    try {
      this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
      
      // Use first account from Hardhat
      const accounts = await this.provider.listAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts available in local node');
      }
      
      // Use the account with private key for local development
      const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // First Hardhat account
      this.signer = new ethers.Wallet(privateKey, this.provider);
      
      this.isConnected = true;
      
      if (CONTRACT_ADDRESS && CONTRACT_ABI) {
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      }
      
      console.log('Connected to local Hardhat node:', this.signer.address);
      return { success: true, address: this.signer.address };
    } catch (error) {
      console.error('Local node connection error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Issue a new credential on the blockchain
   */
  async issueCredential(recipient, skill, ipfsHash, metadata = '') {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Connect wallet first.');
      }

      const tx = await this.contract.issueCredential(
        recipient,
        skill,
        ipfsHash,
        JSON.stringify(metadata)
      );
      
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      
      // Extract credential ID from event
      const event = receipt.events?.find(e => e.event === 'CredentialIssued');
      const credentialId = event?.args?.credentialId?.toNumber();
      
      return {
        success: true,
        credentialId,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Credential issuance error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to issue credential'
      };
    }
  }

  /**
   * Verify a credential on the blockchain
   */
  async verifyCredential(credentialId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Connect wallet first.');
      }

      const result = await this.contract.verifyCredential(credentialId);
      const [isValid, credential] = result;
      
      return {
        success: true,
        isValid,
        credential: {
          id: credential.id.toNumber(),
          recipient: credential.recipient,
          issuer: credential.issuer,
          skill: credential.skill,
          ipfsHash: credential.ipfsHash,
          timestamp: new Date(credential.timestamp.toNumber() * 1000),
          isActive: credential.isActive,
          metadata: credential.metadata
        }
      };
    } catch (error) {
      console.error('Credential verification error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to verify credential'
      };
    }
  }

  /**
   * Get all credentials for a user
   */
  async getUserCredentials(userAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Connect wallet first.');
      }

      const credentialIds = await this.contract.getUserCredentials(userAddress);
      
      if (credentialIds.length === 0) {
        return { success: true, credentials: [] };
      }

      // Get detailed credential information
      const credentials = await this.contract.getCredentialsBatch(credentialIds);
      
      const formattedCredentials = credentials.map(cred => ({
        id: cred.id.toNumber(),
        recipient: cred.recipient,
        issuer: cred.issuer,
        skill: cred.skill,
        ipfsHash: cred.ipfsHash,
        timestamp: new Date(cred.timestamp.toNumber() * 1000),
        isActive: cred.isActive,
        metadata: cred.metadata
      }));
      
      return { success: true, credentials: formattedCredentials };
    } catch (error) {
      console.error('Get user credentials error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch credentials'
      };
    }
  }

  /**
   * Get credentials by skill type
   */
  async getCredentialsBySkill(skill, offset = 0, limit = 10) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Connect wallet first.');
      }

      const credentials = await this.contract.getCredentialsBySkill(skill, offset, limit);
      
      const formattedCredentials = credentials.map(cred => ({
        id: cred.id.toNumber(),
        recipient: cred.recipient,
        issuer: cred.issuer,
        skill: cred.skill,
        ipfsHash: cred.ipfsHash,
        timestamp: new Date(cred.timestamp.toNumber() * 1000),
        isActive: cred.isActive,
        metadata: cred.metadata
      }));
      
      return { success: true, credentials: formattedCredentials };
    } catch (error) {
      console.error('Get credentials by skill error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch credentials by skill'
      };
    }
  }

  /**
   * Authorize an issuer (educator)
   */
  async authorizeIssuer(issuerAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Connect wallet first.');
      }

      const tx = await this.contract.authorizeIssuer(issuerAddress);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Authorize issuer error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to authorize issuer'
      };
    }
  }

  /**
   * Check if an address is authorized to issue credentials
   */
  async isAuthorizedIssuer(address) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Connect wallet first.');
      }

      const isAuthorized = await this.contract.isAuthorizedIssuer(address);
      return { success: true, isAuthorized };
    } catch (error) {
      console.error('Check issuer authorization error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to check issuer authorization'
      };
    }
  }

  /**
   * Get total number of credentials issued
   */
  async getTotalCredentials() {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Connect wallet first.');
      }

      const total = await this.contract.getTotalCredentials();
      return { success: true, total: total.toNumber() };
    } catch (error) {
      console.error('Get total credentials error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to get total credentials'
      };
    }
  }

  /**
   * Get current wallet address
   */
  async getCurrentAddress() {
    try {
      if (!this.signer) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      const address = await this.signer.getAddress();
      return { success: true, address };
    } catch (error) {
      console.error('Get current address error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to get current address'
      };
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(address) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      
      const balance = await this.provider.getBalance(address);
      return { 
        success: true, 
        balance: ethers.utils.formatEther(balance)
      };
    } catch (error) {
      console.error('Get balance error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to get balance'
      };
    }
  }
}

// Create singleton instance
const blockchainService = new BlockchainService();
export default blockchainService;