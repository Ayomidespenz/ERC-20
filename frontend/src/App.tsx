import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ERC20 ABI - basic functions we need
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  balance: string;
}

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string>('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Form states
  const [contractAddress, setContractAddress] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [approveSpender, setApproveSpender] = useState('');
  const [approveAmount, setApproveAmount] = useState('');

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await provider.send("eth_requestAccounts", []);
        
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);
        
        setMessage({ text: 'Wallet connected successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Please install MetaMask!', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to connect wallet', type: 'error' });
    }
  };

  // Load token information
  const loadTokenInfo = async () => {
    if (!contract || !account) return;
    
    try {
      setLoading(true);
      const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
        contract.balanceOf(account)
      ]);

      setTokenInfo({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        balance: ethers.formatUnits(balance, decimals)
      });
    } catch (error) {
      setMessage({ text: 'Failed to load token info', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Connect to contract
  const connectToContract = async () => {
    if (!signer || !contractAddress) return;
    
    try {
      setLoading(true);
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer);
      setContract(contract);
      setMessage({ text: 'Contract connected!', type: 'success' });
      
      // Load token info after connecting
      setTimeout(loadTokenInfo, 1000);
    } catch (error) {
      setMessage({ text: 'Invalid contract address', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Transfer tokens
  const transferTokens = async () => {
    if (!contract || !transferTo || !transferAmount) return;
    
    try {
      setLoading(true);
      const amount = ethers.parseUnits(transferAmount, tokenInfo?.decimals || 18);
      const tx = await contract.transfer(transferTo, amount);
      await tx.wait();
      
      setMessage({ text: 'Transfer successful!', type: 'success' });
      setTransferTo('');
      setTransferAmount('');
      loadTokenInfo(); // Refresh balance
    } catch (error) {
      setMessage({ text: 'Transfer failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Approve tokens
  const approveTokens = async () => {
    if (!contract || !approveSpender || !approveAmount) return;
    
    try {
      setLoading(true);
      const amount = ethers.parseUnits(approveAmount, tokenInfo?.decimals || 18);
      const tx = await contract.approve(approveSpender, amount);
      await tx.wait();
      
      setMessage({ text: 'Approval successful!', type: 'success' });
      setApproveSpender('');
      setApproveAmount('');
    } catch (error) {
      setMessage({ text: 'Approval failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Load token info when contract or account changes
  useEffect(() => {
    if (contract && account) {
      loadTokenInfo();
    }
  }, [contract, account]);

  return (
    <div className="container">
      <div className="header">
        <h1>🚀 ERC20 Token Manager</h1>
        <p>Manage your ERC20 tokens with ease</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Wallet Connection */}
      <div className="card">
        <h2>🔗 Wallet Connection</h2>
        {!account ? (
          <button className="btn" onClick={connectWallet}>
            Connect MetaMask
          </button>
        ) : (
          <div className="info-item">
            <h3>Connected Account</h3>
            <p>{account}</p>
          </div>
        )}
      </div>

      {/* Contract Connection */}
      <div className="card">
        <h2>📋 Contract Connection</h2>
        <div className="form-group">
          <label>Contract Address:</label>
          <input
            type="text"
            placeholder="0x..."
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </div>
        <button 
          className="btn" 
          onClick={connectToContract}
          disabled={!signer || !contractAddress}
        >
          Connect to Contract
        </button>
      </div>

      {/* Token Information */}
      {tokenInfo && (
        <div className="card">
          <h2>💰 Token Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Token Name</h3>
              <p>{tokenInfo.name}</p>
            </div>
            <div className="info-item">
              <h3>Symbol</h3>
              <p>{tokenInfo.symbol}</p>
            </div>
            <div className="info-item">
              <h3>Decimals</h3>
              <p>{tokenInfo.decimals}</p>
            </div>
            <div className="info-item">
              <h3>Total Supply</h3>
              <p>{parseFloat(tokenInfo.totalSupply).toLocaleString()} {tokenInfo.symbol}</p>
            </div>
            <div className="info-item">
              <h3>Your Balance</h3>
              <p>{parseFloat(tokenInfo.balance).toLocaleString()} {tokenInfo.symbol}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Tokens */}
      {contract && (
        <div className="card">
          <h2>💸 Transfer Tokens</h2>
          <div className="form-group">
            <label>To Address:</label>
            <input
              type="text"
              placeholder="0x..."
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              placeholder="0.0"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </div>
          <button 
            className="btn" 
            onClick={transferTokens}
            disabled={!transferTo || !transferAmount || loading}
          >
            {loading ? 'Processing...' : 'Transfer'}
          </button>
        </div>
      )}

      {/* Approve Tokens */}
      {contract && (
        <div className="card">
          <h2>✅ Approve Tokens</h2>
          <div className="form-group">
            <label>Spender Address:</label>
            <input
              type="text"
              placeholder="0x..."
              value={approveSpender}
              onChange={(e) => setApproveSpender(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              placeholder="0.0"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
            />
          </div>
          <button 
            className="btn" 
            onClick={approveTokens}
            disabled={!approveSpender || !approveAmount || loading}
          >
            {loading ? 'Processing...' : 'Approve'}
          </button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default App; 