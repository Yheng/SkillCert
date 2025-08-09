# Task Submission

**Feature**: Task Submission  
**Date**: August 9, 2025  
**Reference**: `docs/prd.md`, `SkillCert_PRD.markdown`

## Overview
Enables freelancers to submit tasks (e.g., code projects) to earn micro-credentials, with files uploaded to IPFS and linked to a local Ethereum blockchain via smart contracts.

## User Story
As a freelancer, I want to submit tasks through an intuitive form so that I can earn verifiable micro-credentials.

## Requirements
- **UI**: Glassmorphic form (shadcn/ui `<Form>`, `bg-dark-gray/30 backdrop-blur-md`) with file upload and submit button.
- **Inputs**: React Hook Form with aurora gradient focus (`focus:ring-gradient-to-r from-teal-500 to-blue-500`).
- **Button**: Neumorphic (`bg-gray-800 text-green-500 shadow-neumorphic`, `hover:bg-gradient-to-r from-teal-500 to-blue-500`).
- **Animations**:
  - Micro-interaction on input (Framer Motion, `ring-offset-2`).
  - 3D file icon spin on upload (React-Spring).
  - Confetti on submission (React-Confetti, `colors: ['#2DD4BF', '#3B82F6']`).
- **Notification**: “Task uploaded!” (React-Toastify, `bg-gradient-to-r from-teal-500 to-blue-500`).
- **Backend**: 
  - Upload files to IPFS via `api/ipfs.js` (ipfs-http-client).
  - Trigger smart contract call (`api/blockchain.js`, `SkillCert.sol`) to record task submission.
- **Performance**: Form submission <1s, IPFS upload <2s.
- **Accessibility**: WCAG 2.1 (ARIA labels, keyboard navigation).

## User Flow
1. Navigate to Tasks page (`Tasks.jsx`).
2. Fill out glassmorphic form with task details and file upload.
3. Submit form, triggering IPFS upload and blockchain recording.
4. See confetti animation and “Task uploaded!” notification.