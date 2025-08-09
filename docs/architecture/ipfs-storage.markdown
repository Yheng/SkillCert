# IPFS Storage

**Component**: IPFS Storage  
**Date**: August 9, 2025  
**Reference**: `docs/front-end-architecture.md`

## Overview
Handles task proof storage on IPFS for tamper-proof file uploads.

## Requirements
- **Frontend**: `api/ipfs.js` using ipfs-http-client for file uploads.
- **UI**: Integrated in `TaskForm.jsx` for file upload.
- **Performance**: IPFS upload <2s.
- **Security**: Ensure tamper-proof storage via IPFS CID.
- **Dependencies**: `npm install ipfs-http-client`.

## Implementation
- Setup IPFS node locally or use public gateway.
- Implement upload logic in `api/ipfs.js`.
- Link IPFS CID to blockchain via `SkillCert.sol`.