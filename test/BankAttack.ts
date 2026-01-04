import { expect } from "chai";
import { network } from "hardhat";
import type { HardhatEthers } from "@nomicfoundation/hardhat-ethers/types";

describe("Vault", function () {
   let ethers: HardhatEthers;

  before(async function () {
    ({ ethers } = await network.connect());
  });

  it("drains the bank", async function () {
    const [deployer, attackerEOA] = await ethers.getSigners();

    const bank = await ethers.deployContract("Bank");

    // Honest users deposit
    await bank.connect(deployer).deposit({
    value: ethers.parseEther("10"),
    });

    const attacker = await ethers.deployContract(
      "BankAttacker",
      [await bank.getAddress()],
      { signer: attackerEOA }
    );

    // Attack with 1 ETH
    await attacker.connect(attackerEOA).attack({
      value: ethers.parseEther("1"),
    });

    expect(await ethers.provider.getBalance(await bank.getAddress()))
      .to.equal(0n);
  });
});
