# ERC20 Token Frontend

A beautiful React web interface for managing ERC20 tokens. Connect your wallet, interact with your tokens, and perform transfers and approvals with ease.

## Features

- 🔗 **MetaMask Integration** - Connect your wallet seamlessly
- 💰 **Token Information Display** - View token details and your balance
- 💸 **Token Transfers** - Send tokens to other addresses
- ✅ **Token Approvals** - Approve other contracts to spend your tokens
- 🎨 **Modern UI** - Beautiful, responsive design
- 📱 **Mobile Friendly** - Works on all devices

## Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

### 1. Connect Your Wallet
- Click "Connect MetaMask" to connect your wallet
- Make sure you have MetaMask installed and configured

### 2. Connect to Your Token Contract
- Enter your deployed ERC20 contract address
- Click "Connect to Contract"
- View token information and your balance

### 3. Transfer Tokens
- Enter the recipient's address
- Enter the amount to transfer
- Click "Transfer" and confirm in MetaMask

### 4. Approve Tokens
- Enter the spender's address (contract that will spend your tokens)
- Enter the amount to approve
- Click "Approve" and confirm in MetaMask

## Requirements

- MetaMask browser extension
- Deployed ERC20 contract address
- Some ETH for gas fees

## Network Configuration

Make sure your MetaMask is connected to the same network where your contract is deployed:
- **Local Hardhat Network**: `http://127.0.0.1:8545`
- **Testnets**: Sepolia, Mumbai, etc.
- **Mainnet**: Ethereum mainnet

## Troubleshooting

- **"Please install MetaMask"**: Install the MetaMask browser extension
- **"Invalid contract address"**: Make sure the contract address is correct and deployed
- **"Transfer failed"**: Check your balance and gas fees
- **"Failed to connect wallet"**: Make sure MetaMask is unlocked and on the correct network 