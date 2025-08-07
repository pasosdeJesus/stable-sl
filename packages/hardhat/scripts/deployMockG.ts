import { ethers } from "hardhat";

async function main() {
  // Get the contract factory for MockG
  const MockG = await ethers.getContractFactory("MockG");
  
  console.log("Deploying MockG token...");
  
  // Deploy the contract
  const mockG = await MockG.deploy();
  
  // Wait for the deployment transaction to be mined
  await mockG.waitForDeployment();
  
  const mockGAddress = await mockG.getAddress();
  console.log("MockG deployed to:", mockGAddress);
  
  // Mint 100,000,000 tokens to the deployer (owner)
  // G has 18 decimals, so we need to multiply by 10^18
  const deployer = (await ethers.getSigners())[0];
  const deployerAddress = await deployer.getAddress();
  const amount = ethers.parseUnits("100000000000", 18); // 100,000,000,000 tokens with 18 decimals
  
  console.log("Minting 100,000,000,000 tokens to:", deployerAddress);
  const tx = await mockG.mint(deployerAddress, amount);
  await tx.wait();
  
  console.log("Minted 100,000,000,000 tokens to the owner's account");
  
  // Verify the balance
  const balance = await mockG.balanceOf(deployerAddress);
  console.log("Owner's balance:", ethers.formatUnits(balance, 18), "MG");
  
  // Also check the total supply
  const totalSupply = await mockG.totalSupply();
  console.log("Total supply:", ethers.formatUnits(totalSupply, 18), "MG");
  
  // Save the deployment address to .env file
  console.log("Deployment completed successfully!");
  console.log("Add this line to your .env file:");
  console.log(`MOCK_G_ADDRESS="${mockGAddress}"`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
