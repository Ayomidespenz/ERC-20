# ERC20 Token Project

This project demonstrates a basic ERC20 token implementation using Hardhat. It includes a complete ERC20 token contract with all standard functionality, comprehensive tests, and deployment scripts.

## Features

- **BasicERC20 Contract**: Full ERC20 implementation with transfer, approve, and transferFrom functions
- **Event Emission**: Proper Transfer and Approval events for blockchain transparency
- **Comprehensive Testing**: Tests for all ERC20 functionality including edge cases
- **Hardhat Ignition**: Automated deployment scripts
- **TypeScript Support**: Full TypeScript integration

## Contract Functions

- `transfer(address to, uint256 amount)` - Transfer tokens to another address
- `approve(address spender, uint256 amount)` - Approve another address to spend tokens
- `transferFrom(address from, address to, uint256 amount)` - Transfer tokens on behalf of another address
- `balanceOf(address account)` - Get token balance of an address
- `allowance(address owner, address spender)` - Get approved allowance

## Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile contracts:
   ```bash
   npm run compile
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Deploy to local network:
   ```bash
   npx hardhat node
   npm run deploy
   ```
