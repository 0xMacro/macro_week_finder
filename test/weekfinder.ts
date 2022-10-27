import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { BigNumber, BigNumberish } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WeekFinder } from "../typechain-types"; // eslint-disable-line

describe("Week Finder", () => {
  let deployer: SignerWithAddress;
  let weekFinder: WeekFinder;

  beforeEach(async () => {
    [deployer] = await ethers.getSigners();

    const WeekFinder = await ethers.getContractFactory("WeekFinder");
    weekFinder = await upgrades.deployProxy(WeekFinder, [
      "https://time.is/Unix_time_converter",
      deployer.address,
    ]) as WeekFinder
  });

  it("fails when date before Oct 17 2022", async () => {
    const d = Math.floor((new Date("2022-10-07T20:21:21.539Z")).getTime() / 1000)
    await expect(
      weekFinder.fromDateToWeekNumber(d)
    ).to.be.revertedWithCustomError(weekFinder, "TooEarly")
  })

  it("fails to call initialize on implementation contract", async () => {
    const currentImplAddress =
      await upgrades.erc1967.getImplementationAddress(weekFinder.address)

    const WeekFinder = await ethers.getContractFactory("WeekFinder")
    const impl = await WeekFinder.attach(currentImplAddress) as WeekFinder

    await expect(
      impl.initialize("https://time.is/Unix_time_converter", deployer.address)
    ).to.be.revertedWith("Initializable: contract is already initialized")
  })

  it("fails to call initialize once proxy has already been initialized", async () => {
    await expect(
      weekFinder.initialize("https://time.is/Unix_time_converter", deployer.address)
    ).to.be.revertedWith("Initializable: contract is already initialized")
  })

  describe("Block 9", () => {

    it("works for W0 in Block 9", async () => {
      let d = Math.floor(new Date("2022-10-17T00:00:00.000Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W0")

      d = Math.floor(new Date("2022-10-23T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W0")
    })

    it("works for W1 in Block 9", async () => {
      let d = Math.floor(new Date("2022-10-24T00:00:00.001Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W1")

      d = Math.floor(new Date("2022-10-30T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W1")
    })

    it("works for W2 in Block 9", async () => {
      let d = Math.floor(new Date("2022-10-31T00:00:00.001Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W2")

      d = Math.floor(new Date("2022-11-06T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W2")
    })

    it("works for W3 in Block 9", async () => {
      let d = Math.floor(new Date("2022-11-07T00:00:00.001Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W3")

      d = Math.floor(new Date("2022-11-13T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W3")
    })

    it("works for W4 in Block 9", async () => {
      let d = Math.floor(new Date("2022-11-14T00:00:00.001Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W4")

      d = Math.floor(new Date("2022-11-20T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W4")
    })

    it("works for W5 in Block 9", async () => {
      let d = Math.floor(new Date("2022-11-21T00:00:00.001Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W5")

      d = Math.floor(new Date("2022-11-27T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W5")
    })

    it("works for W6 in Block 9", async () => {
      let d = Math.floor(new Date("2022-11-28T00:00:00.001Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W6")

      d = Math.floor(new Date("2022-12-04T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W6")
    })
  })

  describe("Block 10", () => {
    it("works for W0 in Block 10", async () => {
      let d = Math.floor(new Date("2023-01-02T00:00:00.000Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W0")

      d = Math.floor(new Date("2023-01-06T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W0")
    })

    it("works for W1 in Block 10", async () => {
      let d = Math.floor(new Date("2023-01-09T00:00:00.000Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W1")

      d = Math.floor(new Date("2023-01-15T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W1")
    })

    it("works for W6 in Block 10", async () => {
      let d = Math.floor(new Date("2023-02-13T00:00:00.000Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W6")

      d = Math.floor(new Date("2023-02-19T23:59:59.999Z").getTime() / 1000)
      expect(await weekFinder.fromDateToWeekNumber(d)).to.equal("W6")
    })
  })
});
