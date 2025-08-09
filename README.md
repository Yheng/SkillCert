# SkillCert 🏆

A decentralized web application enabling freelancers to earn blockchain-verified micro-credentials, built with cutting-edge technology and modern UI/UX design trends.

## 🌟 Features

- **Blockchain-Verified Credentials**: Tamper-proof credentials stored on Ethereum blockchain
- **IPFS Storage**: Decentralized file storage for task proofs
- **Modern UI/UX**: Glassmorphism, neumorphism, 3D elements, and aurora gradients
- **Real-time Analytics**: Beautiful progress tracking with interactive charts
- **Multi-Role System**: Support for freelancers, educators, and employers
- **Secure Authentication**: JWT-based authentication with encrypted storage

## 🎨 Design System

- **Glassmorphism**: Translucent surfaces with backdrop blur effects
- **Neumorphism**: Tactile buttons and controls with soft shadows  
- **3D Elements**: Interactive 3D badges and blockchain nodes using Three.js
- **Aurora Gradients**: Dynamic color transitions and animations
- **Micro-interactions**: Smooth animations and hover effects
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite** - Modern React development
- **Tailwind CSS** - Utility-first styling with custom design system
- **shadcn/ui** - Accessible component library
- **Framer Motion** - Smooth animations and micro-interactions
- **React Spring** - Physics-based animations for 3D elements
- **Three.js** + **React Three Fiber** - 3D graphics and visualizations
- **ApexCharts** - Interactive data visualization
- **React Hook Form** - Form validation and management

### Backend
- **Node.js** + **Express** - RESTful API server
- **SQLite** - Local database with encrypted storage
- **JWT** - Secure authentication tokens
- **bcrypt** - Password hashing
- **multer** - File upload handling

### Blockchain
- **Hardhat** - Ethereum development environment
- **Solidity** - Smart contract development
- **ethers.js** - Blockchain interaction library
- **OpenZeppelin** - Secure smart contract libraries

### Storage
- **IPFS** - Decentralized file storage
- **SQLite** - Local database for metadata

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillcert.git
   cd skillcert
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile smart contracts**
   ```bash
   npm run compile
   ```

4. **Start all services**
   ```bash
   npm run start:all
   ```

   This will start:
   - Hardhat local blockchain (port 8545)
   - Backend API server (port 3001)  
   - Frontend development server (port 5173)

### Manual Setup (Alternative)

If you prefer to start services individually:

1. **Start Hardhat blockchain** (Terminal 1)
   ```bash
   npm run hardhat
   ```

2. **Deploy smart contracts** (Terminal 2)
   ```bash
   npm run deploy
   ```

3. **Start backend server** (Terminal 3)
   ```bash
   npm run server
   ```

4. **Start frontend** (Terminal 4)
   ```bash
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Hardhat Network**: http://localhost:8545 (Chain ID: 1337)

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

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication  
- `GET /api/users/profile` - Get user profile
- `POST /api/tasks/submit` - Submit new task
- `GET /api/tasks` - Get user tasks
- `GET /api/tasks/pending` - Get pending tasks (educators)
- `POST /api/tasks/:id/approve` - Approve task (educators)
- `GET /api/credentials` - Get user credentials
- `POST /api/credentials` - Store credential metadata
- `GET /api/ipfs/:hash` - Retrieve IPFS files

### Database Schema

- **users**: User profiles and authentication
- **tasks**: Task submissions and metadata
- **credentials**: Local credential metadata
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
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── shared/        # Custom shared components
│   ├── pages/             # Page components
│   ├── api/               # API integration
│   └── contracts/         # Contract artifacts
├── server/                # Backend source code
├── contracts/             # Solidity smart contracts
├── scripts/               # Deployment scripts
└── docs/                  # Project documentation
```

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run hardhat` - Start local blockchain
- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy contracts to local network
- `npm run build` - Build frontend for production
- `npm run test` - Run smart contract tests
- `npm run start:all` - Start all services concurrently

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin** for secure smart contract libraries
- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling
- **Three.js** for 3D graphics capabilities
- **IPFS** for decentralized storage

## 📞 Contact

- **Email**: yhengdesigns@gmail.com
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn Profile]

---

**Built with ❤️ for the future of professional verification**
