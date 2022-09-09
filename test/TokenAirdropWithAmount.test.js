/* eslint-disable no-undef */
const { expect } = require("chai");
const { randomBytes } = require("crypto");
const { Wallet } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const toWei = (value) => ethers.utils.parseUnits(value, 18);
const TestToken = artifacts.require("TestToken");
const TokenAirdropWithAmount = artifacts.require("TokenAirdropWithAmount");

// This is an integration test to show how the airdrop would work
describe("TokenAirdropWithAmount", () => {
  it("Full Cycle", async () => {
    const [signer, guy] = await ethers.getSigners();
    const totalSupply = toWei("1600");
    const token = await TestToken.new(totalSupply);
    const amount = toWei("100");

    const types = ["address", "uint256"];
    const newWallet = () => new Wallet(randomBytes(32).toString("hex")).address;
    const encodePacked = (wallet, amount) =>
      ethers.utils.solidityPack(types, [wallet, amount]);
    // Generating a list of random wallets for the test
    const randomAddresses = new Array(15)
      .fill(0)
      .map(() => encodePacked(newWallet(), amount));

    // Adding my address to the merkle tree
    randomAddresses.push(encodePacked(signer.address, amount));
    // Add our signer to the whitelist of wallets
    // Creates the merkle tree
    const merkleTree = new MerkleTree(randomAddresses, keccak256, {
      hashLeaves: true,
      sortPairs: true,
    });

    // Getting the merkle root
    const root = merkleTree.getHexRoot();
    const leafCount = merkleTree.getLeafCount();
    expect(leafCount).to.equal(randomAddresses.length);

    // Starts the project witht he merkle root which can't change
    let tokenAirdrop = await TokenAirdropWithAmount.new(token.address, root);
    tokenAirdrop = await ethers.getContractAt(
      "TokenAirdropWithAmount",
      tokenAirdrop.address
    );

    // Tranfers some ERC20 tokens to the contract to pay the user claims
    await token.transfer(tokenAirdrop.address, totalSupply);

    // Each address requires a different merkle proof, this function gets the proof for our signer
    const proof = merkleTree.getHexProof(
      keccak256(encodePacked(signer.address, amount))
    );

    // The user has not claimed yet
    expect(await tokenAirdrop.claimed(signer.address)).to.eq(false);

    // The user must be able to claim
    expect(await tokenAirdrop.canClaim(signer.address, amount, proof)).to.eq(
      true
    );

    const signerBalanceBeforeClaim = await token.balanceOf(signer.address);
    expect(signerBalanceBeforeClaim.toString()).to.eq("0");

    // Claiming the tokens using our signer and the valid generated proof
    await tokenAirdrop.claim(proof, amount);

    const signerBalanceAfterClaim = await token.balanceOf(signer.address);
    expect(signerBalanceAfterClaim.toString()).to.eq(amount.toString());

    const contractBalanceAfterClaim1 = await token.balanceOf(
      tokenAirdrop.address
    );
    expect(contractBalanceAfterClaim1.toString()).to.eq(
      totalSupply.sub(amount).toString()
    );

    // The signer was marked as claimed true
    expect(await tokenAirdrop.claimed(signer.address)).to.eq(true);

    // Since the signer is marked as claimed true so it can not claim anymore
    expect(await tokenAirdrop.canClaim(signer.address, amount, proof)).to.eq(
      false
    );

    // If the signer tries to claim again it gets an expected error
    await expect(tokenAirdrop.claim(proof, amount)).to.be.revertedWith(
      "Address or amount are invalid for claim"
    );

    // Trying to see if a random user called guy which was not included in the merkle tree can claim
    expect(await tokenAirdrop.claimed(guy.address)).to.eq(false);

    // The guy user can not claim because he was not in the merkle tree
    expect(await tokenAirdrop.canClaim(guy.address, amount, proof)).to.eq(
      false
    );

    // The user guy gets the expected error message
    await expect(
      tokenAirdrop.connect(guy).claim(proof, amount)
    ).to.be.revertedWith("Address or amount are invalid for claim");

    // The user guy was not in the merkle tree so there is no possible merkle proof for him
    const badProof = merkleTree.getHexProof(
      keccak256(encodePacked(guy.address, amount))
    );
    // The result of the merkle proof is an empty array
    expect(badProof).to.eql([]);

    // Of course an invalid proof would not work
    expect(await tokenAirdrop.canClaim(guy.address, amount, badProof)).to.eq(
      false
    );

    await expect(
      tokenAirdrop.connect(guy).claim(badProof, amount)
    ).to.be.revertedWith("Address or amount are invalid for claim");
  });
});
