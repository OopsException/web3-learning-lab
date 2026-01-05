import { expect } from "chai";
import { network } from "hardhat";
import hre from "hardhat";

describe("VaultV2 (pull payments) - exploit-first", function () {
  it("blocks reentrancy from malicious receiver during claim()", async function () {
    const { ethers } = await network.connect();
    const [, alice] = await ethers.getSigners();

    const VaultV2 = await ethers.getContractFactory("VaultV2");
    const vault = await VaultV2.deploy();
    await vault.waitForDeployment();

    const MalFactory = await ethers.getContractFactory("MaliciousReceiver");
    const mal = await MalFactory.deploy(await vault.getAddress());
    await mal.waitForDeployment();

    const seedAmount = ethers.parseEther("1");

    // deposit + requestWithdraw
    await mal.connect(alice).seedAndPrepare({ value: seedAmount });

    expect(await vault.claimable(await mal.getAddress())).to.equal(seedAmount);

    const vaultBalBefore = await ethers.provider.getBalance(
      await vault.getAddress()
    );
    expect(vaultBalBefore).to.equal(seedAmount);

    // attack should revert (transfer fails due to receiver revert)
    await expect(mal.connect(alice).attack(10)).to.be.revertedWith(
      "ETH_TRANSFER_FAILED"
    );

    const vaultBalAfter = await ethers.provider.getBalance(
      await vault.getAddress()
    );
    // funds remain in vault
    expect(vaultBalAfter).to.equal(seedAmount);

    // claimable remains unchanged since transaction reverted
    expect(await vault.claimable(await mal.getAddress())).to.equal(seedAmount);

    const malBal = await ethers.provider.getBalance(await mal.getAddress());
    expect(malBal).to.equal(0n);
  });

  it("requestWithdraw is purely accounting (no ETH sent)", async function () {
    const { ethers } = await network.connect();
    const [, bob] = await ethers.getSigners();

    const VaultV2 = await ethers.getContractFactory("VaultV2");
    const vault = await VaultV2.deploy();
    await vault.waitForDeployment();

    const amt = ethers.parseEther("0.5");

    await vault.connect(bob).deposit({ value: amt });

    const bobBalBefore = await ethers.provider.getBalance(bob.address);

    await vault.connect(bob).requestWithdraw(amt);

    const bobBalAfter = await ethers.provider.getBalance(bob.address);

    // Only gas lost
    expect(bobBalAfter).to.be.lessThan(bobBalBefore);

    expect(await vault.claimable(bob.address)).to.equal(amt);
    expect(await vault.deposited(bob.address)).to.equal(0n);
  });
});
