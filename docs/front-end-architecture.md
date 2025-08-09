# SkillCert Frontend Architecture

**Product Name**: SkillCert  
**Date**: August 9, 2025  
**Author**: Architect Agent, via BMad Orchestrator  
**Version**: 1.0  
**Reference**: `docs/prd.md`, `docs/front-end-spec.md`, `SkillCert_Architectural_Summary.markdown`, `SkillCert_PRD.markdown`

## 1. Overview
This frontend architecture defines the technical implementation of **SkillCert**, a decentralized web app for earning, verifying, and showcasing blockchain-verified micro-credentials. The frontend uses **React** and **Vite** for a fast, modular UI, integrating **Web3** (ethers.js, Hardhat, Solidity) for blockchain interactions, **IPFS** for task proof storage, and **SQLite** (via Node.js/Express) for user profiles. The UI leverages **glassmorphism**, **neumorphism**, **micro-interactions**, **3D elements**, and **aurora gradients** to create a futuristic, portfolio-worthy experience for freelancers, educators, employers, and tech recruiters.

### Purpose
- Implement a performant, scalable frontend (<1s page load) that supports the UI/UX spec’s design trends.
- Integrate Web3 for credential issuance/verification and IPFS for task proofs.
- Ensure accessibility (WCAG 2.1) and portfolio appeal for 2025 tech roles.

### Objectives
- **Functional**: Deliver task submission, credential issuance, verification, and progress tracking via React components.
- **Non-Functional**: Achieve <1s page load, <2s blockchain queries, and WCAG 2.1 compliance.
- **Portfolio**: Showcase React, Web3, and modern UI trends (glassmorphism, neumorphism) with screencasts for GitHub/LinkedIn.

## 2. System Architecture
SkillCert’s frontend operates within a client-server architecture, with a local Ethereum blockchain (Hardhat), IPFS for decentralized storage, and SQLite for profiles. The frontend is built with React and Vite, using Tailwind CSS for styling and shadcn/ui for components.

### 2.1 Components
#### Frontend (Client-Side)
- **Framework**: React (18.x), Vite (~500 KB bundle).
- **UI Libraries**:
  - **Tailwind CSS**: Dark theme (Dark Gray #1F2A44, Blue #3B82F6, Teal #2DD4BF, Green #10B981, Light Gray #D1D5DB) with glassmorphism (`bg-dark-gray/30 backdrop-blur-md`) and neumorphism (`shadow-neumorphic`).
  - **shadcn/ui**: Glassmorphic cards, neumorphic buttons, forms, tables.
  - **Framer Motion**: Fade-ins, micro-interactions (e.g., ripple effects, `scale: 1 to 1.05`).
  - **React-Spring**: 3D badge spins, aurora gradient transitions.
  - **React-Toastify**: Notifications with aurora gradients (`bg-gradient-to-r from-teal-500 to-blue-500`).
  - **React-Icons**: Blockchain icons (e.g., `<FaEthereum />`, `<MdBadge />`).
  - **React Hook Form**: Form management with micro-interactions.
  - **React-Confetti**: Celebratory effects for submissions, credentials.
  - **ApexCharts**: Line charts with aurora gradient fill (`fill: linear-gradient(#2DD4BF, #3B82F6)`).
  - **Three.js**: 3D badges, blockchain nodes (low-poly for performance).
- **Web3**: ethers.js for blockchain interactions (credential issuance/verification).
- **State Management**: React Context for user state, React Query (optional) for API caching.

#### Backend Integration
- **API**: Node.js/Express REST API (`/api/users`, `/api/tasks`, `/api/ipfs/upload`, `/api/blockchain/credentials`).
- **Database**: SQLite for profiles, metadata (encrypted with bcrypt).
- **IPFS**: Task proof storage (ipfs-http-client).
- **Blockchain**: Hardhat (local Ethereum node), Solidity smart contracts (`SkillCert.sol`).

#### Optional AI Layer
- **Transformers.js**: Local skill suggestions (e.g., recommend tasks based on user profile).
- **Fallback**: OpenAI API or local logic for skill recommendations.

### 2.2 Component Hierarchy
```
skillcert/
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── GlassCard.jsx        # Glassmorphic card (bg-dark-gray/20 backdrop-blur-sm)
│   │   │   ├── NeumorphicButton.jsx # Neumorphic button (shadow-neumorphic)
│   │   │   ├── ThreeDBadge.jsx      # 3D badge (Three.js, React-Spring spin)
│   │   │   ├── AuroraToast.jsx      # Notification (React-Toastify, aurora gradient)
│   │   ├── Hero.jsx                 # 3D blockchain nodes, glassmorphic background
│   │   ├── FeatureCard.jsx          # Glassmorphic feature card, 3D tilt
│   │   ├── CredentialCard.jsx       # Glassmorphic, 3D badge
│   │   ├── TaskForm.jsx             # Glassmorphic form, micro-interactions
│   │   ├── VerificationTable.jsx    # Glassmorphic table, row slide-in
│   │   ├── ProgressChart.jsx        # ApexCharts with aurora gradient
│   ├── pages/
│   │   ├── Landing.jsx              # Hero, features, CTA, footer
│   │   ├── Dashboard.jsx            # Credential cards, progress chart, task list
│   │   ├── Tasks.jsx                # Task submission form
│   │   ├── Verification.jsx         # Credential verification table
│   │   ├── Settings.jsx             # Neumorphic preference form
│   ├── api/
│   │   ├── user.js                  # Profile CRUD (SQLite)
│   │   ├── task.js                  # Task metadata CRUD
│   │   ├── ipfs.js                  # IPFS uploads
│   │   ├── blockchain.js            # Blockchain interactions (ethers.js)
│   ├── App.jsx                      # Routes, layout
│   ├── index.css                    # Tailwind CSS with custom glassmorphism/neumorphism
```

### 2.3 Data Flow
1. **User Interaction**:
   - **Landing Page**: Users (freelancers, employers) interact with glassmorphic CTAs (`Hero.jsx`, `NeumorphicButton.jsx`), triggering React-Confetti on sign-up.
   - **Task Submission**: Freelancers submit tasks via `TaskForm.jsx` (React Hook Form), uploading files to IPFS (`api/ipfs.js`), triggering smart contract calls (`blockchain.js`, `SkillCert.sol`).
   - **Credential Issuance**: Educators approve tasks via `Tasks.jsx`, issuing credentials on blockchain (`blockchain.js`), displaying 3D badges (`CredentialCard.jsx`).
   - **Verification**: Employers query credentials via `VerificationTable.jsx` (ethers.js), accessing IPFS proofs (`api/ipfs.js`).
   - **Progress Tracking**: Freelancers view skill progress in `ProgressChart.jsx` (ApexCharts, data from SQLite via `api/user.js`).
2. **API Calls**:
   - `/api/users`: CRUD for profiles (SQLite).
   - `/api/tasks`: CRUD for task metadata.
   - `/api/ipfs/upload`: Upload task proofs to IPFS.
   - `/api/blockchain/credentials`: Query/issue credentials (ethers.js).
3. **Blockchain**:
   - Smart Contract (`SkillCert.sol`): `issueCredential`, `verifyCredential`, `getCredentials`.
   - Storage: Credential data (user address, skill, IPFS CID).
4. **UI Rendering**:
   - Glassmorphic cards (`GlassCard.jsx`) for features, credentials.
   - Neumorphic buttons (`NeumorphicButton.jsx`) for CTAs.
   - 3D elements (`ThreeDBadge.jsx`, `Hero.jsx`) for badges, blockchain nodes.
   - Animations: Framer Motion for fade-ins, React-Spring for 3D spins, React-Confetti for celebrations.

### 2.4 Architecture Diagram
```
[User] --> [Frontend: React, Vite, Tailwind CSS]
  |--> [Components: GlassCard.jsx, NeumorphicButton.jsx, ThreeDBadge.jsx, ProgressChart.jsx]
  |     - Landing.jsx: Glassmorphic hero (3D nodes), neumorphic CTAs
  |     - Dashboard.jsx: Glassmorphic cards, aurora charts
  |     - Tasks.jsx: Glassmorphic form, micro-interactions
  |     - Verification.jsx: Glassmorphic table
  |     - Settings.jsx: Neumorphic toggles
  |--> [API: api/user.js, api/task.js, api/ipfs.js, api/blockchain.js]
  |--> [Libraries: shadcn/ui, Framer Motion, React-Spring, ApexCharts, Three.js]
  |
  v
[Backend: Node.js/Express]
  |--> [SQLite]: Profiles, metadata (encrypted)
  |--> [IPFS]: Task proofs (ipfs-http-client)
  |--> [Hardhat]: Local Ethereum node
       |
       v
[Blockchain: Solidity - SkillCert.sol]
  - Functions: issueCredential, verifyCredential, getCredentials
  - Storage: User address, skill, IPFS CID

[Optional AI: Transformers.js]
  - Skill suggestions (local)
```

## 3. Technical Specifications
- **Frontend**:
  - **React Components**: Modular, reusable (`GlassCard.jsx`, `NeumorphicButton.jsx`).
  - **Styling**: Tailwind CSS with custom utilities (`backdrop-blur-md`, `shadow-neumorphic`).
  - **Animations**: Framer Motion (fade-ins, micro-interactions), React-Spring (3D spins), React-Confetti (celebrations).
  - **Performance**: Vite for <1s page load, optimized Three.js (low-poly models).
- **Web3**:
  - **ethers.js**: Connect to Hardhat node, call `SkillCert.sol` functions.
  - **Hardhat**: Local Ethereum node (`npx hardhat node`).
  - **Solidity**: Smart contract for credential management.
- **Storage**:
  - **IPFS**: Task proofs via ipfs-http-client.
  - **SQLite**: Profiles, metadata (encrypted, indexed for <100ms queries).
- **Security**:
  - **Authentication**: JWT tokens for API calls.
  - **Input Sanitization**: React Hook Form with Zod.
  - **Smart Contracts**: Audited via Hardhat scripts.
- **Accessibility**: WCAG 2.1 via shadcn/ui (ARIA labels, keyboard navigation).

## 4. Scalability and Extensibility
- **Scalability**:
  - SQLite: Supports 1,000 users, 10,000 credentials with indexing.
  - Hardhat: Local blockchain for testing, scalable to Polygon in future.
  - IPFS: Decentralized storage for task proofs.
- **Extensibility**:
  - Add new smart contracts for advanced credential types.
  - Support additional blockchains (e.g., Polygon).
  - Expand AI features with Transformers.js or OpenAI API.

## 5. Performance Optimization
- **Bundling**: Vite for ~500 KB bundle, tree-shaking enabled.
- **Animations**: Limit blur effects in glassmorphism, use lightweight Framer Motion transitions.
- **Caching**: React Query (optional) for API calls, memoization for 3D renders.
- **Blockchain Queries**: Optimize ethers.js calls for <2s response.

## 6. Portfolio Showcase
- **GitHub**: Include README with setup (`npm create vite@latest`, `npx hardhat init`), screenshots (glassmorphic cards, 3D badges), and library details.
- **LinkedIn**: Screencasts of landing page (3D nodes, aurora gradients), dashboard (charts, micro-interactions), and verification flow (neumorphic buttons).
- **Interviews**: Highlight React, Web3 (ethers.js, Solidity), and UI trends (glassmorphism, neumorphism).

## 7. PRD Review
- **Alignment**: The architecture fully supports the PRD’s features (task submission, credential issuance, verification, progress tracking) and UI/UX spec’s design trends.
- **Suggestions**: No PRD updates needed, as the tech stack and UI implementation align with requirements.
- **Next Steps**: Proceed to PO validation of all artifacts (`docs/project-brief.md`, `docs/prd.md`, `docs/front-end-spec.md`, `docs/front-end-architecture.md`).

## 8. Implementation Notes
- **Setup**:
  1. Initialize Vite: `npm create vite@latest skillcert --template react`.
  2. Install dependencies: `npm install tailwindcss framer-motion react-spring/web react-confetti three ethers hardhat ipfs-http-client sqlite3 shadcn-ui@latest`.
  3. Configure shadcn/ui: `npx shadcn-ui@latest init` (add `card`, `button`, `form`, `table`).
  4. Setup Hardhat: `npx hardhat init`.
  5. Tailwind Config: Add glassmorphism (`backdrop-blur`), neumorphism (`shadow-neumorphic`), aurora gradients.
- **Development**:
  - Start Vite: `npm run dev`.
  - Run Hardhat: `npx hardhat node`.
  - Run backend: `node server.js`.
- **Testing**: Hardhat scripts for smart contracts, Jest for React components.

## 9. Next Steps
- **Save Output**: Copy this architecture to `docs/front-end-architecture.md`.
- **Handoff to PO**: Validate all artifacts for consistency before sharding for development.