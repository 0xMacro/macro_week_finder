import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { BigNumber, BigNumberish } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WeekFinder } from "../typechain-types"; // eslint-disable-line

// ----------------------------------------------------------------------------
// OPTIONAL: Constants and Helper Functions
// ----------------------------------------------------------------------------
// We've put these here for your convenience, and to make you aware these built-in
// Hardhat functions exist. Feel free to use them if they are helpful!
const SECONDS_IN_DAY: number = 60 * 60 * 24;
const ONE_ETHER: BigNumber = ethers.utils.parseEther("1");

// Bump the timestamp by a specific amount of seconds
const timeTravel = async (seconds: number): Promise<number> => {
  return time.increase(seconds);
};

// Or, set the time to be a specific amount (in seconds past epoch time)
const timeTravelTo = async (seconds: number): Promise<void> => {
  return time.increaseTo(seconds);
};

// Compare two BigNumbers that are close to one another.
//
// This is useful for when you want to compare the balance of an address after
// it executes a transaction, and you don't want to worry about accounting for
// balances changes due to paying for gas a.k.a. transaction fees.
const closeTo = async (
  a: BigNumberish,
  b: BigNumberish,
  margin: BigNumberish
) => {
  expect(a).to.be.closeTo(b, margin);
};
// ----------------------------------------------------------------------------

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
});
