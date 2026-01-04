import { expect } from "chai";
import { network } from "hardhat";
import type { HardhatEthers } from "@nomicfoundation/hardhat-ethers/types";

  describe("Vault", function () {
    let ethers: HardhatEthers;

  before(async function () {
    ({ ethers } = await network.connect());
  });

  it("Should emit the Increment event when calling inc()", async function () {
    const counter = await ethers.deployContract("Counter");

    await expect(counter.inc())
      .to.emit(counter, "Increment")
      .withArgs(1n);
  });

  it("The sum of Increment events should match the current value", async function () {
    const counter = await ethers.deployContract("Counter");
    const deploymentBlockNumber = await ethers.provider.getBlockNumber();

    for (let i = 1; i <= 10; i++) {
      await counter.incBy(i);
    }

    const events = await counter.queryFilter(
      counter.filters.Increment(),
      deploymentBlockNumber,
      "latest"
    );

    let total = 0n;
    for (const event of events) {
      total += event.args.by;
    }

    expect(await counter.x()).to.equal(total);
  });
});
