# Settings

**Feature**: Settings  
**Date**: August 9, 2025  
**Reference**: `docs/prd.md`, `SkillCert_PRD.markdown`

## Overview
Enables users to configure preferences (e.g., skill categories) via a glassmorphic form.

## User Story
As a user, I want to configure preferences to tailor my SkillCert experience.

## Requirements
- **UI**: Glassmorphic form (shadcn/ui `<Form>`, `bg-dark-gray/30 backdrop-blur-md`) with neumorphic toggles (`shadow-neumorphic`).
- **Animations**:
  - Toggle switch transition (React-Spring).
  - Input focus glow (Framer Motion).
- **Backend**: Save preferences via `api/user.js` (SQLite).
- **Performance**: Settings update <100ms.
- **Accessibility**: WCAG 2.1 (ARIA labels, keyboard navigation).

## User Flow
1. Navigate to Settings page (`Settings.jsx`).
2. Adjust preferences in glassmorphic form.
3. Save changes, triggering SQLite update and animation.