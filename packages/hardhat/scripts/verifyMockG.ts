import { ethers } from "hardhat";

async function main() {
  // Get the MockG address from environment variables
  const mockGAddress = process.env.MOCK_G_ADDRESS;
  
  if (!mockGAddress) {
    throw new Error("MOCK_G_ADDRESS not found in environment variables");
  }
  
  // Get the contract factory for MockG
  const MockG = await ethers.getContractFactory("MockG");
  
  // Connect to the deployed contract
  const mockG = MockG.attach(mockGAddress);
  
  console.log("Verifying MockG deployment at:", mockGAddress);
  
  // Check token details
  const name = await mockG.name();
  const symbol = await mockG.symbol();
  const decimals = await mockG.decimals();
  const totalSupply = await mockG.totalSupply();
  
  console.log("Token Name:", name);
  console.log("Token Symbol:", symbol);
  console.log("Decimals:", decimals);
  console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals), symbol);
  
  // Check owner's balance
  const deployer = (await ethers.getSigners())[0];
  const deployerAddress = await deployer.getAddress();
  const balance = await mockG.balanceOf(deployerAddress);
  
  console.log("Owner Address:", deployerAddress);
  console.log("Owner Balance:", ethers.formatUnits(balance, decimals), symbol);
  
  // Verify that the owner has 1,000,000 tokens
  const expectedBalance = ethers.parseUnits("100000000000", decimals);
  if (balance.toString() === expectedBalance.toString()) {
    console.log("✓ Verification successful: Owner has exactly 100,000,000 tokens");
  } else {
    console.log("✗ Verification failed: Owner does not have the expected balance");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
