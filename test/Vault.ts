import { expect } from "chai";
import { network } from "hardhat";
import type { HardhatEthers } from "@nomicfoundation/hardhat-ethers/types";

describe("Vault", function () {
   let ethers: HardhatEthers;

  before(async function () {
    ({ ethers } = await network.connect());
  });

  it("should set owner to deployer", async function () {
    const [deployer] = await ethers.getSigners();
    const vault = await ethers.deployContract("Vault");
    expect(await vault.owner()).to.equal(deployer.address);
  });

  it("should accept ETH via receive() and emit Deposited", async function () {
    const [deployer] = await ethers.getSigners();
    const vault = await ethers.deployContract("Vault");

    await expect(
      deployer.sendTransaction({
        to: await vault.getAddress(),
        value: 1n,
      })
    )
      .to.emit(vault, "Deposited")
      .withArgs(deployer.address, 1n);

    expect(await vault.balance()).to.equal(1n);
  });

    it("should revert on zero-value deposit", async function () {
    const [deployer] = await ethers.getSigners();
    const vault = await ethers.deployContract("Vault");

    await expect(
        deployer.sendTransaction({
        to: await vault.getAddress(),
        value: 0n,
        })
    ).to.be.revertedWithCustomError(vault, "ZeroAmount");
    });

    it("only owner can withdraw", async function () {
    const [deployer, attacker] = await ethers.getSigners();
    const vault = await ethers.deployContract("Vault");

    await deployer.sendTransaction({
        to: await vault.getAddress(),
        value: 10n,
    });

    await expect(
        vault.connect(attacker).withdrawAll(attacker.address)
    ).to.be.revertedWithCustomError(vault, "NotOwner");
    });

  it("owner can withdrawAll and emit Withdrawn", async function () {
    const [deployer, recipient] = await ethers.getSigners();
    const vault = await ethers.deployContract("Vault");

    await deployer.sendTransaction({ to: await vault.getAddress(), value: 50n });

    await expect(vault.withdrawAll(recipient.address))
      .to.emit(vault, "Withdrawn")
      .withArgs(recipient.address, 50n);

    expect(await vault.balance()).to.equal(0n);
  });

  it("owner can withdraw partial amount", async function () {
    const [deployer, recipient] = await ethers.getSigners();
    const vault = await ethers.deployContract("Vault");

    await deployer.sendTransaction({ to: await vault.getAddress(), value: 100n });

    await vault.withdraw(recipient.address, 30n);
    expect(await vault.balance()).to.equal(70n);
  });
});
