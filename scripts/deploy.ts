import { ethers } from "hardhat";

async function main() {
  const ZkVerifyContract = await ethers.getContractFactory("ZkVerifyContract");
  const zkVerifyContract = await ZkVerifyContract.deploy();

  await zkVerifyContract.deployed();

  console.log(`ZkVerifyContract deployed to ${zkVerifyContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});