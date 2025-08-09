# Web3 Integration

**Component**: Web3 Integration  
**Date**: August 9, 2025  
**Reference**: `docs/front-end-architecture.md`

## Overview
Implements blockchain interactions for credential issuance and verification using ethers.js, Hardhat, and Solidity.

## Requirements
- **Smart Contract**: `SkillCert.sol` with functions:
  - `issueCredential`: Records credential (user address, skill, IPFS CID).
  - `verifyCredential`: Verifies credential authenticity.
  - `getCredentials`: Retrieves user credentials.
- **Frontend**: `api/blockchain.js` using ethers.js to call `SkillCert.sol`.
- **Backend**: Hardhat local Ethereum node (`npx hardhat node`).
- **Performance**: Blockchain queries <2s.
- **Security**: Smart contract audits via Hardhat scripts.
- **Dependencies**: `npm install ethers hardhat`.

## Implementation
- Setup Hardhat: `npx hardhat init`.
- Deploy `SkillCert.sol` to local node.
- Connect frontend via ethers.js in `api/blockchain.js`.
- Test with Hardhat scripts.