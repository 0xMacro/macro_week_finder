import hre, { ethers, upgrades } from "hardhat";

let owner: string;


if (hre.network.config.chainId == 31337) {
  owner = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" // first hardhat address
} else if (hre.network.config.chainId == 5) {
  owner = "0x89990a445862b511e00610C456F547b03adBe7Fd" // goerli Macro Gnosis
} else {
  throw new Error(`unknown chainId: ${hre.network.config.chainId}`)
}

async function main() {
  console.log("\n💥 Beginning deployments...\n")

  const WeekFinder = await ethers.getContractFactory("WeekFinder");
  const weekFinder = await upgrades.deployProxy(WeekFinder, [
    "https://time.is/Unix_time_converter",
    owner,
  ])
  await weekFinder.deployed();

  console.log("📅🅿️ WeekFinder Proxy deployed to: ", weekFinder.address)
  const currentImplAddress = await upgrades.erc1967.getImplementationAddress(
    weekFinder.address
  )
  console.log(
    "📅🇮 WeekFinder Implementation deployed to: ",
    currentImplAddress
  )

  console.log("\n🔎 Beginning verifications...\n")

  await verify(weekFinder.address)
}

main();

async function verify(implementation: string) {
  // we don't need to verify the proxy, there are already contracts
  // with the exact bytecode that have already been deployed, so
  // Etherscan auto-verifies it.

  // await hre.run("verify:verify", {
  //   address: proxy,
  //   constructorArguments: [implementation],
  // })
  // console.log("🟢 Proxy Verified")

  // programatic Etherscan verification often fails because
  // Etherscan does not have enough time to index the newly-deployed
  // function before we run the "verify:verify" task. So here we wait for
  // 60 seconds to give Etherscan time to catch up

  console.log("Sleeping for 60 seconds, waiting for Etherscan...")
  await delay(60 * 1_000)

  await hre.run("verify:verify", {
    address: implementation,
    constructorArguments: [],
  })
  console.log("🟢 Implementation Verified\n\n")
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}