# Components

**Component**: React Component Hierarchy  
**Date**: August 9, 2025  
**Reference**: `docs/front-end-architecture.md`

## Overview
Defines reusable React components for SkillCert’s UI, implementing glassmorphism, neumorphism, and 3D elements.

## Requirements
- **Components**:
  - `GlassCard.jsx`: Glassmorphic card (`bg-dark-gray/20 backdrop-blur-sm`).
  - `NeumorphicButton.jsx`: Neumorphic button (`shadow-neumorphic`, `hover:bg-gradient-to-r from-teal-500 to-blue-500`).
  - `ThreeDBadge.jsx`: 3D badge (Three.js, React-Spring spin).
  - `AuroraToast.jsx`: Notification (React-Toastify, aurora gradient).
  - `Hero.jsx`: 3D blockchain nodes, glassmorphic background.
  - `FeatureCard.jsx`: Glassmorphic feature card, 3D tilt.
  - `CredentialCard.jsx`: Glassmorphic card with 3D badge.
  - `TaskForm.jsx`: Glassmorphic form with micro-interactions.
  - `VerificationTable.jsx`: Glassmorphic table with row slide-in.
  - `ProgressChart.jsx`: ApexCharts with aurora gradient.
- **Styling**: Tailwind CSS with custom utilities (`backdrop-blur-md`, `shadow-neumorphic`).
- **Animations**:
  - Framer Motion: Fade-ins, micro-interactions.
  - React-Spring: 3D spins, bouncy reveals.
  - React-Confetti: Celebratory effects.
- **Performance**: Component render <100ms.
- **Accessibility**: WCAG 2.1 via shadcn/ui.

## Implementation
- File Structure: `src/components/`.
- Setup: Initialize shadcn/ui (`npx shadcn-ui@latest init`), add `card`, `button`, `form`, `table`.
- Dependencies: `npm install framer-motion @react spring/web react-confetti three`.