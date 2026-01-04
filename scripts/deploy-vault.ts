import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const vault = await ethers.deployContract("Vault");
  await vault.waitForDeployment();

  console.log("Vault deployed to:", await vault.getAddress());
}

main().catch(console.error);