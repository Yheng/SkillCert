# Credential Issuance

**Feature**: Credential Issuance  
**Date**: August 9, 2025  
**Reference**: `docs/prd.md`, `SkillCert_PRD.markdown`

## Overview
Allows educators to approve freelancer task submissions and issue micro-credentials on a local Ethereum blockchain, displayed as 3D badges.

## User Story
As an educator, I want to approve tasks and issue credentials so that freelancers can showcase verified skills.

## Requirements
- **UI**: Glassmorphic card (shadcn/ui `<Card>`, `bg-dark-gray/20 backdrop-blur-sm`) with 3D badge (Three.js, `<MdBadge />`, `text-teal-500`).
- **Approval Interface**: Glassmorphic table for task review, with IPFS proof access (React-Icons: `<FaFile />`).
- **Button**: Neumorphic approve button (`bg-gray-800 text-green-500 shadow-neumorphic`).
- **Animations**:
  - Bouncy badge reveal (React-Spring, `rotateY: 0 to 360deg`).
  - Micro-interaction on badge hover (Framer Motion, `scale: 1 to 1.05`).
  - Confetti on issuance (React-Confetti).
- **Notification**: “Credential earned!” (React-Toastify, `bg-green-500`).
- **Backend**:
  - Approve tasks via `api/tasks.js` (SQLite).
  - Issue credentials via `api/blockchain.js` (ethers.js, `SkillCert.sol: issueCredential`).
- **Performance**: Blockchain transaction <2s.
- **Accessibility**: WCAG 2.1 (ARIA labels for 3D badge).

## User Flow
1. Navigate to Tasks page (`Tasks.jsx`).
2. Review submissions in glassmorphic table, access IPFS proofs.
3. Approve task, triggering credential issuance on blockchain.
4. Freelancer sees 3D badge and “Credential earned!” notification.