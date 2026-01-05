import { expect } from "chai";
import { network } from "hardhat";

async function increaseTime(seconds: number) {
  const { ethers } = await network.connect();
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine");
}

describe("TimedVault", function () {
  it("prevents withdrawal before unlock, allows after unlock", async function () {
    const { ethers } = await network.connect();
    const [, user] = await ethers.getSigners();

    const TimedVault = await ethers.getContractFactory("TimedVault");
    const vault = await TimedVault.deploy();
    await vault.waitForDeployment();

    const amt = ethers.parseEther("1");
    const lockSeconds = 3600;

    await vault.connect(user).deposit(lockSeconds, { value: amt });

    // 1️⃣ Immediately → revert
    await expect(
      vault.connect(user).requestWithdraw(amt)
    ).to.be.revertedWithCustomError(vault, "TooEarly");

    // 2️⃣ Just before unlock → still revert
    await increaseTime(lockSeconds - 10);
    await expect(
      vault.connect(user).requestWithdraw(amt)
    ).to.be.revertedWithCustomError(vault, "TooEarly");

    // 3️⃣ AFTER unlock → succeed
    await increaseTime(20);
    await vault.connect(user).requestWithdraw(amt);

    expect((await vault.positions(user.address)).claimable).to.equal(amt);

    await vault.connect(user).claim();

    expect((await vault.positions(user.address)).claimable).to.equal(0n);

    const bal = await ethers.provider.getBalance(
      await vault.getAddress()
    );
    expect(bal).to.equal(0n);
  });

  it("extends unlock time to max on additional deposits", async function () {
    const { ethers } = await network.connect();
    const [, user] = await ethers.getSigners();

    const TimedVault = await ethers.getContractFactory("TimedVault");
    const vault = await TimedVault.deploy();
    await vault.waitForDeployment();

    const a1 = ethers.parseEther("0.5");
    const a2 = ethers.parseEther("0.5");

    await vault.connect(user).deposit(100, { value: a1 });
    const unlock1 = (await vault.positions(user.address)).unlockTime;

    await increaseTime(20);
    await vault.connect(user).deposit(200, { value: a2 });

    const unlock2 = (await vault.positions(user.address)).unlockTime;
    expect(unlock2).to.be.greaterThan(unlock1);
  });
});
