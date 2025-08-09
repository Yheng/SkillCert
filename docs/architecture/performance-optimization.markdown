# Performance Optimization

**Component**: Performance Optimization  
**Date**: August 9, 2025  
**Reference**: `docs/front-end-architecture.md`

## Overview
Ensures SkillCert meets performance targets (<1s page load, <2s blockchain queries).

## Requirements
- **Bundling**: Vite for ~500 KB bundle, tree-shaking enabled.
- **Animations**: Limit blur in glassmorphism, use lightweight Framer Motion.
- **Caching**: React Query for API calls (optional).
- **3D Optimization**: Low-poly models in Three.js.
- **Performance Targets**:
  - Page load: <1s.
  - Blockchain queries: <2s.
  - SQLite queries: <100ms.

## Implementation
- Use Vite: `npm create vite@latest skillcert --template react`.
- Optimize Three.js: Reduce polygon count for 3D badges/nodes.
- Implement React Query for API caching (optional).
- Index SQLite tables for fast queries.