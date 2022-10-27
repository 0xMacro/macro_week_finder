import { ethers, upgrades } from "hardhat";

async function main() {
  const WeekFinder = await ethers.getContractFactory("WeekFinder");
  const weekFinder = await upgrades.deployProxy(WeekFinder);
  await weekFinder.deployed();
  console.log("WeekFinder deployed to:", weekFinder.address);
}

main();
