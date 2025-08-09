# Progress Tracking

**Feature**: Progress Tracking  
**Date**: August 9, 2025  
**Reference**: `docs/prd.md`, `SkillCert_PRD.markdown`

## Overview
Visualizes freelancer skill progress with interactive charts, showcasing growth to employers.

## User Story
As a freelancer, I want to see my skill progress in a visual dashboard so that I can track my growth.

## Requirements
- **UI**: Glassmorphic card (shadcn/ui `<Card>`, `bg-dark-gray/20 backdrop-blur-sm`) with ApexCharts line chart (aurora gradient fill: `fill: linear-gradient(#2DD4BF, #3B82F6)`).
- **Animations**:
  - Chart fade-in (Framer Motion, `opacity: 0 to 1`).
  - Tooltip pulse on hover (Framer Motion).
- **Backend**: Fetch progress data from `api/user.js` (SQLite).
- **Performance**: Chart render <1s.
- **Accessibility**: WCAG 2.1 (ARIA labels for chart, keyboard navigation).

## User Flow
1. Navigate to Dashboard (`Dashboard.jsx`).
2. View progress chart in glassmorphic card.
3. Hover for tooltips with skill details.