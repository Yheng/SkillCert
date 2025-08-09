# Credential Verification

**Feature**: Credential Verification  
**Date**: August 9, 2025  
**Reference**: `docs/prd.md`, `SkillCert_PRD.markdown`

## Overview
Enables employers to verify freelancer micro-credentials via blockchain queries, with access to IPFS-stored task proofs.

## User Story
As an employer, I want to verify credentials quickly so that I can trust a freelancer’s skills.

## Requirements
- **UI**: Glassmorphic table (shadcn/ui `<Table>`, `bg-dark-gray/20 backdrop-blur-sm`) with credential details and IPFS proof links (React-Icons: `<FaFile />`, `text-teal-500`).
- **Button**: Neumorphic verify button (`bg-gray-800 text-blue-500 shadow-neumorphic`).
- **Animations**:
  - Table row slide-in (Framer Motion, `y: 50 to 0`).
  - 3D checkmark spin on verification (React-Spring).
  - Confetti on successful verification (React-Confetti).
- **Notification**: “Credential verified!” (React-Toastify, `bg-gradient-to-r from-teal-500 to-blue-500`).
- **Backend**:
  - Query credentials via `api/blockchain.js` (ethers.js, `SkillCert.sol: verifyCredential`).
  - Access proofs via `api/ipfs.js`.
- **Performance**: Blockchain query <2s.
- **Accessibility**: WCAG 2.1 (ARIA labels for table rows).

## User Flow
1. Navigate to Verification page (`Verification.jsx`).
2. View credentials in glassmorphic table.
3. Click verify button, triggering blockchain query and IPFS proof access.
4. See 3D checkmark and “Credential verified!” notification.