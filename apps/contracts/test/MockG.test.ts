// Use globalThis.hre for contract:test compatibility (set by hre-mock before Mocha runs)
const hre = (globalThis as any).hre;
const { ethers } = hre;
import { expect } from "chai";

describe("MockG", function () {
  let owner: any;
  let MockG: any;

  before(async () => {
    [owner] = await ethers.getSigners();
    MockG = await ethers.getContractFactory("MockG");
  });

  async function deploy() {
    const token = await MockG.deploy();
    await token.waitForDeployment();
    return token;
  }

  it("Should expose name, symbol and 18 decimals", async function () {
    const token = await deploy();

    expect(await token.name()).to.equal("Mock G");
    expect(await token.symbol()).to.equal("MG");
    expect(await token.decimals()).to.equal(18);
  });

  it("Should mint and move the total supply", async function () {
    const token = await deploy();
    const amount = ethers.parseUnits("1000", 18);

    await token.mint(owner.address, amount);

    expect(await token.totalSupply()).to.equal(amount);
    expect(await token.balanceOf(owner.address)).to.equal(amount);
  });

  it("Should keep mint open: this is a testnet mock, not a real token", async function () {
    const [, stranger] = await ethers.getSigners();
    const token = await deploy();
    const amount = ethers.parseUnits("1", 18);

    await token.connect(stranger).mint(stranger.address, amount);

    expect(await token.balanceOf(stranger.address)).to.equal(amount);
  });

  it("Should reject a transfer larger than the balance", async function () {
    const [, recipient] = await ethers.getSigners();
    const token = await deploy();
    await token.mint(owner.address, ethers.parseUnits("10", 18));

    await expect(
      token.transfer(recipient.address, ethers.parseUnits("11", 18))
    ).to.be.revertedWith("Insufficient balance");
  });

  it("Should honour approve and transferFrom", async function () {
    const [, spender, recipient] = await ethers.getSigners();
    const token = await deploy();
    const amount = ethers.parseUnits("100", 18);
    const spent = ethers.parseUnits("40", 18);
    await token.mint(owner.address, amount);

    await token.approve(spender.address, spent);
    await token.connect(spender).transferFrom(owner.address, recipient.address, spent);

    expect(await token.balanceOf(recipient.address)).to.equal(spent);
    expect(await token.balanceOf(owner.address)).to.equal(amount - spent);
    expect(await token.allowance(owner.address, spender.address)).to.equal(0);
  });

  it("Should reject transferFrom without allowance", async function () {
    const [, spender, recipient] = await ethers.getSigners();
    const token = await deploy();
    await token.mint(owner.address, ethers.parseUnits("10", 18));

    await expect(
      token.connect(spender).transferFrom(owner.address, recipient.address, ethers.parseUnits("1", 18))
    ).to.be.revertedWith("Insufficient allowance");
  });
});
