import { expect } from "chai";
import { ethers } from "hardhat";
import { ZkVerifyContract } from "../typechain-types";

describe("ZkVerifyContract", function () {
  let zkVerifyContract: ZkVerifyContract;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const ZkVerifyContract = await ethers.getContractFactory("ZkVerifyContract");
    zkVerifyContract = await ZkVerifyContract.deploy();
  });

  describe("Proof Verification", function () {
    it("Should verify a valid proof", async function () {
      const proof = {
        a: [1, 2],
        b: [[3, 4], [5, 6]],
        c: [7, 8]
      };
      
      const input = [1];
      
      const tx = await zkVerifyContract.verifyProof(
        proof.a,
        proof.b,
        proof.c,
        input
      );
      
      await tx.wait();
      
      expect(await zkVerifyContract.isVerified(owner.address)).to.be.true;
    });

    it("Should emit ProofVerified event", async function () {
      const proof = {
        a: [1, 2],
        b: [[3, 4], [5, 6]],
        c: [7, 8]
      };
      
      const input = [1];
      
      await expect(zkVerifyContract.verifyProof(
        proof.a,
        proof.b,
        proof.c,
        input
      ))
        .to.emit(zkVerifyContract, "ProofVerified")
        .withArgs(owner.address, true);
    });
  });
});