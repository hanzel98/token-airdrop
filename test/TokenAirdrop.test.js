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
const TokenAirdrop = artifacts.require("TokenAirdrop");

// This is an integration test to show how the airdrop would work
describe("TokenAirdrop", () => {
  it("Full Cycle", async () => {
    const [signer, guy] = await ethers.getSigners();

    const token = await TestToken.new(toWei("1000"));

    // Generating a list of random wallets for the test
    const randomAddresses = new Array(15)
      .fill(0)
      .map(() => new Wallet(randomBytes(32).toString("hex")).address);

    // Add our signer to the whitelist of wallets
    // Creates the merkle tree
    const merkleTree = new MerkleTree(
      randomAddresses.concat(signer.address),
      keccak256,
      { hashLeaves: true, sortPairs: true }
    );

    // Getting the merkle root
    const root = merkleTree.getHexRoot();
    // Starts the project witht he merkle root which can't change
    let tokenAirdrop = await TokenAirdrop.new(token.address, root);
    tokenAirdrop = await ethers.getContractAt(
      "TokenAirdrop",
      tokenAirdrop.address
    );

    // Tranfers some ERC20 tokens to the contract to pay the user claims
    await token.transfer(tokenAirdrop.address, parseEther("10"));

    // Each address requires a different merkle proof, this function gets the proof for our signer
    const proof = merkleTree.getHexProof(keccak256(signer.address));

    // The user has not claimed yet
    expect(await tokenAirdrop.claimed(signer.address)).to.eq(false);

    // The user must be able to claim
    expect(await tokenAirdrop.canClaim(signer.address, proof)).to.eq(true);

    // Claiming the tokens using our signer and the valid generated proof
    await tokenAirdrop.claim(proof);

    // TODO: Pending to validate the changes in the token balances in the contract and also in the claimer wallter

    // The signer was marked as claimed true
    expect(await tokenAirdrop.claimed(signer.address)).to.eq(true);

    // Since the signer is marked as claimed true so it can not claim anymore
    expect(await tokenAirdrop.canClaim(signer.address, proof)).to.eq(false);

    // If the signer tries to claim again it gets an expected error
    await expect(tokenAirdrop.claim(proof)).to.be.revertedWith(
      "TokenAirdrop: Address is not a candidate for claim"
    );

    // Trying to see if a random user called guy which was not included in the merkle tree can claim
    expect(await tokenAirdrop.claimed(guy.address)).to.eq(false);

    // The guy user can not claim because he was not in the merkle tree
    expect(await tokenAirdrop.canClaim(guy.address, proof)).to.eq(false);

    // The user guy gets the expected error message
    await expect(tokenAirdrop.connect(guy).claim(proof)).to.be.revertedWith(
      "TokenAirdrop: Address is not a candidate for claim"
    );

    // The user guy was not in the merkle tree so there is no possible merkle proof for him
    const badProof = merkleTree.getHexProof(keccak256(guy.address));
    // The result of the merkle proof is an empty array
    expect(badProof).to.eql([]);

    // Of course an invalid proof would not work
    expect(await tokenAirdrop.canClaim(guy.address, badProof)).to.eq(false);
    await expect(tokenAirdrop.connect(guy).claim(badProof)).to.be.revertedWith(
      "TokenAirdrop: Address is not a candidate for claim"
    );
  });
});
