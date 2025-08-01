// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TOKEN_NAME = "My ERC20 Token";
const TOKEN_SYMBOL = "MET";
const TOKEN_DECIMALS = 18;
const TOTAL_SUPPLY = 1_000_000_000n; // 1 billion tokens

const BasicERC20Module = buildModule("BasicERC20Module", (m) => {
  const tokenName = m.getParameter("tokenName", TOKEN_NAME);
  const tokenSymbol = m.getParameter("tokenSymbol", TOKEN_SYMBOL);
  const tokenDecimals = m.getParameter("tokenDecimals", TOKEN_DECIMALS);
  const totalSupply = m.getParameter("totalSupply", TOTAL_SUPPLY);

  const token = m.contract("BasicERC20", [tokenName, tokenSymbol, tokenDecimals, totalSupply]);

  return { token };
});

export default BasicERC20Module;
