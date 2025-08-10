# 🛡️ SkillCert
> Blockchain-Verified Credentials for the $400B Gig Economy

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.0-646CFF.svg)](https://vitejs.dev/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Hardhat-yellow.svg)](https://hardhat.org/)
[![IPFS](https://img.shields.io/badge/IPFS-Decentralized-green.svg)](https://ipfs.io/)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)](package.json)

## 📋 Overview

**SkillCert** is a decentralized web application that enables freelancers to earn blockchain-verified micro-credentials to prove expertise in the gig economy. Built with modern Web3 technologies, it addresses the 60% hiring barrier faced by freelancers due to unverified skills, potentially increasing hireability by 30%.

The platform uses a local Ethereum blockchain (Hardhat), IPFS for task proof storage, and features a cutting-edge UI with glassmorphism, neumorphism, micro-interactions, 3D elements, and aurora gradients.

### 🎯 Target Audience

- **🚀 Freelancers**: Earn and share verified credentials to boost hireability
- **🎓 Educators**: Issue credentials via tasks and smart contracts  
- **🏢 Employers**: Verify credentials instantly via blockchain
- **💼 Tech Recruiters**: View portfolios showcasing React, Web3, and modern UI trends

## ✨ Key Features

### 🔐 For Freelancers
- **📝 Task Submission**: Upload projects via glassmorphic forms with IPFS storage
- **🏆 Credential Earning**: Receive 3D blockchain badges for verified skills
- **📊 Progress Tracking**: Visualize skill growth with ApexCharts and aurora gradients
- **🎨 Portfolio Showcase**: Modern UI with glassmorphism and neumorphism effects

### 🎓 For Educators  
- **✅ Task Review**: Approve submissions through elegant interfaces
- **🔗 Blockchain Issuance**: Issue tamper-proof credentials via smart contracts
- **📋 Management Tools**: Track student progress and credential history

### 🏢 For Employers
- **⚡ Instant Verification**: Query credentials in under 2 seconds via blockchain
- **🔍 Proof Access**: View original task submissions stored on IPFS
- **📱 Mobile Friendly**: Responsive design for on-the-go verification

### 🎨 Modern UI/UX
- **✨ Glassmorphism**: Translucent cards with backdrop blur effects
- **🌟 Neumorphism**: Soft, embossed button designs
- **🎭 Micro-interactions**: Smooth animations powered by Framer Motion
- **🌈 Aurora Gradients**: Beautiful color transitions throughout
- **🎆 3D Elements**: Interactive blockchain nodes and credential badges

## 🛠️ Technology Stack

### Frontend
```typescript
React 19.1.1       // Core framework
Vite 7.1.0         // Build tool & dev server
Tailwind CSS       // Utility-first styling
shadcn/ui          // Component library
Framer Motion      // Animation library
React-Spring       // Physics-based animations
Three.js           // 3D graphics
ApexCharts         // Data visualization
```

### Blockchain & Web3
```solidity
Hardhat 2.26.2     // Ethereum development environment
Ethers.js 6.15.0   // Ethereum library
Solidity ^0.8.20   // Smart contract language
OpenZeppelin       // Security contracts
IPFS HTTP Client   // Decentralized storage
```

### Backend
```javascript
Node.js + Express  // API server
SQLite3 5.1.7      // Database
JWT & bcryptjs     // Authentication & security
Multer             // File upload handling
CORS               // Cross-origin requests
```

### Development Tools
```bash
ESLint            // Code linting
Concurrently      // Run multiple scripts
PostCSS           // CSS processing
Autoprefixer      // CSS vendor prefixes
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation Options

#### 🔥 One-Click Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/Yheng/skillcert.git
cd skillcert

# Install dependencies
npm install

# Setup blockchain contracts
npm run setup

# Start all services (Hardhat + Server + Frontend)
npm run start:all
```

#### 🔧 Manual Setup
```bash
# 1. Clone and install
git clone https://github.com/Yheng/skillcert.git
cd skillcert
npm install

# 2. Start Hardhat blockchain (Terminal 1)
npm run hardhat

# 3. Deploy contracts (Terminal 2)
npm run deploy

# 4. Start backend server (Terminal 3)
npm run server

# 5. Start frontend (Terminal 4)
npm run dev
```

#### 🐳 Docker Setup (Coming Soon)
```bash
docker-compose up -d
```

### Access the Application

- **Frontend**: http://localhost:5173+ (Vite dev server)
- **Backend API**: http://localhost:3002 (Express server) 
- **Hardhat Network**: http://localhost:8545 (Chain ID: 1337)

### Demo Accounts
Create accounts through the registration form with different roles:
- **Freelancer**: For earning credentials
- **Educator**: For issuing credentials (requires admin approval)
- **Employer**: For verifying credentials

## 📱 Usage

### For Freelancers

1. **Sign Up**: Create an account on the landing page
2. **Submit Tasks**: Upload projects demonstrating your skills
3. **Earn Credentials**: Get verified by educators and receive 3D badges
4. **Track Progress**: Monitor your skill development with interactive charts
5. **Share Credentials**: Generate verification links for employers

### For Educators

1. **Get Authorized**: Request educator privileges from admin
2. **Review Submissions**: Evaluate freelancer task submissions
3. **Issue Credentials**: Approve tasks and mint blockchain credentials
4. **Manage Tasks**: Track pending and completed reviews

### For Employers

1. **Verify Credentials**: Check authenticity of freelancer credentials
2. **View Proofs**: Access IPFS-stored project evidence
3. **Instant Verification**: Get real-time blockchain verification results

## 🏗 Architecture

### Smart Contract (SkillCert.sol)

- **Credential Management**: Issue, verify, and revoke credentials
- **Access Control**: Role-based permissions for educators
- **Data Integrity**: Immutable credential records
- **Batch Operations**: Efficient querying of multiple credentials

### API Endpoints

#### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication  
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `GET /api/users/export` - Export user data

#### Task Management
- `POST /api/tasks/submit` - Submit new task (with file upload)
- `GET /api/tasks` - Get user tasks
- `GET /api/tasks/pending` - Get pending tasks (educators only)
- `POST /api/tasks/:taskId/approve` - Approve task (educators only)

#### Educator Features
- `POST /api/educator/tasks` - Create new task template
- `GET /api/educator/tasks` - Get educator's tasks
- `GET /api/educator/submissions` - Get student submissions
- `POST /api/educator/submissions/:id/approve` - Approve submission
- `POST /api/educator/submissions/:id/reject` - Reject submission
- `GET /api/educator/students` - Get student list

#### Credentials & Verification
- `GET /api/credentials` - Get user credentials
- `POST /api/credentials` - Store credential metadata
- `GET /api/verify/:identifier` - Verify credential by ID
- `GET /api/verify/user/:identifier` - Verify user credentials

#### IPFS & File Storage
- `GET /api/ipfs/:hash` - Retrieve files from IPFS
- File uploads handled via Multer middleware (10MB limit)

### Database Schema

- **users**: User profiles (id, email, name, password_hash, role, primary_skill, profile_data, created_at, updated_at)
- **tasks**: Task submissions (id, user_id, title, description, skill, file_path, ipfs_hash, status, metadata, created_at, updated_at)
- **credentials**: Blockchain credential metadata (id, user_id, blockchain_id, skill, ipfs_hash, transaction_hash, metadata, created_at)
- **educator_tasks**: Task templates created by educators
- Indexes for optimal query performance

## 🎯 Performance Targets

- ⚡ **Page Load**: < 1 second
- 🔗 **Blockchain Queries**: < 2 seconds  
- 💾 **Database Queries**: < 100ms
- 📱 **Mobile Responsive**: All screen sizes
- ♿ **Accessibility**: WCAG 2.1 AA compliant

## 🔧 Development

### Project Structure

```
skillcert/
├── 📂 src/                           # Frontend source code
│   ├── 📂 components/               # React components  
│   │   ├── 📂 ui/                  # shadcn/ui base components
│   │   └── 📂 shared/              # Custom reusable components
│   │       ├── 🎨 GlassCard.jsx     # Glassmorphic cards
│   │       ├── 🎯 NeumorphicButton.jsx # 3D-style buttons
│   │       ├── 🏆 ThreeDBadge.jsx   # 3D credential badges  
│   │       ├── 🌈 AuroraToast.jsx   # Gradient notifications
│   │       └── 📊 Analytics.jsx     # Data visualization
│   ├── 📂 pages/                   # Application pages
│   │   ├── 🌟 ProfessionalLanding.jsx # Main landing page
│   │   ├── 📊 Dashboard.jsx         # User dashboard
│   │   ├── 📝 Tasks.jsx             # Task management
│   │   ├── ✅ Verification.jsx      # Credential verification
│   │   ├── ⚙️ Settings.jsx          # User settings
│   │   └── 🎓 EducatorDashboard.jsx # Educator interface
│   ├── 📂 api/                     # API integration layer
│   │   ├── ⚙️ backend.js           # Backend API calls
│   │   └── ⛓️ blockchain.js         # Smart contract interactions
│   ├── 📂 contracts/               # Contract artifacts & addresses
│   └── 📂 utils/                   # Utility functions
├── 📂 server/                      # Express.js backend
│   ├── 🖥️ index.js                 # Main server file
│   ├── 💾 skillcert.db             # SQLite database
│   └── 📁 uploads/                 # File upload storage
├── 📂 contracts/                   # Solidity smart contracts
│   └── 🛡️ SkillCert.sol           # Main credential contract
├── 📂 scripts/                     # Blockchain deployment
│   └── 🚀 deploy.js                # Contract deployment script
├── 📂 docs/                        # Project documentation
│   ├── 📋 project-brief.md         # Project overview
│   └── 🏗️ front-end-architecture.md # Technical architecture
└── 📂 artifacts/                   # Compiled contract artifacts
```

### Available Scripts

- `npm run dev` - Start Vite frontend development server
- `npm run build` - Build frontend for production  
- `npm run preview` - Preview production build
- `npm run server` - Start Express backend API server (port 3002)
- `npm run hardhat` - Start local Hardhat blockchain node
- `npm run compile` - Compile Solidity smart contracts
- `npm run deploy` - Deploy contracts to local Hardhat network
- `npm run setup` - Compile and deploy contracts in one step
- `npm run start:all` - Start all services concurrently (Hardhat + Server + Frontend)
- `npm run test` - Run Hardhat smart contract tests  
- `npm run lint` - Run ESLint code linting

### Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-secret-key-here
PORT=3001
NODE_ENV=development
```

## 🧪 Testing

### Smart Contract Testing

```bash
npm run test
```

### Manual Testing Workflow

1. Register as a freelancer
2. Submit a task with file upload
3. Register as an educator (separate browser/incognito)
4. Review and approve the task
5. View the issued credential with 3D badge
6. Test credential verification
7. Export credentials and share verification links

## 🚢 Deployment

### Production Build

```bash
npm run build
npm run preview
```

### Smart Contract Deployment

For production networks, update `hardhat.config.js` with network configuration and deploy:

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## 🔒 Security

- **Authentication**: JWT tokens with secure expiration
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Server-side validation and sanitization
- **File Upload**: Type and size restrictions
- **Smart Contract**: OpenZeppelin security patterns
- **Database**: Encrypted sensitive data storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin** for secure smart contract libraries
- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling
- **Three.js** for 3D graphics capabilities
- **IPFS** for decentralized storage

## 📈 Performance Benchmarks

### ⚡ Speed Metrics
- **Page Load**: < 1 second
- **Blockchain Queries**: < 2 seconds
- **SQLite Operations**: < 100ms
- **IPFS Upload**: < 5 seconds
- **Bundle Size**: ~500KB gzipped

### 📊 Scalability Targets
- **Users**: 10,000+ concurrent
- **Credentials**: 100,000+ issued
- **Storage**: Unlimited (IPFS)
- **Transactions**: 1000+ per minute

## 🔒 Security Features

### 🛡️ Smart Contract Security
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Ownable**: Access control for admin functions
- **Input Validation**: Comprehensive parameter checking
- **Event Logging**: Complete audit trail

### 🔐 Application Security
- **JWT Authentication**: Secure session management
- **bcrypt Hashing**: Password encryption
- **Input Sanitization**: XSS and injection protection
- **CORS Configuration**: Cross-origin request control
- **Rate Limiting**: API abuse prevention

### 📄 Data Privacy
- **IPFS Storage**: Decentralized file storage
- **Encrypted Database**: SQLite encryption at rest
- **No Sensitive Data**: Personal info not on blockchain
- **GDPR Compliance**: Right to data portability

## 📚 Documentation

- **📋 Project Brief**: [docs/project-brief.md](docs/project-brief.md)
- **🏗️ Architecture**: [docs/front-end-architecture.md](docs/front-end-architecture.md)
- **🔗 API Reference**: [docs/api-reference.md](docs/api-reference.md)
- **🎨 UI Components**: [docs/component-library.md](docs/component-library.md)
- **⛓️ Smart Contracts**: [docs/smart-contracts.md](docs/smart-contracts.md)

## 🐛 Known Issues & Roadmap

### 🔧 Current Limitations
- Local blockchain only (Hardhat)
- SQLite for development
- Manual credential approval

### 🗺️ Upcoming Features
- **🌐 Mainnet Integration**: Polygon deployment
- **🤖 AI Skill Matching**: Enhanced recommendations  
- **📱 Mobile App**: React Native version
- **🔗 Multi-chain**: Support for multiple blockchains
- **⚡ Auto-verification**: Automated task checking

## 🤝 Contributing Guidelines

### 🔄 Development Workflow

1. **🍴 Fork the repository**
2. **🌿 Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **✨ Make your changes**
   ```bash
   # Follow code style guidelines
   npm run lint
   npm run test
   ```
4. **📝 Commit your changes**
   ```bash
   git commit -m "✨ Add amazing feature"
   ```
5. **📤 Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **🔄 Open a Pull Request**

### 📝 Commit Convention
```
✨ feat: new feature
🐛 fix: bug fix
📚 docs: documentation
🎨 style: formatting
♻️ refactor: code refactoring
⚡ perf: performance improvement
✅ test: adding tests
🔧 chore: maintenance
```

## 📜 License

This project is licensed under the **GPL-3.0 License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ariel Retes**
- 📧 Email: yhengdesigns@gmail.com
- 💼 GitHub: [@Yheng](https://github.com/Yheng)
- 🌐 Portfolio: [arielretes.dev](https://arielretes.dev)
- ☕ Buy me a coffee: [buymeacoffee.com/arielretes](https://www.buymeacoffee.com/arielretes)

## 🙏 Acknowledgments

- **⚛️ React Team** - Amazing framework
- **⚡ Vite Team** - Lightning-fast build tool
- **🔗 Ethereum Foundation** - Blockchain infrastructure
- **📁 IPFS Team** - Decentralized storage solution
- **🎨 shadcn** - Beautiful UI components
- **🌈 Tailwind CSS** - Utility-first styling

## 🌟 Support

If you found this project helpful, please consider:

- ⭐ **Starring** the repository
- 🍴 **Forking** for your own projects
- 🐛 **Reporting issues** you encounter
- 💡 **Suggesting improvements**
- ☕ **Buying me a coffee** at [buymeacoffee.com/arielretes](https://www.buymeacoffee.com/arielretes)

---

<div align="center">

**Made with ❤️ for the future of work**

[⭐ Star this repo](https://github.com/Yheng/skillcert) | [🐛 Report Bug](https://github.com/Yheng/skillcert/issues) | [💡 Request Feature](https://github.com/Yheng/skillcert/issues)

</div>
