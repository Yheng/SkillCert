# User Profiles

**Feature**: User Profiles  
**Date**: August 9, 2025  
**Reference**: `docs/prd.md`, `SkillCert_PRD.markdown`

## Overview
Allows users to manage profiles (e.g., name, skills) stored in SQLite, with a neumorphic form interface.

## User Story
As a user, I want to manage my profile details so that I can customize my SkillCert experience.

## Requirements
- **UI**: Neumorphic form (shadcn/ui `<Form>`, `shadow-neumorphic`) with React Hook Form inputs.
- **Animations**:
  - Form save button scale (React-Spring, `scale: 1 to 0.95`).
  - Input focus glow (Framer Motion, `ring-offset-2`).
- **Backend**: CRUD operations via `api/user.js` (SQLite, encrypted).
- **Performance**: Profile update <100ms.
- **Accessibility**: WCAG 2.1 (ARIA labels, keyboard navigation).

## User Flow
1. Navigate to Settings page (`Settings.jsx`).
2. Edit profile details in neumorphic form.
3. Save changes, triggering SQLite update and animation.