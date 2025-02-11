import { ethers } from "hardhat";

async function main() {
  // Deploy the verifier contract first
  const ZKVerifier = await ethers.getContractFactory("ZKVerifier");
  const zkVerifier = await ZKVerifier.deploy();
  await zkVerifier.deployed();
  
  console.log(`ZKVerifier deployed to ${zkVerifier.address}`);

  // Deploy the main contract with the verifier address
  const ZkVerifyContract = await ethers.getContractFactory("ZkVerifyContract");
  const zkVerifyContract = await ZkVerifyContract.deploy(zkVerifier.address);
  await zkVerifyContract.deployed();

  console.log(`ZkVerifyContract deployed to ${zkVerifyContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});