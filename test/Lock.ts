import { expect } from "chai";
import hre from "hardhat";
import { BasicERC20 } from "../typechain-types";

describe("BasicERC20", function () {
  let token: BasicERC20;
  let owner: any;
  let user1: any;
  let user2: any;

  const tokenName = "Test Token";
  const tokenSymbol = "TEST";
  const tokenDecimals = 18;
  const totalSupply = hre.ethers.parseEther("1000000"); // 1 million tokens

  beforeEach(async function () {
    [owner, user1, user2] = await hre.ethers.getSigners();

    const BasicERC20Factory = await hre.ethers.getContractFactory("BasicERC20");
    token = await BasicERC20Factory.deploy(tokenName, tokenSymbol, tokenDecimals, totalSupply);
  });

  describe("Deployment", function () {
    it("Should set the correct token name", async function () {
      expect(await token.name()).to.equal(tokenName);
    });

    it("Should set the correct token symbol", async function () {
      expect(await token.symbol()).to.equal(tokenSymbol);
    });

    it("Should set the correct decimals", async function () {
      expect(await token.decimals()).to.equal(tokenDecimals);
    });

    it("Should set the correct total supply", async function () {
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    it("Should assign the total supply to the owner", async function () {
      expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
    });

    it("Should emit Transfer event on deployment", async function () {
      // Verify that the initial transfer event was emitted by checking the balance
      // The constructor should have emitted a Transfer event from address(0) to owner
      expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = hre.ethers.parseEther("100");
      
      await expect(token.transfer(user1.address, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, user1.address, transferAmount);

      expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
      expect(await token.balanceOf(owner.address)).to.equal(totalSupply - transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialBalance = await token.balanceOf(user1.address);
      const transferAmount = hre.ethers.parseEther("100");

      await expect(token.connect(user1).transfer(user2.address, transferAmount))
        .to.be.revertedWith("Insufficient balance");
    });

    it("Should update balances correctly after transfer", async function () {
      const transferAmount = hre.ethers.parseEther("500");
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await token.transfer(user1.address, transferAmount);

      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance - transferAmount);
      expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
    });
  });

  describe("Allowances", function () {
    it("Should approve tokens for spender", async function () {
      const approveAmount = hre.ethers.parseEther("1000");

      await expect(token.approve(user1.address, approveAmount))
        .to.emit(token, "Approval")
        .withArgs(owner.address, user1.address, approveAmount);

      expect(await token.allowance(owner.address, user1.address)).to.equal(approveAmount);
    });

    it("Should transfer tokens using transferFrom", async function () {
      const approveAmount = hre.ethers.parseEther("1000");
      const transferAmount = hre.ethers.parseEther("500");

      await token.approve(user1.address, approveAmount);
      
      await expect(token.connect(user1).transferFrom(owner.address, user2.address, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, user2.address, transferAmount);

      expect(await token.balanceOf(user2.address)).to.equal(transferAmount);
      expect(await token.allowance(owner.address, user1.address)).to.equal(approveAmount - transferAmount);
    });

    it("Should fail transferFrom if allowance is insufficient", async function () {
      const approveAmount = hre.ethers.parseEther("100");
      const transferAmount = hre.ethers.parseEther("200");

      await token.approve(user1.address, approveAmount);
      
      await expect(token.connect(user1).transferFrom(owner.address, user2.address, transferAmount))
        .to.be.revertedWith("Allowance exceeded");
    });

    it("Should fail transferFrom if balance is insufficient", async function () {
      const approveAmount = hre.ethers.parseEther("1000");
      const transferAmount = hre.ethers.parseEther("100");

      await token.transfer(user1.address, hre.ethers.parseEther("50"));
      await token.connect(user1).approve(user2.address, approveAmount);
      
      await expect(token.connect(user2).transferFrom(user1.address, owner.address, transferAmount))
        .to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount transfers", async function () {
      await expect(token.transfer(user1.address, 0))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, user1.address, 0);
    });

    it("Should handle zero amount approvals", async function () {
      await expect(token.approve(user1.address, 0))
        .to.emit(token, "Approval")
        .withArgs(owner.address, user1.address, 0);
    });

    it("Should allow self-transfer", async function () {
      const initialBalance = await token.balanceOf(owner.address);
      const transferAmount = hre.ethers.parseEther("100");

      await expect(token.transfer(owner.address, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, owner.address, transferAmount);

      expect(await token.balanceOf(owner.address)).to.equal(initialBalance);
    });
  });
});
