# Landing Page

**Feature**: Landing Page  
**Date**: August 9, 2025  
**Reference**: `docs/prd.md`, `SkillCert_LandingPage.markdown`

## Overview
Introduces SkillCert with a glassmorphic hero, feature cards, and sign-up form, showcasing blockchain-verified credentials.

## User Story
As a visitor, I want an engaging landing page to understand SkillCert’s value and sign up for a demo.

## Requirements
- **UI**:
  - **Hero**: Glassmorphic background (`bg-dark-gray/30 backdrop-blur-md`), 3D blockchain nodes (Three.js, React-Spring).
  - **Features**: Grid of glassmorphic cards (`bg-dark-gray/20 backdrop-blur-sm`).
  - **CTA**: Neumorphic buttons (`bg-gray-800 text-blue-500 shadow-neumorphic`, `hover:bg-gradient-to-r from-teal-500 to-blue-500`).
  - **Form**: Glassmorphic sign-up form (React Hook Form).
  - **Footer**: Glassmorphic (`bg-dark-gray/20 backdrop-blur-sm`), aurora gradient underline.
- **Animations**:
  - Hero nodes: 3D rotation (React-Spring).
  - CTA hover: Scale (Framer Motion, `scale: 1 to 1.05`).
  - Form submit: Confetti (React-Confetti).
  - Cards: Fade-in (Framer Motion).
- **Notification**: “Explore SkillCert!” (React-Toastify, aurora gradient).
- **Performance**: Page load <1s.
- **Accessibility**: WCAG 2.1 (ARIA labels, contrast ≥4.5:1).

## User Flow
1. Visit Landing page (`Landing.jsx`).
2. Explore hero, features, and sign-up form.
3. Submit form, triggering confetti and notification.